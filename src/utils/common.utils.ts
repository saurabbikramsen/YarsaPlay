import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: string;
  password: string;
}

export interface JwtAccessPayload {
  email: string;
  role: string;
}
export interface JwtRefreshPayload {
  email: string;
  role: string;
  refresh_key: string;
}

@Injectable()
export class CommonUtils {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async generateAccessToken(payload: JwtAccessPayload) {
    const secret = this.config.get('ACCESS_TOKEN_SECRET');
    return this.jwt.signAsync(payload, {
      expiresIn: this.config.get('ACCESS_EXPIRY'),
      secret,
    });
  }

  async generateRefreshToken(payload: JwtRefreshPayload) {
    const secret = this.config.get('REFRESH_TOKEN_SECRET');
    return this.jwt.signAsync(payload, {
      secret,
      expiresIn: this.config.get('REFRESH_EXPIRY'),
    });
  }

  generateRandomString(length: number) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }

  paginatedResponse(data: any, skip: number, take: number, count: number) {
    return {
      data: data,
      meta: {
        totalItems: count,
        itemsPerPage: take,
        currentPage: skip == 0 ? 1 : skip / take + 1,
        totalPages: Math.ceil(count / take),
        hasNextPage: count - skip != take && count > take,
        hasPreviousPage: skip >= take,
      },
      links: {
        first: `/player?page=1&pageSize=${take}`,
        prev: skip == 0 ? null : `/vendor?page=${skip / take}&pageSize=${take}`,
        next:
          count - skip != take && count > take
            ? `/player?page=${skip / take + 2}&pageSize=${take}`
            : null,
        last: `/player?page=${Math.ceil(count / take)}&pageSize=${take}`,
      },
    };
  }

  async loginSignup(userInfo: UserInfo, inputPassword: string) {
    const pwMatches = await argon.verify(userInfo.password, inputPassword);
    if (!pwMatches) {
      throw new HttpException(
        "password or email doesn't match",
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = {
      email: userInfo.email,
      role: userInfo.role,
    };
    const key = this.generateRandomString(6);

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken({
      ...payload,
      refresh_key: key,
    });

    if (userInfo.role == 'player') await this.updatePlayer(userInfo.email, key);
    else await this.updateUser(userInfo.email, key);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      role: userInfo.role,
      name: userInfo.name,
      id: userInfo.id,
    };
  }

  async generateTokens(token_data: JwtRefreshPayload) {
    const key = this.generateRandomString(6);

    if (token_data.role == 'player') {
      const player = await this.prisma.player.findFirst({
        where: { email: token_data.email },
      });

      return this.tokenGenerator(player, key);
    } else if (token_data.role == 'admin' || token_data.role == 'staff') {
      const user = await this.prisma.user.findFirst({
        where: { email: token_data.email },
      });
      return this.tokenGenerator(user, key);
    }
  }
  async tokenGenerator(user, key: string) {
    if (user.refresh_key == key) {
      if (user.role == 'player') await this.updatePlayer(user.email, key);
      else {
        await this.updateUser(user.email, key);
      }

      const payload = {
        email: user.email,
        role: user.role,
      };
      const newAccessToken = await this.generateAccessToken(payload);
      const newRefreshToken = await this.generateRefreshToken({
        ...payload,
        refresh_key: key,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } else {
      throw new UnauthorizedException('you are not eligible');
    }
  }
  async updateUser(email: string, refresh_key: string) {
    await this.prisma.user.update({
      where: { email },
      data: { refresh_key },
    });
  }
  async updatePlayer(email: string, refresh_key: string) {
    await this.prisma.player.update({
      where: { email },
      data: { refresh_key },
    });
  }
}
