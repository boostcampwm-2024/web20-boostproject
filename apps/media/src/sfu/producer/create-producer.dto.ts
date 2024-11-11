export class CreateProducerDto {
  transportId: string;
  kind: 'audio' | 'video';
  rtpParameters: any;
}
