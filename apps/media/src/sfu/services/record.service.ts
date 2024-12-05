import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mediasoup from 'mediasoup';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { QUALITY, QUALITY_LAYER } from '../constants/quality-layer.constant';

const STREAM_TYPE = {
  RECORD: 'record',
  THUMBNAIL: 'thumbnail',
};

@Injectable()
export class RecordService {
  private readonly recordServerUrl: string;
  private readonly apiServerUrl: string;
  private readonly serverPrivateIp: string;
  private readonly announcedIp: string;

  private transports = new Map<string, mediasoup.types.Transport[]>();

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    this.recordServerUrl = this.configService.get<string>('RECORD_SERVER_URL', 'http://localhost:3003');
    this.apiServerUrl = this.configService.get<string>('API_SERVER_URL', '127.0.0.1');
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
        spatialLayer: QUALITY_LAYER[QUALITY.HIGH],
        temporalLayer: 2,
      },
    });

    setTimeout(async () => {
      await recordConsumer.resume();
      await recordConsumer.requestKeyFrame();
    }, 1000);

    const { port } = await this.getAvailablePort();

    await recordTransport.connect({ ip: this.serverPrivateIp, port });

    this.setUpRecordTransportListeners(recordTransport, port);
    this.setUpRecordConsumerListeners(recordConsumer);

    await this.sendStreamRequest(room.id, port, STREAM_TYPE.THUMBNAIL);
  }

  async sendStreamForRecord(room: mediasoup.types.Router, producers: mediasoup.types.Producer[]) {
    const ports = { video: null, audio: null };
    const consumers = await Promise.all(
      producers.map(async producer => {
        const recordTransport = await this.createPlainTransport(room);
        if (this.transports.get(room.id)) {
          this.transports.get(room.id).push(recordTransport);
        } else {
          this.transports.set(room.id, [recordTransport]);
        }
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
        ports[producer.kind] = port;
        this.setUpRecordConsumerListeners(recordConsumer);
        await recordTransport.connect({ ip: this.serverPrivateIp, port });
        this.setUpRecordTransportListeners(recordTransport, port);
        return recordConsumer;
      }),
    );

    await this.sendStreamRequest(room.id, ports.video, STREAM_TYPE.RECORD, ports.audio);
    setTimeout(async () => {
      for (const consumer of consumers) {
        await consumer.resume();
        await consumer.requestKeyFrame();
      }
    }, 1000);
  }

  async stopStreamFromRecord(room: mediasoup.types.Router, title: string) {
    const recordTransports = this.transports.get(room.id);
    if (!recordTransports) {
      return;
    }
    for (const recordTransport of recordTransports) {
      recordTransport.close();
    }
    this.transports.delete(room.id);

    await lastValueFrom(this.httpService.post(`${this.apiServerUrl}/v1/records`, { title, roomId: room.id }));
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

  private setUpRecordTransportListeners(recordTransport: mediasoup.types.Transport, port: number) {
    recordTransport.on('routerclose', async () => {
      await lastValueFrom(
        this.httpService.post(`${this.recordServerUrl}/close`, {
          port,
        }),
      );
      recordTransport.close();
    });
    recordTransport.observer.on('close', async () => {
      await firstValueFrom(
        this.httpService.post(`${this.recordServerUrl}/close`, {
          port,
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
}
