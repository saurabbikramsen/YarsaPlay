import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  RefreshDto,
  SeedDto,
  UserDto,
  UserLoginDto,
  UserUpdateDto,
} from './Dto/user.dto';
import * as argon from 'argon2';
import { CommonUtils } from '../utils/common.utils';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private utils: CommonUtils) {}

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
    return this.utils.paginatedResponse(users, skip, take, count);
  }

  async loginUser(loginDetails: UserLoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: loginDetails.email },
      select: { id: true, name: true, email: true, role: true, password: true },
    });
    if (!user) {
      throw new NotFoundException('User Not found');
    }
    return this.utils.loginSignup(user, loginDetails.password);
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

  async updateUser(id: string, userDetails: UserUpdateDto) {
    await this.getUser(id);
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
    const user = await this.getUser(id);
    console.log(user);
    await this.prisma.user.delete({ where: { id } });
    return {
      message: 'user deleted successfully',
    };
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
    return { message: 'Admin already present' };
  }

  async generateNewTokens(refreshDetails: RefreshDto) {
    const token_data = await this.utils.decodeRefreshToken(
      refreshDetails.refreshToken,
    );
    console.log('refresh token: ', token_data);
    return this.utils.generateTokens(token_data);
  }
}
