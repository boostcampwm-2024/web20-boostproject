export class CreateProducerDto {
  roomId: string;
  transportId: string;
  kind: 'audio' | 'video';
  rtpParameters: any;
}
