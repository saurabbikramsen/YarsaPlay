import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayDto, PlayerDto, PlayerLoginDto } from './Dto/player.dto';
import { UserLoginResponseDto, UserResponseDto } from '../user/Dto/user.dto';

@ApiTags('player')
@Controller('player')
export class PlayerController {
  constructor(private playerService: PlayerService) {}
  @Get('/:id')
  @ApiResponse({ type: PlayerDto })
  getPlayer(@Param('id') id: string) {
    return this.playerService.getPlayer(id);
  }
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @Get()
  @ApiResponse({ type: [PlayerDto] })
  getAllPlayers() {
    return this.playerService.getAllPlayers();
  }

  @Post('play')
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
    return this.playerService.loginPlayer(loginDto);
  }

  @Put('/:id')
  @ApiResponse({ type: UserResponseDto })
  updatePlayer(@Body() playerDto: PlayerDto, @Param('id') id: string) {
    return this.playerService.updatePlayer(id, playerDto);
  }
  @Delete('/:id')
  @ApiResponse({ type: UserResponseDto })
  deletePlayer(@Param('id') id: string) {
    return this.playerService.deletePlayer(id);
  }
}
