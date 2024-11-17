import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiClient } from 'src/common/clients/api.client';
import { BroadcastService } from './broadcast.service';
import { TestBroadcastController } from './test.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: 5,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TestBroadcastController],
  providers: [
    {
      provide: 'API_CLIENT',
      useClass: ApiClient,
    },
    BroadcastService,
  ],
  exports: [BroadcastService],
})
export class BroadcastModule {}
