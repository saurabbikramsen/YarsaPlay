import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PlayerDto, PlayerUpdateDto } from './Dto/player.dto';
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
        select: {
          id: true,
          name: true,
          active: true,
          statistics: {
            select: {
              games_won: true,
              coins: true,
              games_played: true,
              experience_point: true,
            },
          },
        },
      });
    } else {
      return this.prisma.player.findFirst({
        where: { id },
        select: {
          id: true,
          name: true,
          active: true,
          statistics: {
            select: {
              games_won: true,
              coins: true,
              games_played: true,
              experience_point: true,
            },
          },
        },
      });
    }
  }

  async getAllPlayers(search: string, take: number, skip: number) {
    const players = await this.prisma.player.findMany({
      where: { name: { contains: search } },
      skip,
      take,
      select: {
        id: true,
        name: true,
        active: true,
        statistics: {
          select: {
            coins: true,
            experience_point: true,
            games_played: true,
            games_won: true,
          },
        },
      },
    });
    const count = await this.prisma.player.count({
      where: { name: { contains: search } },
    });

    return {
      data: players,
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

  async setInactive(id: string) {
    const player = await this.prisma.player.findFirst({ where: { id } });
    if (!player) {
      throw new NotFoundException('no player found');
    }
    await this.prisma.player.update({
      where: { id },
      data: { active: player.active != true },
    });
    if (player.active == true) {
      return { message: 'player set to Inactive' };
    } else {
      return { message: 'player set to Active' };
    }
  }

  async playGame(id: string) {
    const player = await this.prisma.player.findFirst({
      where: { id },
      include: { statistics: true },
    });
    if (!player || player.active == false) {
      throw new BadRequestException('you cannot play the game');
    }
    const game_won = Boolean(Math.round(Math.random()));
    console.log(game_won);

    const points = Math.floor(Math.random() * (20 - 10 + 1) + 10);
    console.log(points);

    const xp = player.statistics.experience_point;
    await this.prisma.statistics.update({
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
    if (game_won == true) {
      return { message: 'game won' };
    }
    return { message: 'game lost' };
  }

  async getLeaderboard() {
    const players = await this.prisma.player.findMany({
      where: { active: true },
      select: {
        name: true,
        active: true,
        statistics: {
          select: {
            experience_point: true,
            coins: true,
            games_won: true,
            games_played: true,
          },
        },
      },
      orderBy: { statistics: { experience_point: 'desc' } },
      take: 5,
    });

    return players.map((player, index) => {
      const rank = index + 1;
      return { ...player, rank };
    });
  }

  async loginSignup(playerDetails: PlayerDto) {
    const player = await this.prisma.player.findFirst({
      where: { email: playerDetails.email },
    });
    if (!player) {
      const passwordHash = await argon.hash(playerDetails.password);
      const newPlayer = await this.prisma.player.create({
        data: {
          name: playerDetails.name,
          email: playerDetails.email,
          password: passwordHash,
          statistics: {
            create: { experience_point: 0, games_played: 0, games_won: 0 },
          },
        },
      });
      return await this.loginSignupDetail(newPlayer);
    } else {
      const pwMatches = await argon.verify(
        player.password,
        playerDetails.password,
      );
      if (!pwMatches) {
        throw new UnauthorizedException("password or email doesn't match");
      }
      return this.loginSignupDetail(player);
    }
  }

  async updatePlayer(id: string, playerDetails: PlayerUpdateDto) {
    const player = await this.prisma.player.findFirst({ where: { id } });

    if (!player) {
      throw new NotFoundException('player not found');
    }
    await this.prisma.player.update({
      where: { id },
      data: {
        name: playerDetails.name,
        email: playerDetails.email,
      },
    });
    return {
      message: 'Player Updated Successfully',
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

  async loginSignupDetail(newPlayer) {
    const payload = {
      email: newPlayer.email,
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
