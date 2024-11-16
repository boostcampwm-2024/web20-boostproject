import { Injectable, Logger } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { WorkerService } from './worker.service';
import { CustomWsException } from '../../common/responses/exceptions/custom-ws.exception';
import { ErrorStatus } from '../../common/responses/exceptions/errorStatus';

const DEFAULT_RTP_CAPABILITIES: mediasoup.types.RtpCapabilities = {
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

@Injectable()
export class RoomService {
  private rooms = new Map<string, mediasoup.types.Router>();
  private readonly logger = new Logger(RoomService.name);
  constructor(private readonly workerService: WorkerService) {}

  async createRoom() {
    const worker = this.workerService.getWorker();
    const room = await worker.createRouter({ mediaCodecs: DEFAULT_RTP_CAPABILITIES.codecs });
    this.rooms.set(room.id, room);
    this.setupRoomListeners(room);
    this.logger.log(`Room created: ${room.id}`);
    return room;
  }

  getRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);
    }
    return room;
  }

  deleteRoom(roomId: string) {
    const room = this.getRoom(roomId);
    room.close();
  }

  private setupRoomListeners(room: mediasoup.types.Router) {
    room.on('@close', () => {
      this.logger.log(`Room @closed: ${room.id}`);
      this.rooms.delete(room.id);
    });
  }
}
