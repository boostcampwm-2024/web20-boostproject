import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mediasoup from 'mediasoup';

@Injectable()
export class RecordService {
  constructor(private readonly httpservice: HttpService, private readonly configService: ConfigService) {}

  async sendStream(room: mediasoup.types.Router, producer: mediasoup.types.Producer) {
    if (producer.kind === 'audio') return;
    const recordTransport = await this.createPlainTransport(room);
    const codecs = [];
    const routerCodec = room.rtpCapabilities.codecs.find(codec => codec.kind === producer.kind);
    codecs.push(routerCodec);
    const rtpCapabilities = {
      codecs,
      rtcpFeedback: [],
    };
    const recordConsumer = await recordTransport.consume({
      producerId: producer.id,
      rtpCapabilities,
      paused: true,
    });

    setTimeout(async () => {
      await recordConsumer.resume();
      await recordConsumer.requestKeyFrame();
    }, 1000);

    const { port } = await this.httpservice
      .get(`${this.configService.get('RECORD_SERVER_URL')}/availablePort`)
      .toPromise()
      .then(({ data }) => data);

    await recordTransport.connect({
      ip: this.configService.get('SERVER_PRIVATE_IP'),
      port,
    });

    this.setUpRecordTransportListeners(recordTransport, port);
    this.setUpRecordConsumerListeners(recordConsumer);

    await this.httpservice
      .post(`${this.configService.get('RECORD_SERVER_URL')}/send`, {
        roomId: room.id,
        port,
      })
      .toPromise();
  }

  async createPlainTransport(room: mediasoup.types.Router) {
    return await room.createPlainTransport({
      listenInfo: {
        protocol: 'udp',
        ip: '0.0.0.0',
        announcedAddress: this.configService.get('ANNOUNCED_IP') || '127.0.0.1',
        portRange: { min: 30000, max: 31000 },
      },
      rtcpMux: true,
    });
  }

  private setUpRecordTransportListeners(recordTransport: mediasoup.types.Transport, port: number) {
    recordTransport.on('routerclose', async () => {
      await this.httpservice
        .post(`${this.configService.get('RECORD_SERVER_URL')}/close`, {
          port,
        })
        .toPromise();
      recordTransport.close();
    });
  }

  private setUpRecordConsumerListeners(recordConsumer: mediasoup.types.Consumer) {
    recordConsumer.on('transportclose', () => {
      recordConsumer.close();
    });
  }
}
