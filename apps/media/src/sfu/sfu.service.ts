import { ConfigService } from '@nestjs/config';
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
import { BroadcastService } from '../broadcast/broadcast.service';
import { CreateBroadcastDto } from '../broadcast/dto/createBroadcast.dto';
import { ClientService } from './services/client.service';
import { RecordService } from './services/record.service';
import { User } from '../types/user';
import { SetVideoQualityDto } from './dto/set-video-quality.dto';

@Injectable()
export class SfuService {
  constructor(
    private readonly roomService: RoomService,
    private readonly transportService: TransportService,
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
    private readonly broadcasterService: BroadcastService,
    private readonly recordService: RecordService,
    private readonly clientService: ClientService,
    private readonly configService: ConfigService,
  ) {}

  async createRoom(clientId: string, user: User) {
    const room = await this.roomService.createRoom();
    const thumbnail = `${this.configService.get('PUBLIC_RECORD_SERVER_URL')}/statics/thumbnails/${room.id}.jpg`;
    await this.broadcasterService.createBroadcast(
      CreateBroadcastDto.of(room.id, `${user.camperId}님의 방송`, thumbnail, user.id),
    );
    this.clientService.addClientToRoom(clientId, room.id);
    return room;
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

  async createProducer(params: CreateProducerDto) {
    const { roomId, transportId, kind, rtpParameters } = params;
    const room = this.roomService.getRoom(roomId);
    const transport = this.transportService.getTransport(roomId, transportId);
    const producer = await this.producerService.createProducer(transport, kind, rtpParameters);
    await this.recordService.sendStreamForThumbnail(room, producer);
    return producer;
  }

  async createConsumers(params: CreateConsumerDto, clientId: string) {
    const { roomId, transportId } = params;
    const room = this.roomService.getRoom(roomId);
    const producerTransport = this.transportService.getProducerTransport(roomId);
    const producers = this.producerService.getProducers(producerTransport.id);
    await this.canConsume(room, producers);
    const consumerTransport = this.transportService.getTransport(roomId, transportId);
    const consumers = await this.consumerService.createConsumers(consumerTransport, producers, room.rtpCapabilities);
    await this.broadcasterService.incrementViewers(roomId);
    this.clientService.addClientTransport(clientId, consumerTransport.id, roomId);
    return consumers.map(consumer => {
      return {
        consumerId: consumer.id,
        producerId: consumer.producerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
      };
    });
  }

  async stopBroadcast(roomId: string) {
    await this.roomService.deleteRoom(roomId);
  }

  async leaveBroadcast(roomId: string, transportId: string) {
    await this.broadcasterService.decrementViewers(roomId);
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

  async disconnectClient(clientId: string) {
    if (this.clientService.hasRoom(clientId)) {
      const roomId = this.clientService.getClientRoom(clientId);
      await this.stopBroadcast(roomId);
    }
    if (this.clientService.hasTransport(clientId)) {
      const data = this.clientService.getClientTransport(clientId);
      await this.leaveBroadcast(data.roomId, data.transportId);
    }
  }

  async record(roomId: string) {
    const room = this.roomService.getRoom(roomId);
    const transport = this.transportService.getProducerTransport(roomId);
    const producers = this.producerService.getProducers(transport.id);
    await this.recordService.sendStreamForRecord(room, producers);
  }

  async stopRecord(roomId: string, title: string) {
    const room = this.roomService.getRoom(roomId);
    await this.recordService.stopStreamFromRecord(room, title);
  }

  setVideoQuality(params: SetVideoQualityDto) {
    this.consumerService.setConsumerBitrate(params);
  }
}
