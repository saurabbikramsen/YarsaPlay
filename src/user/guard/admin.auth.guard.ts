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
export class AdminAuthGuard implements CanActivate {
  constructor(private config: ConfigService, private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authorization = request?.headers.authorization;
      console.log(request.headers);
      if (authorization) {
        const token = authorization.slice(7, authorization.length);
        console.log(token);

        const token_data = this.jwtService.verify(token, {
          secret: this.config.get('ACCESS_TOKEN_SECRET'),
        });

        if (token_data.role == 'admin') {
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
