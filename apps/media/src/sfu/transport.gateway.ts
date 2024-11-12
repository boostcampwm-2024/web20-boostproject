import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SfuGateway } from './sfu.gateway';
import { RouterGateway } from './router.gateway';
import { CustomException } from 'src/common/responses/exceptions/custom.exception';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';
import * as mediasoup from 'mediasoup';

interface TransportParams {
  roomId: string;
  dtlsParameters: mediasoup.types.DtlsParameters;
}

interface RoomTransportInfo {
  producerTransportId?: string;
  transports: Map<string, mediasoup.types.WebRtcTransport>;
}

@WebSocketGateway()
export class TransportGateway {
  @WebSocketServer()
  server: Server;

  private roomTransports = new Map<string, RoomTransportInfo>();

  constructor(private readonly sfuGateway: SfuGateway, private readonly routerGateway: RouterGateway) {}

  @SubscribeMessage('createTransport')
  async handleCreateTransport(roomId: string, isProducer: boolean = false) {
    try {
      const router = this.routerGateway.getRouter(roomId);
      if (!router) {
        throw new CustomException(ErrorStatus.ROOM_NOT_FOUND);
      }

      const roomInfo = this.roomTransports.get(roomId);
      if (!roomInfo) {
        roomInfo.transports = new Map();
        this.roomTransports.set(roomId, roomInfo);
      }

      if (isProducer && roomInfo.producerTransportId) {
        throw new CustomException(ErrorStatus.PRODUCER_ALREADY_EXISTS_IN_ROOM);
      }

      const transport = await router.createWebRtcTransport({
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

      roomInfo.transports.set(transport.id, transport);

      if (isProducer) {
        roomInfo.producerTransportId = transport.id;
      }

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
  async handleConnectTransport(params: TransportParams & { transportId: string }) {
    try {
      const roomInfo = this.roomTransports.get(params.roomId);
      if (!roomInfo) {
        throw new CustomException(ErrorStatus.ROOM_NOT_FOUND);
      }

      const transport = roomInfo.transports.get(params.transportId);
      if (!transport) {
        throw new CustomException(ErrorStatus.TRANSPORT_NOT_FOUND);
      }

      await transport.connect({ dtlsParameters: params.dtlsParameters });

      const isProducer = params.transportId === roomInfo.producerTransportId;

      return {
        connected: true,
        isProducer,
      };
    } catch (error) {
      console.error('Transport connection failed:', error);
      throw error;
    }
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

  // ROOM 삭제 시, 호출 필요
  async cleanupRoom(roomId: string) {
    const roomInfo = this.roomTransports.get(roomId);
    if (roomInfo) {
      for (const transport of roomInfo.transports.values()) {
        transport.close();
      }
      this.roomTransports.delete(roomId);
    }
  }
}
