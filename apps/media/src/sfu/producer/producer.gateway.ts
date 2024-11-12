import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CreateProducerDto } from './create-producer.dto';
import { ICreateProducerParams } from './producer.interface';
import { Producer } from 'mediasoup/node/lib/Producer';
import { RouterGateway } from '../router.gateway';
import { TransportGateway } from '../transport.gateway';

@WebSocketGateway()
export class ProducerGateway {
  @WebSocketServer()
  server: Server;
  private producers: Map<string, Producer[]>;

  constructor(private readonly routerGateway: RouterGateway, private readonly transportGateway: TransportGateway) {}

  @SubscribeMessage('createProducer')
  async handleCreateProducer(@MessageBody() data: CreateProducerDto) {
    try {
      const { roomId, transportId, kind, rtpParameters } = data;

      const producer = await this.createProducer({
        roomId,
        transportId,
        kind,
        rtpParameters,
      });

      return {
        producerId: producer.id,
      };
    } catch (error) {
      //TODO: 에러처리 통일
      console.error('Create Producer Error:', error);
      return { error };
    }
  }

  async createProducer(params: ICreateProducerParams): Promise<Producer> {
    const { roomId, transportId, kind, rtpParameters } = params;

    const router = this.routerGateway.getRouter(roomId);

    if (!router) {
      throw new Error(`Room not found: ${roomId}`);
    }

    // TODO: transport쪽에서 transport를 가져오는 로직 필요
    const transport = await this.transportGateway.getTransport(transportId);

    if (!transport) {
      // CustomException 구현 필요
      throw new Error(`Transport not found: ${transportId}`);
    }

    const producer = await transport.produce({
      kind,
      rtpParameters,
    });

    if (!this.producers.has(roomId)) {
      this.producers.set(roomId, []);
    }
    this.producers.get(roomId).push(producer);

    return producer;
  }
}
