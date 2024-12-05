import { Injectable, Logger } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { SetVideoQualityDto } from '../dto/set-video-quality.dto';
import { QUALITY, QUALITY_LAYER } from '../constants/quality-layer.constant';
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
          preferredLayers: {
            spatialLayer: QUALITY_LAYER[QUALITY.HIGH], // 0,1,2 순으로 480p,720p,1080p. 기본값은 중간인 720p로 시작.
            temporalLayer: 2, // fps: 0,1,2순으로 기본 fps의 1/4, 1/2, 1 로 들어감.
          },
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

  setConsumerBitrate(params: SetVideoQualityDto) {
    const { transportId, quality } = params;

    const consumers = this.consumers.get(transportId);
    const videoConsumer = consumers.find(consumer => consumer.kind === 'video');

    videoConsumer.setPreferredLayers({
      spatialLayer: QUALITY_LAYER[quality],
      temporalLayer: 2,
    });
  }
}
