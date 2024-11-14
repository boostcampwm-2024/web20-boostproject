import { Injectable } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { IRoomTransportInfo } from './interfaces/room-transport-info.interface';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';
import { CustomWsException } from 'src/common/responses/exceptions/custom-ws.exception';
import { ConnectTransportDto } from './dto/transport-params.interface';

@Injectable()
export class SfuService {
  private rooms = new Map<string, mediasoup.types.Router>();
  private roomTransports = new Map<string, IRoomTransportInfo>();
  private producers = new Map<string, mediasoup.types.Producer[]>();
  private consumers = new Map<string, mediasoup.types.Consumer[]>();

  //Room
  setRoom(room: mediasoup.types.Router) {
    this.rooms.set(room.id, room);
  }

  cleanupRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    room.close();
    this.rooms.delete(roomId);
  }

  //transport
  async createTransport(params) {
    const { roomId, isProducer } = params;

    const room = this.rooms.get(roomId);

    if (!room) {
      throw new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);
    }

    let roomTransportInfo = this.roomTransports.get(roomId);

    if (!roomTransportInfo) {
      roomTransportInfo = {
        transports: new Map(),
      };
      this.roomTransports.set(roomId, roomTransportInfo);
    }

    if (isProducer && roomTransportInfo.producerTransportId) {
      throw new CustomWsException(ErrorStatus.PRODUCER_ALREADY_EXISTS_IN_ROOM);
    }

    const transport = await room.createWebRtcTransport({
      listenIps: [
        {
          ip: '0.0.0.0',
          announcedIp: process.env.ANNOUNCED_IP || '127.0.0.1',
        },
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: isProducer ? 1000000 : undefined,
    });

    transport.on('routerclose', () => {
      transport.close();
      //TODO: transport 객체 삭제 로직 구현
    });

    roomTransportInfo.transports.set(transport.id, transport);

    if (isProducer) {
      roomTransportInfo.producerTransportId = transport.id;
    }

    return transport;
  }

  async connectTransport(params: ConnectTransportDto) {
    const roomInfo = this.roomTransports.get(params.roomId);

    if (!roomInfo) {
      throw new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);
    }

    const transport = roomInfo.transports.get(params.transportId);

    if (!transport) {
      throw new CustomWsException(ErrorStatus.TRANSPORT_NOT_FOUND);
    }

    await transport.connect({ dtlsParameters: params.dtlsParameters });

    return params.transportId === roomInfo.producerTransportId;
  }

  // 원하는 TRANSPORT 반환
  getTransport(roomId: string, transportId: string) {
    return this.roomTransports.get(roomId)?.transports.get(transportId);
  }

  // 방송자의 TRANSPORT 반환
  getProducerTransport(roomId: string) {
    const roomInfo = this.roomTransports.get(roomId);
    if (!roomInfo || !roomInfo.producerTransportId) return null;
    return roomInfo.transports.get(roomInfo.producerTransportId);
  }

  // 모든 시청자의 TRANSPORT 반환
  getConsumerTransports(roomId: string) {
    const roomInfo = this.roomTransports.get(roomId);
    if (!roomInfo) return [];

    return Array.from(roomInfo.transports.entries())
      .filter(([id]) => id !== roomInfo.producerTransportId)
      .map(([_, transport]) => transport);
  }

  //producer
  async createProducer(params) {
    const { roomId, transportId, kind, rtpParameters } = params;

    const room = this.rooms.get(roomId);

    if (!room) {
      throw new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);
    }

    const transport = this.getTransport(roomId, transportId);

    if (!transport) {
      // CustomWsException 구현 필요
      throw new CustomWsException(ErrorStatus.TRANSPORT_NOT_FOUND);
    }

    const producer = await transport.produce({
      kind,
      rtpParameters,
    });

    producer.on('transportclose', () => {
      producer.close();
      //TODO: producer 객체 삭제 로직 구현
    });

    if (!this.producers.has(transportId)) {
      this.producers.set(transportId, []);
    }
    this.producers.get(transportId).push(producer);

    return producer;
  }

  getProducersByRoomId(roomId: string): mediasoup.types.Producer[] {
    const roomInfo = this.roomTransports.get(roomId);
    if (!roomInfo) {
      throw new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);
    }

    const producersTransportId = roomInfo.producerTransportId;
    if (!producersTransportId) {
      throw new CustomWsException(ErrorStatus.NO_HAVE_PRODUCER_TRANSPORT_IN_ROOM);
    }

    return this.producers.get(producersTransportId);
  }

  //consumer
  async createConsumer(params) {
    const { transportId, rtpCapabilities, roomId } = params;

    const room = this.rooms.get(roomId);
    if (!room) {
      throw new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);
    }

    const canConsume = await this.canConsume(room, rtpCapabilities);
    if (!canConsume) {
      throw new CustomWsException(ErrorStatus.CANNOT_CONSUME_PRODUCER);
    }

    const transport = this.getTransport(roomId, transportId);
    if (!transport) {
      throw new CustomWsException(ErrorStatus.TRANSPORT_NOT_FOUND);
    }

    const producers = this.getProducersByRoomId(roomId);

    const consumers = await Promise.all(
      producers.map(async producer => {
        const consumer = await transport.consume({
          producerId: producer.id,
          rtpCapabilities,
          paused: true,
        });

        this.addConsumerEvent(consumer);
        return consumer;
      }),
    );

    if (!this.consumers.has(transportId)) {
      this.consumers.set(transportId, []);
    }

    this.consumers.get(transportId).push(...consumers);

    return consumers.map(consumer => {
      return {
        consumerId: consumer.id,
        producerId: consumer.producerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
      };
    });
  }

  async canConsume(room: mediasoup.types.Router, rtpCapabilities: any) {
    const producers = this.getProducersByRoomId(room.id);
    if (!producers) return false;
    return producers.every(producer => {
      return room.canConsume({ producerId: producer.id, rtpCapabilities });
    });
  }

  addConsumerEvent(consumer: mediasoup.types.Consumer) {
    consumer.on('transportclose', () => {
      consumer.close();
      //TODO: consumer 객체 삭제 로직 구현
    });

    consumer.on('producerclose', () => {
      consumer.close();
      //TODO: consumer 객체 삭제 로직 구현
    });

    consumer.on('producerpause', () => {
      consumer.pause();
    });

    consumer.on('producerresume', () => {
      consumer.resume();
    });
  }
}
