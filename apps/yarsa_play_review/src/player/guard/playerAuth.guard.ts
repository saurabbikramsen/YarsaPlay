import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlayerAuthGuard implements CanActivate {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authorization = request?.headers.authorization;
      if (authorization) {
        const token = authorization.slice(7, authorization.length);
        const token_data = await this.jwtService.verify(token, {
          secret: this.config.get('ACCESS_TOKEN_SECRET'),
        });

        console.log('token data is', token_data);
        const player = await this.prisma.player.findFirst({
          where: { email: token_data.email },
        });

        if (
          (token_data.role == 'player' && player.active == true) ||
          token_data.role == 'admin' ||
          token_data.role == 'staff'
        ) {
          return true;
        } else {
          throw new ForbiddenException(
            'you are not eligible to perform this task',
          );
        }
      } else {
        throw new NotFoundException('no token found');
      }
      return false;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token is expired');
      }
      throw error;
    }
  }
}
