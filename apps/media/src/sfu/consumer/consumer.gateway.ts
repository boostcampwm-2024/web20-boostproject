import { ProducerGateway } from './../producer/producer.gateway';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Consumer } from 'mediasoup/node/lib/Consumer';
import { Server } from 'socket.io';
import { IConsumer } from './consumer.interface';
import { CreateConsumerDto } from './create-consumer.dto';
import { RouterGateway } from '../router.gateway';
import { TransportGateway } from '../transport.gateway';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ConsumerGateway {
  @WebSocketServer()
  server: Server;
  private consumers: Map<string, Consumer[]>;

  constructor(
    private readonly routerGateway: RouterGateway,
    private readonly transportGateway: TransportGateway,
    private readonly producerGateway: ProducerGateway,
  ) {}

  @SubscribeMessage('createConsumer')
  async handleCreateConsumer(@MessageBody() data: CreateConsumerDto) {
    try {
      const { transportId, producerId, rtpCapabilities, roomId } = data;

      const router = this.routerGateway.getRouter(roomId);

      if (!router) {
        throw new Error(`Room not found: ${roomId}`);
      }

      // producerId로 해당 방의 producer가 있는지 확인
      const canConsume = await this.canConsume(roomId, producerId, rtpCapabilities);

      if (!canConsume) {
        throw new Error('Cannot consume this producer');
      }

      const consumer = await this.createConsumer({
        transportId,
        producerId,
        rtpCapabilities,
      });

      return {
        consumerId: consumer.id,
        rtpParameters: consumer.rtpParameters,
      };
    } catch (error) {
      //TODO: 에러처리 통일
      console.error('Create Consumer Error:', error);
      return { error: error };
    }
  }

  async createConsumer(params: IConsumer): Promise<Consumer> {
    const { transportId, producerId, rtpCapabilities } = params;

    // TODO: transport쪽에서 transport를 가져오는 로직 필요
    const transport = await this.transportGateway.getTransport(params.transportId);

    if (!transport) {
      throw new Error(`Transport not found: ${params.transportId}`);
    }

    const consumer = await transport.consume({
      producerId,
      rtpCapabilities,
      paused: true,
    });

    if (!this.consumers.has(transportId)) {
      this.consumers.set(transportId, []);
    }
    this.consumers.get(transportId).push(consumer);

    await consumer.resume();

    return consumer;
  }

  async canConsume(roomId: string, producerId: string, rtpCapabilities: any): Promise<boolean> {
    const router = this.routerGateway.getRouter(roomId);
    const producers = this.producerGateway.getProducersByRoomId(roomId);
    const producer = producers.find(p => p.id === producerId);

    if (!producer) return false;

    return router.canConsume({
      producerId: producer.id,
      rtpCapabilities,
    });
  }
}
