import { SfuGateway } from './sfu.gateway';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
// import { RtpCapabilities } from 'mediasoup/node/lib/RtpParameters';
// import { Router } from 'mediasoup/node/lib/Router';
import * as mediasoup from 'mediasoup';

@WebSocketGateway()
export class RouterGateway {
  @WebSocketServer()
  server: Server;
  private rtpCapabilities: mediasoup.types.RtpCapabilities = {
    codecs: [
      {
        mimeType: 'audio/opus',
        kind: 'audio',
        clockRate: 48000,
        channels: 2,
      },
      {
        mimeType: 'video/VP8',
        kind: 'video',
        clockRate: 90000,
      },
    ],
    headerExtensions: [],
  };
  private routers = new Map<string, mediasoup.types.Router>();
  constructor(private readonly sfuGateway: SfuGateway) {}

  @SubscribeMessage('getRtpCapabilities')
  handleGetRtpCapabilities() {
    return { rtpCapabilities: this.rtpCapabilities };
  }

  @SubscribeMessage('createRouter')
  async handleCreateRouter() {
    const worker = this.sfuGateway.getWorker();
    const router = await worker.createRouter({ mediaCodecs: this.rtpCapabilities.codecs });
    this.routers.set(router.id, router);
    return { roomId: router.id };
  }

  getRouter(routerId: string) {
    return this.routers.get(routerId);
  }

  deleteRouter(routerId: string) {
    this.routers.delete(routerId);
  }
}
