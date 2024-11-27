import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mediasoup from 'mediasoup';
import { firstValueFrom, lastValueFrom } from 'rxjs';

const STREAM_TYPE = {
  RECORD: 'record',
  THUMBNAIL: 'thumbnail',
};

@Injectable()
export class RecordService {
  private readonly recordServerUrl: string;
  private readonly serverPrivateIp: string;
  private readonly announcedIp: string;

  private transports = new Map<string, mediasoup.types.Transport>();

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    this.recordServerUrl = this.configService.get<string>('RECORD_SERVER_URL', 'http://localhost:3003');
    this.serverPrivateIp = this.configService.get<string>('SERVER_PRIVATE_IP', '127.0.0.1');
    this.announcedIp = this.configService.get<string>('ANNOUNCED_IP', '127.0.0.1');
  }

  async sendStreamForThumbnail(room: mediasoup.types.Router, producer: mediasoup.types.Producer) {
    const recordTransport = await this.createPlainTransport(room);
    const rtpCapabilities = this.getRtpCapabilities(room, producer.kind);
    const recordConsumer = await recordTransport.consume({
      producerId: producer.id,
      rtpCapabilities,
      paused: true,
      preferredLayers: {
        spatialLayer: 2,
        temporalLayer: 2,
      },
    });

    setTimeout(async () => {
      await recordConsumer.resume();
      await recordConsumer.requestKeyFrame();
    }, 1000);

    const { port } = await this.getAvailablePort();

    await recordTransport.connect({ ip: this.serverPrivateIp, port });

    this.setUpRecordTransportListeners(recordTransport, port, room.id);
    this.setUpRecordConsumerListeners(recordConsumer);

    await this.sendStreamRequest(room.id, port, STREAM_TYPE.THUMBNAIL);
  }

  async sendStreamForRecord(room: mediasoup.types.Router, producers: mediasoup.types.Producer[]) {
    const ports = { video: null, audio: null };
    const consumers = await Promise.all(
      producers.map(async producer => {
        const recordTransport = await this.createPlainTransport(room);
        this.transports.set(room.id, recordTransport);

        const rtpCapabilities = this.getRtpCapabilities(room, producer.kind);
        const recordConsumer = await recordTransport.consume({
          producerId: producer.id,
          rtpCapabilities,
          paused: true,
          preferredLayers: {
            spatialLayer: 1,
            temporalLayer: 1,
          },
        });

        const { port } = await this.getAvailablePort();

        if (producer.kind === 'audio') {
          ports.audio = port;
        } else {
          ports.video = port;
        }

        await recordTransport.connect({ ip: this.serverPrivateIp, port });
        this.setUpRecordTransportListeners(recordTransport, port, room.id);
        this.setUpRecordConsumerListeners(recordConsumer);
        return recordConsumer;
      }),
    );

    setTimeout(async () => {
      for (const consumer of consumers) {
        await consumer.resume();
        await consumer.requestKeyFrame();
      }
    }, 1000);

    await this.sendStreamRequest(room.id, ports.video, STREAM_TYPE.RECORD, ports.audio);
  }

  async stopStreamFromRecord(room: mediasoup.types.Router, title: string) {
    const recordTransport = this.transports.get(room.id);
    if (!recordTransport) {
      return;
    }
    recordTransport.close();
    this.transports.delete(room.id);
    await this.stopRecordRequest(room.id, title);
  }

  async createPlainTransport(room: mediasoup.types.Router) {
    return await room.createPlainTransport({
      listenInfo: {
        protocol: 'udp',
        ip: '0.0.0.0',
        announcedAddress: this.announcedIp,
        portRange: { min: 30000, max: 31000 },
      },
      rtcpMux: true,
    });
  }

  private setUpRecordTransportListeners(recordTransport: mediasoup.types.Transport, port: number, roomId: string) {
    recordTransport.on('routerclose', async () => {
      await lastValueFrom(
        this.httpService.post(`${this.recordServerUrl}/close`, {
          port,
          roomId,
        }),
      );
      recordTransport.close();
    });
    recordTransport.observer.on('close', async () => {
      await firstValueFrom(
        this.httpService.post(`${this.recordServerUrl}/close`, {
          port,
          roomId,
        }),
      );
    });
  }

  private setUpRecordConsumerListeners(recordConsumer: mediasoup.types.Consumer) {
    recordConsumer.on('transportclose', () => {
      recordConsumer.close();
    });
  }

  private getRtpCapabilities(room: mediasoup.types.Router, kind: string) {
    const routerCodec = room.rtpCapabilities.codecs.find(codec => codec.kind === kind);
    if (!routerCodec) {
      throw new Error(`No codec found for kind: ${kind}`);
    }
    return {
      codecs: [routerCodec],
      rtcpFeedback: [],
    };
  }

  private async getAvailablePort(): Promise<{ port: number }> {
    const response = await lastValueFrom(this.httpService.get(`${this.recordServerUrl}/availablePort`));
    return response.data;
  }

  private async sendStreamRequest(roomId: string, videoPort: number, type: string, audioPort?: number) {
    await firstValueFrom(
      this.httpService.post(`${this.recordServerUrl}/send`, {
        roomId,
        videoPort,
        type,
        audioPort,
      }),
    );
  }

  private async stopRecordRequest(roomId: string, title: string) {
    await firstValueFrom(
      this.httpService.post(`${this.recordServerUrl}/record/stop/${roomId}`, {
        title: title,
      }),
    );
  }
}
