import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../enums/enums';

export class UserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6)
  password: string;

  @ApiProperty({ enum: ['admin', 'user'] })
  @IsEnum(UserRole)
  role: UserRole;
}

export class UserUpdateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ enum: ['ADMIN', 'USER'] })
  @IsEnum(UserRole)
  role: UserRole;
}

export class UserLoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(6)
  @IsNotEmpty()
  password: string;
}

export class SeedDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6)
  password: string;
}

export class UserGetDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  role: UserRole;
}

export class UserLoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: UserRole;
}

export class RefreshResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
export class RefreshDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
export class UserResponseDto {
  @ApiProperty()
  message: string;
}

export class BulkDto {
  @ApiProperty()
  ids: string;
}
