import { Module } from '@nestjs/common';
import { WorkerService } from './services/worker.service';
import { SfuService } from './sfu.service';
import { SfuGateway } from './sfu.gateway';
import { RoomService } from './services/room.service';
import { TransportService } from './services/transport.service';
import { ProducerService } from './services/producer.service';
import { ConsumerService } from './services/consumer.service';

@Module({
  providers: [WorkerService, SfuService, SfuGateway, RoomService, TransportService, ProducerService, ConsumerService],
})
export class SfuModule {}
