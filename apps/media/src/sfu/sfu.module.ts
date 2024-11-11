import { Module } from '@nestjs/common';
import { SfuGateway } from './sfu.gateway';
import { RouterGateway } from './router.gateway';

@Module({
  providers: [SfuGateway, RouterGateway],
})
export class SfuModule {}
