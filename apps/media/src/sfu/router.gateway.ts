import { SfuGateway } from './sfu.gateway';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
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
  private rooms = new Map<string, mediasoup.types.Router>();
  constructor(private readonly sfuGateway: SfuGateway) {}

  @SubscribeMessage('getRtpCapabilities')
  handleGetRtpCapabilities() {
    return { rtpCapabilities: this.rtpCapabilities };
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom() {
    const worker = this.sfuGateway.getWorker();
    const room = await worker.createRouter({ mediaCodecs: this.rtpCapabilities.codecs });
    this.rooms.set(room.id, room);

    return { roomId: room.id };
  }

  getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }

  deleteRoom(roomId: string) {
    this.rooms.delete(roomId);
  }
}
