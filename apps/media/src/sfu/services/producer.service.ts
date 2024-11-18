import { Injectable, Logger } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
@Injectable()
export class ProducerService {
  private producers = new Map<string, mediasoup.types.Producer[]>();
  private readonly logger = new Logger(ProducerService.name);

  async createProducer(
    transport: mediasoup.types.Transport,
    kind: 'audio' | 'video',
    rtpParameters: mediasoup.types.RtpParameters,
  ) {
    const producer = await transport.produce({
      kind,
      rtpParameters,
    });
    if (!this.producers.has(transport.id)) {
      this.producers.set(transport.id, []);
    }
    this.producers.get(transport.id).push(producer);
    this.setUpProducerListeners(producer, transport.id);
    this.logger.log(`Producer created: ${producer.id}`);
    return producer;
  }

  getProducers(transportId: string) {
    return this.producers.get(transportId) || [];
  }

  private setUpProducerListeners(producer: mediasoup.types.Producer, transportId: string) {
    producer.on('transportclose', () => {
      const producers = this.getProducers(transportId);
      producers.forEach(producer => producer.close());
      this.removeProducer(transportId, producer.id);
    });
    producer.observer.on('close', () => {
      this.removeProducer(transportId, producer.id);
    });
  }

  private removeProducer(transportId: string, producerId: string) {
    const producers = this.producers.get(transportId);
    if (producers) {
      const index = producers.findIndex(producer => producer.id === producerId);
      if (index !== -1) {
        producers.splice(index, 1);
      }
      if (producers.length === 0) {
        this.producers.delete(transportId);
      }
      this.logger.log(`Producer closed: ${producerId}`);
    }
  }
}
