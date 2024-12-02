import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { ApiClient } from '../common/clients/api.client';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  providers: [
    MemberService,
    {
      provide: 'API_CLIENT',
      useClass: ApiClient,
    },
  ],
  exports: [MemberService],
})
export class MemberModule {}
