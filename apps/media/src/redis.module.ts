import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const redisConfig = {
          host: configService.get('REDIS_HOST'),
          port: parseInt(configService.get('REDIS_PORT')),
          db: parseInt(configService.get('REDIS_MEDIA')),
          retryStrategy: (times: number) => {
            console.log(`Retry attempt ${times}`);
            return Math.min(times * 50, 2000);
          },
        };

        console.log('Creating Redis connection with:', redisConfig);

        const client = new Redis(redisConfig);

        client.on('connect', () => {
          console.log('Successfully connected to Redis');
        });

        client.on('error', err => {
          console.error('Redis error:', err);
        });

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
