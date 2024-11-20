import { Module } from '@nestjs/common';
import { WorkerService } from './services/worker.service';
import { SfuService } from './sfu.service';
import { SfuGateway } from './sfu.gateway';
import { RoomService } from './services/room.service';
import { TransportService } from './services/transport.service';
import { ProducerService } from './services/producer.service';
import { ConsumerService } from './services/consumer.service';
import { BroadcastModule } from '../broadcast/broadcast.module';
import { RecordService } from './services/record.service';

@Module({
  imports: [BroadcastModule],
  providers: [
    WorkerService,
    SfuService,
    SfuGateway,
    RoomService,
    TransportService,
    ProducerService,
    ConsumerService,
    RecordService,
  ],
})
export class SfuModule {}
