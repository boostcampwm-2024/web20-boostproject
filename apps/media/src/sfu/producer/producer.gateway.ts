import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CreateProducerDto } from './create-producer.dto';
import { ICreateProducerParams } from './producer.interface';
import { RouterGateway } from '../router.gateway';
import { TransportGateway } from '../transport.gateway';
import * as mediasoup from 'mediasoup';

@WebSocketGateway()
export class ProducerGateway {
  @WebSocketServer()
  server: Server;
  private producers: Map<string, mediasoup.types.Producer[]>;

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

  async createProducer(params: ICreateProducerParams) {
    const { roomId, transportId, kind, rtpParameters } = params;

    const room = this.routerGateway.getRoom(roomId);

    if (!room) {
      throw new Error(`Room not found: ${roomId}`);
    }

    const transport = this.transportGateway.getTransport(roomId, transportId);

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

  getProducersByRoomId(roomId: string): mediasoup.types.Producer[] {
    return this.producers[roomId];
  }
}
