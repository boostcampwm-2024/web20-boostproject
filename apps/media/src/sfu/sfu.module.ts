import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WorkerService } from './services/worker.service';
import { SfuService } from './sfu.service';
import { SfuGateway } from './sfu.gateway';
import { RoomService } from './services/room.service';
import { TransportService } from './services/transport.service';
import { ProducerService } from './services/producer.service';
import { ConsumerService } from './services/consumer.service';
import { BroadcastModule } from '../broadcast/broadcast.module';
import { ClientService } from './services/client.service';
import { RecordService } from './services/record.service';
import { RecordClient } from 'src/common/clients/record.client';

@Module({
  imports: [BroadcastModule, HttpModule],
  providers: [
    WorkerService,
    SfuService,
    SfuGateway,
    RoomService,
    TransportService,
    ProducerService,
    ConsumerService,
    RecordService,
    ClientService,
    {
      provide: 'RECORD_CLIENT',
      useClass: RecordClient,
    },
  ],
})
export class SfuModule {}
