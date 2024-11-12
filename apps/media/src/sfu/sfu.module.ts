import { Module } from '@nestjs/common';
import { SfuGateway } from './sfu.gateway';
import { RouterGateway } from './router.gateway';
import { TransportGateway } from './transport.gateway';
import { ProducerGateway } from './producer/producer.gateway';
import { ConsumerGateway } from './consumer/consumer.gateway';

@Module({
  providers: [SfuGateway, RouterGateway, TransportGateway, ProducerGateway, ConsumerGateway],
})
export class SfuModule {}
