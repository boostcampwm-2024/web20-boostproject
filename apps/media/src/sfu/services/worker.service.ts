import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { CustomWsException } from '../../common/responses/exceptions/custom-ws.exception';
import { ErrorStatus } from '../../common/responses/exceptions/errorStatus';

@Injectable()
export class WorkerService implements OnModuleInit {
  private worker: mediasoup.types.Worker;
  private readonly logger = new Logger(WorkerService.name);

  constructor() {}

  async onModuleInit() {
    this.worker = await mediasoup.createWorker({
      logLevel: 'debug',
      logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
    });

    this.worker.on('died', () => {
      this.logger.error('mediasoup Worker died, exiting 1...');
      process.exit(1);
    });
  }

  getWorker() {
    if (!this.worker) {
      throw new CustomWsException(ErrorStatus.WORKER_NOT_FOUND);
    }
    return this.worker;
  }
}
