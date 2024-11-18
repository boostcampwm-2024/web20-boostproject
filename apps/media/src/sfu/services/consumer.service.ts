import { Injectable, Logger } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
@Injectable()
export class ConsumerService {
  private consumers = new Map<string, mediasoup.types.Consumer[]>();
  private readonly logger = new Logger(ConsumerService.name);

  async createConsumers(
    transport: mediasoup.types.Transport,
    producers: mediasoup.types.Producer[],
    rtpCapabilities: mediasoup.types.RtpCapabilities,
  ) {
    const newConsumers = await Promise.all(
      producers.map(async producer => {
        const consumer = await transport.consume({
          producerId: producer.id,
          rtpCapabilities,
          paused: false,
        });
        this.setUpConsumerListeners(consumer, transport.id);
        this.logger.log(`Consumer created: ${consumer.id}`);
        return consumer;
      }),
    );

    if (!this.consumers.has(transport.id)) {
      this.consumers.set(transport.id, []);
    }
    this.consumers.get(transport.id).push(...newConsumers);
    return newConsumers;
  }

  private setUpConsumerListeners(consumer: mediasoup.types.Consumer, transportId: string) {
    consumer.on('transportclose', () => {
      const consumers = this.consumers.get(transportId);
      consumers.forEach(consumer => consumer.close());
    });
    consumer.observer.on('close', () => {
      this.removeConsumer(transportId, consumer.id);
    });
    consumer.on('producerclose', () => {
      this.removeConsumer(transportId, consumer.id);
    });
  }

  private removeConsumer(transportId: string, consumerId: string) {
    const consumers = this.consumers.get(transportId);
    if (consumers) {
      const index = consumers.findIndex(consumer => consumer.id === consumerId);
      if (index !== -1) {
        consumers.splice(index, 1);
      }
      if (consumers.length === 0) {
        this.consumers.delete(transportId);
      }
      this.logger.log(`Consumer closed: ${consumerId}`);
    }
  }
}
