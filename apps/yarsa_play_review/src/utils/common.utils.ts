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
const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export interface JwtAccessPayload {
  id: string;
  role: string;
}
export interface JwtRefreshPayload {
  id: string;
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
    const key = this.generateRandomString(6);

    const tokens = await this.tokenPayload(userInfo, key);

    if (userInfo.role == 'player') await this.updatePlayer(userInfo.email, key);
    else await this.updateUser(userInfo.email, key);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      role: userInfo.role,
      name: userInfo.name,
      id: userInfo.id,
    };
  }

  async generateTokens(token_data: JwtRefreshPayload) {
    const key = this.generateRandomString(6);

    if (token_data.role == 'player') {
      const player = await this.prisma.player.findFirst({
        where: { id: token_data.id },
      });

      return this.tokenGenerator(player, key);
    } else if (token_data.role == 'admin' || token_data.role == 'staff') {
      const user = await this.prisma.user.findFirst({
        where: { id: token_data.id },
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
      return this.tokenPayload;
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
  async decodeRefreshToken(token: string) {
    return this.jwt.verify(token, {
      secret: this.config.get('REFRESH_TOKEN_SECRET'),
    });
  }

  async decodeAccessToken(token: string) {
    return this.jwt.verify(token, {
      secret: this.config.get('ACCESS_TOKEN_SECRET'),
    });
  }
  async tokenPayload(userInfo: UserInfo, key: string) {
    const payload = {
      id: userInfo.id,
      role: userInfo.role,
    };
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken({
      ...payload,
      refresh_key: key,
    });
    return { accessToken, refreshToken };
  }
}
