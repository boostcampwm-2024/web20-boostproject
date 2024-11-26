import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mediasoup from 'mediasoup';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RecordService {
  private readonly recordServerUrl: string;
  private readonly serverPrivateIp: string;
  private readonly announcedIp: string;

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    this.recordServerUrl = this.configService.get<string>('RECORD_SERVER_URL', 'http://localhost:3003');
    this.serverPrivateIp = this.configService.get<string>('SERVER_PRIVATE_IP', '127.0.0.1');
    this.announcedIp = this.configService.get<string>('ANNOUNCED_IP', '127.0.0.1');
  }

  async sendStream(room: mediasoup.types.Router, producer: mediasoup.types.Producer) {
    if (producer.kind === 'audio') return;
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

    await this.sendRecordStartRequest(room.id, port);
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
        this.httpService.post(`${this.configService.get('RECORD_SERVER_URL')}/close`, {
          port,
          roomId,
        }),
      );
      recordTransport.close();
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

  private async sendRecordStartRequest(roomId: string, port: number) {
    await lastValueFrom(
      this.httpService.post(`${this.recordServerUrl}/send`, {
        roomId,
        port,
      }),
    );
  }
}
