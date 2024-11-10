import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { redisConfig } from '../config/redis.config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Redis(redisConfig(configService)),
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
