import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  UserDto,
  UserLoginDto,
  UserLoginResponseDto,
  UserResponseDto,
} from './Dto/user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id')
  @ApiResponse({ type: UserDto })
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @Get()
  @ApiResponse({ type: [UserDto] })
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post()
  @ApiResponse({ type: UserResponseDto })
  addUser(@Body() userDto: UserDto) {
    return this.userService.addUser(userDto);
  }

  @Post('login')
  @ApiResponse({ type: UserLoginResponseDto })
  loginUser(@Body() loginDto: UserLoginDto) {
    return this.userService.loginUser(loginDto);
  }

  @Put('/:id')
  @ApiResponse({ type: UserResponseDto })
  updateUser(@Body() userDto: UserDto, @Param('id') id: string) {
    return this.userService.updateUser(id, userDto);
  }
  @Delete('/:id')
  @ApiResponse({ type: UserResponseDto })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
