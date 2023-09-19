import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  RefreshDto,
  SeedDto,
  UserDto,
  UserLoginDto,
  UserUpdateDto,
} from './Dto/user.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  async getUser(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) {
      throw new NotFoundException('user Not found');
    }
    return user;
  }
  async getAllUsers(searchKey: string, take: number, skip: number) {
    const users = await this.prisma.user.findMany({
      where: { name: { contains: searchKey } },
      skip,
      take,
      select: { id: true, name: true, email: true, role: true },
    });
    const count = await this.prisma.user.count({
      where: { name: { contains: searchKey } },
    });
    return {
      data: users,
      meta: {
        totalItems: count,
        itemsPerPage: take,
        currentPage: skip == 0 ? 1 : skip / take + 1,
        totalPages: Math.ceil(count / take),
        hasNextPage: count - skip != take && count > take,
        hasPreviousPage: skip >= take,
      },
      links: {
        first: `/user?page=1&pageSize=${take}`,
        prev: skip == 0 ? null : `/vendor?page=${skip / take}&pageSize=${take}`,
        next:
          count - skip != take && count > take
            ? `/user?page=${skip / take + 2}&pageSize=${take}`
            : null,
        last: `/user?page=${Math.ceil(count / take)}&pageSize=${take}`,
      },
    };
  }

  async loginUser(loginDetails: UserLoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: loginDetails.email },
    });
    if (!user) {
      throw new NotFoundException('User Not found');
    }
    const pwMatches = await argon.verify(user.password, loginDetails.password);
    if (!pwMatches) {
      throw new HttpException(
        "password or email doesn't match",
        HttpStatus.UNAUTHORIZED,
      );
    }
    const refresh_key = generateRandomString(6);

    const payload = {
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken({
      ...payload,
      refresh_key,
    });

    await this.prisma.user.update({
      where: { email: loginDetails.email },
      data: { refresh_key },
    });

    return {
      accessToken,
      refreshToken,
      role: user.role,
      name: user.name,
      id: user.id,
    };
  }

  async addUser(userDetails: UserDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: userDetails.email },
    });
    if (!user) {
      const passwordHash = await argon.hash(userDetails.password);
      await this.prisma.user.create({
        data: {
          name: userDetails.name,
          email: userDetails.email,
          password: passwordHash,
          role: userDetails.role,
        },
      });
      return { message: 'user created successfully' };
    } else {
      throw new BadRequestException('User Already Exists');
    }
  }
  async seedAdmin(seedDetails: SeedDto) {
    const count = await this.prisma.user.count();
    if (!count) {
      const hashPassword = await argon.hash(seedDetails.password);
      await this.prisma.user.create({
        data: {
          name: seedDetails.name,
          email: seedDetails.email,
          password: hashPassword,
          role: 'admin',
        },
      });
      return { message: 'Admin seeded successfully' };
    }
    throw new BadRequestException('user already present no need to seed');
  }

  async generateRefresh(refreshDetails: RefreshDto) {
    const token_data = this.jwtService.verify(refreshDetails.refreshToken, {
      secret: this.config.get('REFRESH_TOKEN_SECRET'),
    });
    const key = generateRandomString(6);

    if (token_data.role == 'player') {
      const player = await this.prisma.player.findFirst({
        where: { email: token_data.email },
      });

      if (token_data.refresh_key == player.refresh_key) {
        const tokens = await this.tokenGenerator(player, key);

        await this.prisma.player.update({
          where: { email: token_data.email },
          data: { refresh_key: key },
        });
        return tokens;
      } else {
        throw new UnauthorizedException('you are not eligible');
      }
    } else if (token_data.role == 'admin' || token_data.role == 'staff') {
      const user = await this.prisma.user.findFirst({
        where: { email: token_data.email },
      });
      if (token_data.refresh_key == user.refresh_key) {
        const tokens = await this.tokenGenerator(user, key);
        await this.prisma.user.update({
          where: { email: token_data.email },
          data: { refresh_key: key },
        });
        return tokens;
      } else {
        throw new UnauthorizedException('you are not eligible');
      }
    }
  }

  async updateUser(id: string, userDetails: UserUpdateDto) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        name: userDetails.name,
        email: userDetails.email,
        role: userDetails.role,
      },
    });
    return {
      message: 'User updated Successfully',
    };
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    console.log('user is', user);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.prisma.user.delete({ where: { id } });
    return {
      message: 'user deleted successfully',
    };
  }

  async generateAccessToken(payload) {
    const secret = this.config.get('ACCESS_TOKEN_SECRET');
    return this.jwtService.signAsync(payload, {
      expiresIn: this.config.get('ACCESS_EXPIRY'),
      secret,
    });
  }

  async generateRefreshToken(payload) {
    const secret = this.config.get('REFRESH_TOKEN_SECRET');
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: this.config.get('REFRESH_EXPIRY'),
    });
  }

  async tokenGenerator(user, key) {
    const payload = {
      email: user.email,
      role: user.role,
      key: key,
    };
    const newAccessToken = await this.generateAccessToken(payload);
    const newRefreshToken = await this.generateRefreshToken(payload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
export function generateRandomString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}
