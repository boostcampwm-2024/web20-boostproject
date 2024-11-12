import { Module } from '@nestjs/common';
import { WorkerService } from './worker/worker.service';
import { SfuService } from './sfu.service';

@Module({
  providers: [WorkerService, SfuService],
})
export class SfuModule {}
