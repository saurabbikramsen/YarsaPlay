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
import * as argon from 'argon2';
import { PlayDto, PlayerDto, PlayerLoginDto } from './Dto/player.dto';

@Injectable()
export class PlayerService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async getPlayer(id: string) {
    return this.prisma.player.findFirst({
      where: { id },
    });
  }
  getAllPlayers() {
    return this.prisma.player.findMany({ include: { statistics: true } });
  }

  async playGame(playDetail: PlayDto) {
    const player = await this.prisma.player.findUnique({
      where: { email: playDetail.email },
      include: { statistics: true },
    });
    if (!player) {
      throw new UnauthorizedException('you cannot play game');
    }
    const stats = await this.prisma.statistics.update({
      where: { id: player.stats_id },
      data: {
        experience_point: 20,
        games_played: 1,
        games_won: 1,
      },
    });
  }

  async loginPlayer(loginDetails: PlayerLoginDto) {
    const player = await this.prisma.player.findUnique({
      where: { email: loginDetails.email },
    });
    if (!player) {
      throw new NotFoundException('Player Not found');
    }
    const pwMatches = await argon.verify(
      player.password,
      loginDetails.password,
    );
    if (!pwMatches) {
      throw new HttpException(
        "password or email doesn't match",
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = {
      email: player.email,
      role: 'player',
    };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      msg: `welcome ${player.name}`,
    };
  }

  async addPlayer(playerDetails: PlayerDto) {
    const player = await this.prisma.player.findFirst({
      where: { email: playerDetails.email },
    });
    if (!player) {
      const stats = await this.prisma.statistics.create({
        data: {
          experience_point: 0,
          games_played: 0,
          games_won: 0,
        },
      });
      const passwordHash = await argon.hash(playerDetails.password);
      await this.prisma.player.create({
        data: {
          name: playerDetails.name,
          email: playerDetails.email,
          password: passwordHash,
          statistics: { connect: { id: stats.id } },
        },
      });
      const payload = {
        email: playerDetails.email,
        role: 'player',
      };

      const accessToken = await this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken(payload);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        msg: `welcome ${playerDetails.name}`,
      };
    } else {
      throw new BadRequestException('EMAIL ALREADY EXISTS');
    }
  }

  async updatePlayer(id: string, playerDetails: PlayerDto) {
    const player = await this.prisma.player.findUnique({ where: { id } });
    if (!player) {
      throw new NotFoundException('player not found');
    }
    const passwordHash = await argon.hash(playerDetails.password);
    await this.prisma.player.update({
      where: { id },
      data: {
        name: playerDetails.name,
        email: playerDetails.email,
        password: passwordHash,
      },
    });
    return {
      msg: 'Player updated Successfully',
    };
  }

  async deletePlayer(id: string) {
    const player = await this.prisma.player.findFirst({ where: { id } });
    if (!player) {
      throw new NotFoundException('player not found');
    }
    await this.prisma.player.delete({ where: { id } });
    return {
      message: 'player deleted successfully',
    };
  }

  async generateAccessToken(payload: any) {
    const secret = this.config.get('ACCESS_TOKEN_SECRET');
    return this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret,
    });
  }
  async generateRefreshToken(payload: any) {
    const secret = this.config.get('REFRESH_TOKEN_SECRET');
    return this.jwt.signAsync(payload, {
      secret,
      expiresIn: '2h',
    });
  }
}
