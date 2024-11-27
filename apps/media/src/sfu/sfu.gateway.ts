import { SfuService } from './sfu.service';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectTransportDto } from './dto/transport-params.interface';
import { CreateProducerDto } from './dto/create-producer.dto';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UseFilters } from '@nestjs/common';
import { WebSocketExceptionFilter } from 'src/common/filter/webSocketException.filter';
import { SetVideoQualityDto } from './dto/set-video-quality.dto';

@WebSocketGateway({ cors: { origin: '*', methods: ['GET', 'POST'] } })
@UseFilters(WebSocketExceptionFilter)
export class SfuGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly sfuService: SfuService) {}

  @SubscribeMessage('createRoom')
  async handleCreateRoom(client: Socket) {
    const room = await this.sfuService.createRoom(client.id);
    return { roomId: room.id };
  }

  @SubscribeMessage('getRtpCapabilities')
  handleGetRtpCapabilities(@MessageBody('roomId') roomId: string) {
    const rtpCapabilities = this.sfuService.getRtpCapabilities(roomId);
    return { rtpCapabilities };
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
  async handleCreateConsumer(@MessageBody() params: CreateConsumerDto, @ConnectedSocket() client: Socket) {
    const consumers = await this.sfuService.createConsumers(params, client.id);
    return {
      consumers,
    };
  }

  //방송종료
  @SubscribeMessage('stopBroadcast')
  handleStopBroadcast(@MessageBody('roomId') roomId: string) {
    try {
      this.sfuService.stopBroadcast(roomId);
      return {
        isCleaned: true,
        roomId,
      };
    } catch (error) {
      return error;
    }
  }

  //시청 종료
  @SubscribeMessage('leaveBroadcast')
  handleLeaveBroadcast(@MessageBody('transportId') transportId: string, @MessageBody('roomId') roomId: string) {
    try {
      this.sfuService.leaveBroadcast(roomId, transportId);
      return {
        success: true,
      };
    } catch (error) {
      return error;
    }
  }

  @SubscribeMessage('startRecord')
  async handleRecord(@MessageBody('roomId') roomId: string) {
    await this.sfuService.record(roomId);
  }

  @SubscribeMessage('stopRecord')
  async handleStopRecord(@MessageBody('roomId') roomId: string, @MessageBody('title') title: string) {
    await this.sfuService.stopRecord(roomId, title);
  }

  //시청 종료
  @SubscribeMessage('setVideoQuality')
  handleVideoQuality(@MessageBody() params: SetVideoQualityDto) {
    this.sfuService.setVideoQuality(params);
  }

  async handleDisconnect(client: Socket) {
    await this.sfuService.disconnectClient(client.id);
  }
}
