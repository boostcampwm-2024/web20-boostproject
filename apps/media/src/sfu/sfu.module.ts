import { Module } from '@nestjs/common';
import { WorkerService } from './worker/worker.service';
import { SfuService } from './sfu.service';
import { SfuGateway } from './sfu.gateway';

@Module({
  providers: [WorkerService, SfuService, SfuGateway],
})
export class SfuModule {}
