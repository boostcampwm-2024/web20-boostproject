export interface ICreateProducerParams {
  transportId: string;
  kind: 'audio' | 'video';
  rtpParameters: any;
}
