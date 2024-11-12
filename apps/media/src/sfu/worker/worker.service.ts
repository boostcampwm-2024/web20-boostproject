import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mediasoup from 'mediasoup';

@Injectable()
export class WorkerService implements OnModuleInit {
  private worker: mediasoup.types.Worker;

  async onModuleInit() {
    this.worker = await mediasoup.createWorker({
      logLevel: 'debug',
      logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
    });
  }

  getWorker() {
    return this.worker;
  }
}
