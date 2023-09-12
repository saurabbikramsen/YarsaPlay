import {
  BadRequestException,
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from './guard/admin.auth.guard';
import { StaffAuthGuard } from './guard/staff.auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(StaffAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a specific user for the id',
  })
  @Get('/:id')
  @ApiResponse({ type: UserGetDto })
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
  @UseGuards(StaffAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all the Users',
  })
  @Get()
  @ApiResponse({ type: [UserGetDto] })
  getAllUsers() {
    return this.userService.getAllUsers();
  }
  // @UseGuards(AdminAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Adding a new user (admin/staff)',
  })
  @Post()
  @ApiResponse({ type: UserResponseDto })
  addUser(@Body() userDto: UserDto) {
    if (!userDto) {
      throw new BadRequestException('Invalid request body.');
    }
    return this.userService.addUser(userDto);
  }

  @Post('login')
  @ApiResponse({ type: UserLoginResponseDto })
  @ApiOperation({
    summary: 'User(admin/staff) login',
  })
  loginUser(@Body() loginDto: UserLoginDto) {
    return this.userService.loginUser(loginDto);
  }

  @Post('generaterefresh')
  @ApiResponse({ type: RefreshResponseDto })
  @ApiOperation({
    summary: 'set the refresh token to expired',
  })
  expireRefreshToken(@Body() refreshDto: RefreshDto) {
    return this.userService.generateRefresh(refreshDto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Updating the user data',
  })
  @Put('/:id')
  @ApiResponse({ type: UserResponseDto })
  updateUser(@Body() userDto: UserDto, @Param('id') id: string) {
    return this.userService.updateUser(id, userDto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a specific user with id',
  })
  @Delete('/:id')
  @ApiResponse({ type: UserResponseDto })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
