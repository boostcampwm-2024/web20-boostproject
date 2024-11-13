import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mediasoup from 'mediasoup';

@Injectable()
export class WorkerService implements OnModuleInit {
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
  private worker: mediasoup.types.Worker;

  async onModuleInit() {
    this.worker = await mediasoup.createWorker({
      logLevel: 'debug',
      logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
    });
  }

  async createRoom() {
    return await this.worker.createRouter({ mediaCodecs: this.rtpCapabilities.codecs });
  }

  getRtpCapabilities() {
    return this.rtpCapabilities;
  }
}
