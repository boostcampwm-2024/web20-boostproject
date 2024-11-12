import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker } from 'mediasoup/node/lib/Worker';
import * as mediasoup from 'mediasoup';

@Injectable()
export class SfuGateway implements OnModuleInit {
  private worker: Worker;
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
