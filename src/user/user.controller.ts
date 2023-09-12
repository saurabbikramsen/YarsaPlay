import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  RefreshDto,
  RefreshResponseDto,
  UserDto,
  UserGetDto,
  UserLoginDto,
  UserLoginResponseDto,
  UserResponseDto,
} from './Dto/user.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from './guard/admin.auth.guard';
import { StaffAuthGuard } from './guard/staff.auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(StaffAuthGuard)
  @ApiBearerAuth()
  @Get('/:id')
  @ApiResponse({ type: UserGetDto })
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
  @UseGuards(StaffAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiResponse({ type: [UserGetDto] })
  getAllUsers() {
    return this.userService.getAllUsers();
  }
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiResponse({ type: UserResponseDto })
  addUser(@Body() userDto: UserDto) {
    console.log('inside add user');
    return this.userService.addUser(userDto);
  }

  @Post('login')
  @ApiResponse({ type: UserLoginResponseDto })
  loginUser(@Body() loginDto: UserLoginDto) {
    return this.userService.loginUser(loginDto);
  }

  @Post('refresh')
  @ApiResponse({ type: RefreshResponseDto })
  generateRefresh(@Body() refreshDto: RefreshDto) {
    return this.userService.generateRefresh(refreshDto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Put('/:id')
  @ApiResponse({ type: UserResponseDto })
  updateUser(@Body() userDto: UserDto, @Param('id') id: string) {
    console.log('check If inside the function');
    return this.userService.updateUser(id, userDto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Delete('/:id')
  @ApiResponse({ type: UserResponseDto })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
