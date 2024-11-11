import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export const redisConfig = (configService: ConfigService): RedisOptions => ({
  host: configService.get<string>('REDIS_HOST'),
  port: configService.get<number>('REDIS_PORT'),
  db: configService.get<number>('REDIS_CHAT'),
});
