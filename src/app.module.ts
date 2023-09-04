import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PlayerModule } from './player/player.module';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      socket: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
    JwtModule,
    UserModule,
    PrismaModule,
    PlayerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [JwtModule],
})
export class AppModule {}
