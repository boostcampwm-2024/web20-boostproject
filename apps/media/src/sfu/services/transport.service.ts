import { Injectable, Logger } from '@nestjs/common';
import { IRoomTransportInfo } from '../interfaces/room-transport-info.interface';
import * as mediasoup from 'mediasoup';
import { CustomWsException } from '../../common/responses/exceptions/custom-ws.exception';
import { ErrorStatus } from '../../common/responses/exceptions/errorStatus';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransportService {
  private roomTransports = new Map<string, IRoomTransportInfo>();
  private readonly logger = new Logger(TransportService.name);

  constructor(private readonly configService: ConfigService) {}

  async createTransport(room: mediasoup.types.Router, isProducer: boolean) {
    const roomTransport = this.getOrCreateRoomTransport(room.id);

    if (isProducer && roomTransport.producerTransportId) {
      throw new CustomWsException(ErrorStatus.PRODUCER_ALREADY_EXISTS_IN_ROOM);
    }
    const transport = await room.createWebRtcTransport({
      listenInfos: [
        {
          protocol: 'udp',
          ip: '0.0.0.0',
          announcedAddress: this.configService.get('ANNOUNCED_IP') || '127.0.0.1',
          portRange: { min: 30000, max: 31000 },
        },
        {
          protocol: 'tcp',
          ip: '0.0.0.0',
          announcedAddress: this.configService.get('ANNOUNCED_IP') || '127.0.0.1',
          portRange: { min: 30000, max: 31000 },
        },
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: isProducer ? 1000000 : undefined,
    });
    roomTransport.transports.set(transport.id, transport);
    if (isProducer) {
      roomTransport.producerTransportId = transport.id;
    }

    this.setUpTransportListeners(transport, room.id);
    this.logger.log(`Transport created: ${transport.id}`);
    return transport;
  }

  async connectTransport(roomId: string, transportId: string, dtlsParameters: mediasoup.types.DtlsParameters) {
    const transport = this.getTransport(roomId, transportId);
    await transport.connect({ dtlsParameters });
    return transportId === this.getProducerTransport(roomId)?.id;
  }

  getTransport(roomId: string, transportId: string) {
    const room = this.getRoomTransport(roomId);
    const transport = room.transports.get(transportId);
    if (!transport) {
      throw new CustomWsException(ErrorStatus.TRANSPORT_NOT_FOUND);
    }
    return transport;
  }

  getProducerTransport(roomId: string) {
    const room = this.getRoomTransport(roomId);
    return room.transports.get(room.producerTransportId);
  }

  getConsumerTransports(roomId: string) {
    const room = this.getRoomTransport(roomId);
    return Array.from(room.transports.entries())
      .filter(([id]) => id !== room.producerTransportId)
      .map(([_, transport]) => transport);
  }

  private getRoomTransport(roomId: string) {
    const room = this.roomTransports.get(roomId);
    if (!room) {
      throw new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);
    }
    return room;
  }

  private getOrCreateRoomTransport(roomId: string) {
    let roomTransport = this.roomTransports.get(roomId);
    if (!roomTransport) {
      roomTransport = { transports: new Map() };
      this.roomTransports.set(roomId, roomTransport);
    }
    return roomTransport;
  }

  private setUpTransportListeners(transport: mediasoup.types.Transport, roomId: string) {
    transport.on('routerclose', () => {
      this.handleTransportClose(transport, roomId);
    });
    transport.observer.on('close', () => {
      this.handleTransportClose(transport, roomId);
    });
  }

  private handleTransportClose(transport: mediasoup.types.Transport, roomId: string) {
    const room = this.roomTransports.get(roomId);
    if (room) {
      room.transports.delete(transport.id);
      if (room.producerTransportId === transport.id) {
        room.producerTransportId = undefined;
      }
      if (room.transports.size === 0) {
        this.roomTransports.delete(roomId);
      }
    }
    this.logger.log(`Transport closed: ${transport.id}`);
    transport.close();
  }
}
