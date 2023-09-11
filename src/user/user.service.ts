import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto, UserLoginDto } from './Dto/user.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async getUser(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('user Not found');
    }
    return user;
  }
  getAllUsers() {
    return this.prisma.user.findMany({});
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
    const payload = {
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      message: `welcome ${user.name}`,
      role: user.role,
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
      throw new BadRequestException('EMAIL ALREADY EXISTS');
    }
  }

  async updateUser(id: string, userDetails: UserDto) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const passwordHash = await argon.hash(userDetails.password);

    await this.prisma.user.update({
      where: { id },
      data: {
        name: userDetails.name,
        email: userDetails.email,
        password: passwordHash,
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
    return this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret,
    });
  }
  async generateRefreshToken(payload) {
    const secret = this.config.get('REFRESH_TOKEN_SECRET');
    return this.jwt.signAsync(payload, {
      secret,
      expiresIn: '2h',
    });
  }
}
