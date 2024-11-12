import { SfuService } from './sfu.service';
import { WorkerService } from './worker/worker.service';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import * as mediasoup from 'mediasoup';
import { ConnectTransportDto } from './dto/transport-params.interface';
import { CreateProducerDto } from './dto/create-producer.dto';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { CreateTransportDto } from './dto/create-transport.dto';

@WebSocketGateway({ cors: { origin: '*', methods: ['GET', 'POST'] } })
export class SfuGateway {
  @WebSocketServer()
  server: Server;

  private rtpCapabilities: mediasoup.types.RtpCapabilities = {
    codecs: [
      {
        mimeType: 'audio/opus',
        kind: 'audio',
        clockRate: 48000,
        channels: 2,
      },
      {
        mimeType: 'video/VP8',
        kind: 'video',
        clockRate: 90000,
      },
    ],
    headerExtensions: [],
  };

  constructor(private readonly workerService: WorkerService, private readonly sfuService: SfuService) {}

  @SubscribeMessage('getRtpCapabilities')
  handleGetRtpCapabilities() {
    return { rtpCapabilities: this.rtpCapabilities };
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom() {
    try {
      const worker = this.workerService.getWorker();
      const room = await worker.createRouter({ mediaCodecs: this.rtpCapabilities.codecs });
      this.sfuService.setRoom(room.id, room);

      return { roomId: room.id };
    } catch (error) {
      return error;
    }
  }

  @SubscribeMessage('createTransport')
  async handleCreateTransport(@MessageBody() params: CreateTransportDto) {
    try {
      const { isProducer } = params;

      const transport = await this.sfuService.createTransport(params);

      return {
        transportId: transport.id,
        isProducer,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      };
    } catch (error) {
      return error;
    }
  }

  @SubscribeMessage('connectTransport')
  async handleConnectTransport(@MessageBody() params: ConnectTransportDto) {
    try {
      const isProducer = await this.sfuService.connectTransport(params);

      return {
        connected: true,
        isProducer,
      };
    } catch (error) {
      return error;
    }
  }

  @SubscribeMessage('createProducer')
  async handleCreateProducer(@MessageBody() params: CreateProducerDto) {
    try {
      const producer = await this.sfuService.createProducer(params);

      return {
        producerId: producer.id,
      };
    } catch (error) {
      return error;
    }
  }

  @SubscribeMessage('createConsumer')
  async handleCreateConsumer(@MessageBody() params: CreateConsumerDto) {
    try {
      const consumers = await this.sfuService.createConsumer(params);

      return {
        consumers,
      };
    } catch (error) {
      return error;
    }
  }
}
