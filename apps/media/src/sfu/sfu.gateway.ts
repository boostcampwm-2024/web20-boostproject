import { SfuService } from './sfu.service';
import { WorkerService } from './worker/worker.service';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ConnectTransportDto } from './dto/transport-params.interface';
import { CreateProducerDto } from './dto/create-producer.dto';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { CreateTransportDto } from './dto/create-transport.dto';

@WebSocketGateway({ cors: { origin: '*', methods: ['GET', 'POST'] } })
export class SfuGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly workerService: WorkerService, private readonly sfuService: SfuService) {}

  @SubscribeMessage('getRtpCapabilities')
  handleGetRtpCapabilities() {
    return { rtpCapabilities: this.workerService.getRtpCapabilities() };
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom() {
    try {
      const room = await this.workerService.createRoom();
      this.sfuService.setRoom(room);

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

  //TODO: 방송종료
  //TODO: deleteConsumer (시청자가 나간 상황)
}
