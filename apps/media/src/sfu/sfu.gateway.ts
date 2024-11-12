import { SfuService } from './sfu.service';
import { WorkerService } from './worker/worker.service';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import * as mediasoup from 'mediasoup';
import { CustomException } from 'src/common/responses/exceptions/custom.exception';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';
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
    const worker = this.workerService.getWorker();
    const room = await worker.createRouter({ mediaCodecs: this.rtpCapabilities.codecs });
    this.sfuService.setRoom(room.id, room);

    return { roomId: room.id };
  }

  @SubscribeMessage('createTransport')
  async handleCreateTransport(@MessageBody() params: CreateTransportDto) {
    try {
      const { roomId, isProducer } = params;

      const room = this.sfuService.getRoom(roomId);
      if (!room) {
        throw new CustomException(ErrorStatus.ROOM_NOT_FOUND);
      }
      const transport = await this.sfuService.createTransport(roomId, room, isProducer);

      return {
        transportId: transport.id,
        isProducer,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      };
    } catch (error) {
      console.error('Transport creation failed:', error);
      throw error;
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
      console.error('Transport connection failed:', error);
      throw error;
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
      //TODO: 에러처리 통일
      console.error('Create Producer Error:', error);
      return { error };
    }
  }

  @SubscribeMessage('createConsumer')
  async handleCreateConsumer(@MessageBody() params: CreateConsumerDto) {
    try {
      const { transportId, rtpCapabilities, roomId } = params;

      const room = this.sfuService.getRoom(roomId);

      if (!room) {
        throw new Error(`Room not found: ${roomId}`);
      }

      // producerId로 해당 방의 producer가 있는지 확인
      const canConsume = await this.sfuService.canConsume(room, rtpCapabilities);

      if (!canConsume) {
        throw new Error('Cannot consume this producer');
      }
      const consumers = await this.sfuService.createConsumer(roomId, transportId, rtpCapabilities);
      return {
        consumers,
      };
    } catch (error) {
      //TODO: 에러처리 통일
      console.error('Create Consumer Error:', error);
      return { error: error };
    }
  }
}
