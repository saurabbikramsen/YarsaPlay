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
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PlayDto,
  PlayerDto,
  PlayerGetDto,
  PlayerLoginDto,
  PlayerUpdateDto,
  Statistics,
} from './Dto/player.dto';
import { UserLoginResponseDto, UserResponseDto } from '../user/Dto/user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@ApiTags('player')
@Controller('player')
export class PlayerController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private playerService: PlayerService,
  ) {}

  @Post('leaderboard')
  @ApiResponse({ type: [PlayerGetDto] })
  async getLeaderboard(@Body() playerDto: PlayDto) {
    const leaderboardData = await this.cacheManager.get('leaderboard');
    if (leaderboardData) {
      return leaderboardData;
    } else {
      const data = await this.playerService.getLeaderboard(playerDto);
      await this.cacheManager.set('leaderboard', data, 300000);
      return data;
    }
  }
  @Get('/:id')
  @ApiResponse({ type: PlayerGetDto })
  getPlayer(@Param('id') id: string) {
    return this.playerService.getPlayer(id);
  }
  // @UseGuards(PlayerAuthGuard)
  // @ApiBearerAuth()
  @Get()
  @ApiResponse({ type: [PlayerGetDto] })
  getAllPlayers() {
    return this.playerService.getAllPlayers();
  }

  @Post('play')
  @ApiResponse({ type: Statistics })
  playGame(@Body() playDto: PlayDto) {
    return this.playerService.playGame(playDto);
  }

  @Post()
  @ApiResponse({ type: UserResponseDto })
  addPlayer(@Body() playerDto: PlayerDto) {
    return this.playerService.addPlayer(playerDto);
  }

  @Post('login')
  @ApiResponse({ type: UserLoginResponseDto })
  loginPlayer(@Body() loginDto: PlayerLoginDto) {
    console.log('hello');
    return this.playerService.loginPlayer(loginDto);
  }

  @Put('/:id')
  @ApiResponse({ type: UserResponseDto })
  updatePlayer(@Body() playerDto: PlayerUpdateDto, @Param('id') id: string) {
    return this.playerService.updatePlayer(id, playerDto);
  }

  @Patch('setInactive/:id')
  setInactive(@Param('id') id: string) {
    return this.playerService.setInactive(id);
  }

  @Delete('/:id')
  @ApiResponse({ type: UserResponseDto })
  deletePlayer(@Param('id') id: string) {
    return this.playerService.deletePlayer(id);
  }
}
