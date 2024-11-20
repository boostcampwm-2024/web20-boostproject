import { Injectable } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
@Injectable()
export class RecordService {
  constructor() {}
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

    // this.ffmpegService.createFfmpegProcess(rtpConsumer.rtpParameters, 5000);

    await transport.connect({
      ip: '127.0.0.1',
      port: 5000,
    });
  }

  async createPlainTransport(room: mediasoup.types.Router) {
    // return await room.createPlainTransport(transportConfig.plainRtpTransport);
    return await room.createPlainTransport({
      listenIp: { ip: '127.0.0.1', announcedIp: '127.0.0.1' }, // Replace 'announcedIp' with public IP if needed
      rtcpMux: true, // RTP와 RTCP를 같은 포트에서 처리할 경우 true
      comedia: false, // 외부 클라이언트 연결 방식
    });
  }
}
