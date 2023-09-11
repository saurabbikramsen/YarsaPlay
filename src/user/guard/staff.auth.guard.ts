import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StaffAuthGuard implements CanActivate {
  constructor(private config: ConfigService, private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authorization = request?.headers.authorization;
      if (authorization) {
        const token = authorization.slice(7, authorization.length);

        const token_data = this.jwtService.verify(token, {
          secret: this.config.get('ACCESS_TOKEN_SECRET'),
        });

        if (token_data.role == 'staff' || token_data.role == 'admin') {
          return true;
        } else {
          new UnauthorizedException(
            'you are not eligible to perform this task',
          );
        }
      } else {
        new NotFoundException('no token found');
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}
