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
  PlayDto,
  PlayerDto,
  PlayerGetDto,
  PlayerLeaderboardDto,
  PlayerLoginDto,
  PlayerUpdateDto,
  Statistics,
} from './Dto/player.dto';
import { UserLoginResponseDto, UserResponseDto } from '../user/Dto/user.dto';
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
    summary: 'Getting the leaderboard data of the players',
  })
  @Post('leaderboard')
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
      return data;
    }
  }
  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the data of a specific player',
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
    summary: 'Getting all the players',
  })
  getAllPlayers() {
    return this.playerService.getAllPlayers();
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Play game to earn XP and coins',
  })
  @Post('play')
  @ApiResponse({ type: Statistics })
  playGame(@Body() playDto: PlayDto) {
    return this.playerService.playGame(playDto);
  }

  @Post()
  @ApiResponse({ type: UserResponseDto })
  @ApiOperation({
    summary: 'Creating a new player',
  })
  addPlayer(@Body() playerDto: PlayerDto) {
    return this.playerService.addPlayer(playerDto);
  }

  @Post('login')
  @ApiResponse({ type: UserLoginResponseDto })
  @ApiOperation({
    summary: 'Player login',
  })
  loginPlayer(@Body() loginDto: PlayerLoginDto) {
    return this.playerService.loginPlayer(loginDto);
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update the player data',
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
    summary: 'Deleting a player',
  })
  @Delete('/:id')
  @ApiResponse({ type: UserResponseDto })
  deletePlayer(@Param('id') id: string) {
    return this.playerService.deletePlayer(id);
  }
}
