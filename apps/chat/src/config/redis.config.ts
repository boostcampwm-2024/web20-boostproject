import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export const redisConfig = (configService: ConfigService): RedisOptions => ({
  host: configService.get<string>('REDIS_HOST'),
  port: configService.get<number>('REDIS_PORT'),
  password: configService.get<string>('REDIS_PASSWORD'),
  db: configService.get<number>('REDIS_DB'),
  keyPrefix: configService.get<string>('REDIS_KEY_PREFIX'),
});
