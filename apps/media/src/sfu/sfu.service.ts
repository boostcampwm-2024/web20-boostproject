import { Injectable } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { ConnectTransportDto } from './dto/transport-params.interface';
import { RoomService } from './services/room.service';
import { TransportService } from './services/transport.service';
import { ProducerService } from './services/producer.service';
import { ConsumerService } from './services/consumer.service';
import { CreateTransportDto } from './dto/create-transport.dto';
import { CreateProducerDto } from './dto/create-producer.dto';
import { CreateConsumerDto } from './dto/create-consumer.dto';

@Injectable()
export class SfuService {
  constructor(
    private readonly roomService: RoomService,
    private readonly transportService: TransportService,
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  createRoom() {
    return this.roomService.createRoom();
  }

  getRtpCapabilities(roomId: string) {
    return this.roomService.getRoom(roomId).rtpCapabilities;
  }

  createTransport(params: CreateTransportDto) {
    const { roomId, isProducer } = params;
    const room = this.roomService.getRoom(roomId);
    return this.transportService.createTransport(room, isProducer);
  }

  connectTransport(params: ConnectTransportDto) {
    const { roomId, transportId, dtlsParameters } = params;
    return this.transportService.connectTransport(roomId, transportId, dtlsParameters);
  }

  createProducer(params: CreateProducerDto) {
    const { roomId, transportId, kind, rtpParameters } = params;
    this.roomService.getRoom(roomId);
    const transport = this.transportService.getTransport(roomId, transportId);
    return this.producerService.createProducer(transport, kind, rtpParameters);
  }

  async createConsumers(params: CreateConsumerDto) {
    const { roomId, transportId } = params;
    const room = this.roomService.getRoom(roomId);
    const producerTransport = this.transportService.getProducerTransport(roomId);
    const producers = this.producerService.getProducers(producerTransport.id);
    await this.canConsume(room, producers);
    const consumerTransport = this.transportService.getTransport(roomId, transportId);
    const consumers = await this.consumerService.createConsumers(consumerTransport, producers, room.rtpCapabilities);
    return consumers.map(consumer => {
      return {
        consumerId: consumer.id,
        producerId: consumer.producerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
      };
    });
  }

  stopBroadcast(roomId: string) {
    this.roomService.deleteRoom(roomId);
  }

  leaveBroadcast(roomId: string, transportId: string) {
    this.transportService.getTransport(roomId, transportId).close();
  }

  private async canConsume(room: mediasoup.types.Router, producers: mediasoup.types.Producer[]) {
    for (const producer of producers) {
      if (!room.canConsume({ producerId: producer.id, rtpCapabilities: room.rtpCapabilities })) {
        return false;
      }
    }
    return true;
  }
}
