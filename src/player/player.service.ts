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
import {
  PlayDto,
  PlayerDto,
  PlayerLoginDto,
  PlayerUpdateDto,
} from './Dto/player.dto';
import { generateRandomString } from '../user/user.service';

@Injectable()
export class PlayerService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async getPlayer(id: string) {
    if (id.includes(',')) {
      const players_ids = id.split(',');
      return this.prisma.player.findMany({
        where: { id: { in: players_ids }, active: true },
      });
    } else {
      return this.prisma.player.findFirst({ where: { id } });
    }
  }

  getAllPlayers() {
    return this.prisma.player.findMany({
      select: { name: true, active: true, statistics: true },
    });
  }

  async setInactive(id: string) {
    const player = await this.prisma.player.findFirst({ where: { id } });
    if (!player) {
      throw new NotFoundException('no player found');
    }
    await this.prisma.player.update({
      where: { id },
      data: { active: false },
    });

    return { message: 'player set to Inactive' };
  }

  async playGame(playDetail: PlayDto) {
    const player = await this.prisma.player.findUnique({
      where: { email: playDetail.email },
      include: { statistics: true },
    });
    if (!player || player.active == false) {
      throw new UnauthorizedException('you cannot play game');
    }
    const game_won = Boolean(Math.round(Math.random()));
    console.log(game_won);

    const points = Math.floor(Math.random() * (20 - 10 + 1) + 10);
    console.log(points);

    const xp = player.statistics.experience_point;
    const stats = await this.prisma.statistics.update({
      where: { id: player.stats_id },
      data: {
        experience_point: game_won ? xp + points : xp < 20 ? xp : xp - points,
        games_played: player.statistics.games_played + 1,
        games_won: game_won
          ? player.statistics.games_won + 1
          : player.statistics.games_won,
        coins: player.statistics.coins + points,
      },
    });
    return stats;
  }

  async getLeaderboard() {
    const players = await this.prisma.player.findMany({
      include: { statistics: true },
      orderBy: { statistics: { experience_point: 'desc' } },
    });

    return players.map((player, index) => {
      const rank = index + 1;
      return { ...player, rank };
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
    const key = generateRandomString(6);
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken({
      ...payload,
      refresh_key: key,
    });
    await this.prisma.player.update({
      where: { email: player.email },
      data: { refresh_key: key },
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      role: 'player',
      name: player.name,
      id: player.id,
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
      const newPlayer = await this.prisma.player.create({
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
      const key = generateRandomString(6);

      const accessToken = await this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken({
        ...payload,
        refresh_key: key,
      });
      await this.prisma.player.update({
        where: { email: newPlayer.email },
        data: { refresh_key: key },
      });

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        role: 'player',
        name: newPlayer.name,
        id: newPlayer.id,
      };
    } else {
      throw new BadRequestException('EMAIL ALREADY EXISTS');
    }
  }

  async updatePlayer(id: string, playerDetails: PlayerUpdateDto) {
    const player = await this.prisma.player.findFirst({ where: { id } });
    console.log(id);
    console.log(player);
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
      message: 'Player updated Successfully',
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
      expiresIn: this.config.get('ACCESS_EXPIRY'),
      secret,
    });
  }
  async generateRefreshToken(payload: any) {
    const secret = this.config.get('REFRESH_TOKEN_SECRET');
    return this.jwt.signAsync(payload, {
      secret,
      expiresIn: this.config.get('REFRESH_EXPIRY'),
    });
  }
}
