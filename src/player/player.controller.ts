import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  PlayerDto,
  PlayerGetDto,
  PlayerLeaderboardDto,
  PlayerUpdateDto,
  Statistics,
} from './Dto/player.dto';
import { UserResponseDto } from '../user/Dto/user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PlayerAuthGuard } from './guard/playerAuth.guard';
import { StaffAuthGuard } from '../user/guard/staff.auth.guard';
import { AdminAuthGuard } from '../user/guard/admin.auth.guard';
import * as process from 'process';

@ApiTags('player')
@Controller('player')
export class PlayerController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private playerService: PlayerService,
  ) {}

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the leaderboard data of the top 5 players',
  })
  @Get('leaderboard')
  @ApiResponse({ type: [PlayerLeaderboardDto] })
  async getLeaderboard() {
    const leaderboardData = await this.cacheManager.get('leaderboard');
    if (leaderboardData) {
      return leaderboardData;
    } else {
      const data = await this.playerService.getLeaderboard();
      await this.cacheManager.set(
        'leaderboard',
        data,
        parseInt(process.env.REDIS_STORE_TIME, 10),
      );
      return data.slice(0, 5);
    }
  }
  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Get the data of a specific player or bulk of players by providing multiple Id's seperated by comma",
  })
  @Get('/:id')
  @ApiResponse({ type: PlayerGetDto })
  getPlayer(@Param('id') id: string) {
    return this.playerService.getPlayer(id);
  }

  @UseGuards(StaffAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiResponse({ type: [PlayerGetDto] })
  @ApiOperation({
    summary: 'Get all the players',
  })
  getAllPlayers() {
    return this.playerService.getAllPlayers();
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Play game to earn XP and coins',
  })
  @Get('play/:id')
  @ApiResponse({ type: Statistics })
  playGame(@Param('id') id: string) {
    return this.playerService.playGame(id);
  }

  @Post()
  @ApiResponse({ type: UserResponseDto })
  @ApiOperation({
    summary: 'login(needed email & password only) or signup a player',
  })
  addPlayer(@Body() playerDto: PlayerDto) {
    return this.playerService.loginSignup(playerDto);
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update the player data with the given id',
  })
  @Put('/:id')
  @ApiResponse({ type: UserResponseDto })
  updatePlayer(@Body() playerDto: PlayerUpdateDto, @Param('id') id: string) {
    return this.playerService.updatePlayer(id, playerDto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserResponseDto })
  @ApiOperation({
    summary: 'Set the player to inactive state',
  })
  @Patch('setInactive/:id')
  setInactive(@Param('id') id: string) {
    return this.playerService.setInactive(id);
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a player',
  })
  @Delete('/:id')
  @ApiResponse({ type: UserResponseDto })
  deletePlayer(@Param('id') id: string) {
    return this.playerService.deletePlayer(id);
  }
}
