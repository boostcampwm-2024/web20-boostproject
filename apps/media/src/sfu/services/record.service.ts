import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mediasoup from 'mediasoup';

@Injectable()
export class RecordService {
  constructor(private readonly httpservice: HttpService, private readonly configService: ConfigService) {}

  async sendStream(room: mediasoup.types.Router, producer: mediasoup.types.Producer) {
    if (producer.kind === 'audio') return;
    const transport = await this.createPlainTransport(room);
    const codecs = [];
    const routerCodec = room.rtpCapabilities.codecs.find(codec => codec.kind === producer.kind);
    codecs.push(routerCodec);
    const rtpCapabilities = {
      codecs,
      rtcpFeedback: [],
    };
    const rtpConsumer = await transport.consume({
      producerId: producer.id,
      rtpCapabilities,
      paused: true,
    });

    await rtpConsumer.setPreferredLayers({
      spatialLayer: 2,
      temporalLayer: 2,
    });

    setTimeout(async () => {
      await rtpConsumer.resume();
      await rtpConsumer.requestKeyFrame();
    }, 1000);

    const { port } = await this.httpservice
      .get(`${this.configService.get('RECORD_SERVER_URL')}/availablePort`)
      .toPromise()
      .then(({ data }) => data);

    await transport.connect({
      ip: '127.0.0.1',
      port,
    });

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
        announcedAddress: '127.0.0.1',
        portRange: { min: 30000, max: 31000 },
      },
      rtcpMux: true,
    });
  }
}
