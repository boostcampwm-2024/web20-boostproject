import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as mediasoup from 'mediasoup';

@Injectable()
export class RecordService {
  constructor(private readonly httpservice: HttpService) {}

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
      .get('http://localhost:3003/availablePort')
      .toPromise()
      .then(({ data }) => data);

    await recordTransport.connect({
      ip: '127.0.0.1',
      port,
    });

    this.setUpRecordTransportListeners(recordTransport, port);
    this.setUpRecordConsumerListeners(recordConsumer);

    await this.httpservice
      .post('http://localhost:3003/send', {
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
        announcedAddress: '127.0.0.1',
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
