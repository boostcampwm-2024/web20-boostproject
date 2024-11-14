import { SfuService } from './sfu.service';
import { WorkerService } from './worker/worker.service';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ConnectTransportDto } from './dto/transport-params.interface';
import { CreateProducerDto } from './dto/create-producer.dto';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UseFilters } from '@nestjs/common';
import { WebSocketExceptionFilter } from 'src/common/filter/webSocketException.filter';

@WebSocketGateway({ cors: { origin: '*', methods: ['GET', 'POST'] } })
@UseFilters(WebSocketExceptionFilter)
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
    const room = await this.workerService.createRoom();
    this.sfuService.setRoom(room);
    return { roomId: room.id };
  }

  @SubscribeMessage('createTransport')
  async handleCreateTransport(@MessageBody() params: CreateTransportDto) {
    const { isProducer } = params;
    const transport = await this.sfuService.createTransport(params);

    return {
      transportId: transport.id,
      isProducer,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    };
  }

  @SubscribeMessage('connectTransport')
  async handleConnectTransport(@MessageBody() params: ConnectTransportDto) {
    const isProducer = await this.sfuService.connectTransport(params);

    return {
      connected: true,
      isProducer,
    };
  }

  @SubscribeMessage('createProducer')
  async handleCreateProducer(@MessageBody() params: CreateProducerDto) {
    const producer = await this.sfuService.createProducer(params);

    return {
      producerId: producer.id,
    };
  }

  @SubscribeMessage('createConsumer')
  async handleCreateConsumer(@MessageBody() params: CreateConsumerDto) {
    const consumers = await this.sfuService.createConsumer(params);

    return {
      consumers,
    };
  }

  //방송종료
  @SubscribeMessage('stopBroadcast')
  handleStopBroadcast(@MessageBody('roomId') roomId: string) {
    try {
      this.sfuService.cleanupRoom(roomId);

      return {
        isCleaned: true,
        roomId,
      };
    } catch (error) {
      return error;
    }
  }

  //스트림 일시 중단
}
