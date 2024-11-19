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
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SfuService {
  constructor(
    private readonly roomService: RoomService,
    private readonly transportService: TransportService,
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
    private readonly broadcasterService: BroadcastService,
  ) {}

  async createRoom() {
    const room = await this.roomService.createRoom();
    await this.broadcasterService.createBroadcast(CreateBroadcastDto.of(room.id, 'title', null));
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
    this.sendStream(room, producer);

    return producer;
  }

  async createConsumers(params: CreateConsumerDto) {
    const { roomId, transportId } = params;
    const room = this.roomService.getRoom(roomId);
    const producerTransport = this.transportService.getProducerTransport(roomId);
    const producers = this.producerService.getProducers(producerTransport.id);
    await this.canConsume(room, producers);
    const consumerTransport = this.transportService.getTransport(roomId, transportId);
    const consumers = await this.consumerService.createConsumers(consumerTransport, producers, room.rtpCapabilities);
    await this.broadcasterService.incrementViewers(roomId);
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

  private async sendStream(room: mediasoup.types.Router, producer: mediasoup.types.Producer) {
    console.log('sendStream 함수 실행');
    const transport = await this.transportService.createRecordTransport(room);
    const consumers = await this.consumerService.createConsumers(transport, [producer], room.rtpCapabilities);
    await this.createSdpFile(producer);
    console.log(consumers);
    transport.connect({ ip: '127.0.0.1', port: 5000 });
  }

  private async createSdpFile(producer: mediasoup.types.Producer) {
    const { kind, rtpParameters } = producer;
    if (kind === 'audio') return;
    const videoCodec = rtpParameters.codecs.find(codec => codec.mimeType.toLowerCase().startsWith('video'));
    if (!videoCodec) {
      throw new Error('No video codec found in producer');
    }

    const sdpContent = `
  v=0
  o=- 0 0 IN IP4 127.0.0.1
  s=Mediasoup Stream
  c=IN IP4 127.0.0.1
  t=0 0
  m=${kind} 5000 RTP/AVP ${videoCodec.payloadType}
  a=rtpmap:${videoCodec.payloadType} ${videoCodec.mimeType.split('/')[1]}/${videoCodec.clockRate}
  a=fmtp:${videoCodec.payloadType} ${Object.entries(videoCodec.parameters || {})
      .map(([key, value]) => `${key}=${value}`)
      .join(';')}
  a=sendonly
  `.trim();
    const outputFilePath = path.join(__dirname, 'stream.sdp');
    // Save SDP content to file
    fs.writeFileSync(outputFilePath, sdpContent, 'utf8');
    console.log(`SDP file created at ${outputFilePath}`);
  }
}
