import { ProducerGateway } from './../producer/producer.gateway';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
// import { IConsumer } from './consumer.interface';
import { CreateConsumerDto } from './create-consumer.dto';
import { RouterGateway } from '../router.gateway';
import { TransportGateway } from '../transport.gateway';
import * as mediasoup from 'mediasoup';

@WebSocketGateway()
export class ConsumerGateway {
  @WebSocketServer()
  server: Server;
  private consumers: Map<string, mediasoup.types.Consumer[]>;

  constructor(
    private readonly routerGateway: RouterGateway,
    private readonly transportGateway: TransportGateway,
    private readonly producerGateway: ProducerGateway,
  ) {}

  @SubscribeMessage('createConsumer')
  async handleCreateConsumer(@MessageBody() data: CreateConsumerDto) {
    try {
      const { transportId, rtpCapabilities, roomId } = data;

      const room = this.routerGateway.getRoom(roomId);

      if (!room) {
        throw new Error(`Room not found: ${roomId}`);
      }

      // producerId로 해당 방의 producer가 있는지 확인
      const canConsume = await this.canConsume(room, rtpCapabilities);

      if (!canConsume) {
        throw new Error('Cannot consume this producer');
      }
      const consumers = await this.createConsumer(roomId, transportId, rtpCapabilities);
      return {
        consumers,
      };
    } catch (error) {
      //TODO: 에러처리 통일
      console.error('Create Consumer Error:', error);
      return { error: error };
    }
  }

  async createConsumer(roomId: string, transportId: string, rtpCapabilities: any) {
    // const { transportId, producerId, rtpCapabilities } = params;

    // TODO: transport쪽에서 transport를 가져오는 로직 필요
    const transport = this.transportGateway.getTransport(roomId, transportId);

    if (!transport) {
      throw new Error(`Transport not found: ${transportId}`);
    }

    const producers = this.producerGateway.getProducersByRoomId(roomId);

    const consumers = await Promise.all(
      producers.map(producer =>
        transport.consume({
          producerId: producer.id,
          rtpCapabilities,
          paused: true,
        }),
      ),
    );

    if (!this.consumers.has(transportId)) {
      this.consumers.set(transportId, []);
    }
    this.consumers.get(transportId).push(...consumers);
    return consumers;
  }

  async canConsume(room: mediasoup.types.Router, rtpCapabilities: any) {
    const producers = this.producerGateway.getProducersByRoomId(room.id);
    if (!producers) return false;
    return producers.every(producer => {
      return room.canConsume({ producerId: producer.id, rtpCapabilities });
    });
  }
}
