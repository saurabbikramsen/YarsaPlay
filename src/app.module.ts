import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PlayerModule } from './player/player.module';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import * as process from 'process';

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
        port: parseInt(process.env.REDIS_PORT, 10),
      },
    }),
    JwtModule,
    UserModule,
    PrismaModule,
    PlayerModule,
  ],

  exports: [JwtModule],
})
export class AppModule {}
