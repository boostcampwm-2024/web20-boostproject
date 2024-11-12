export interface ICreateProducerParams {
  roomId;
  transportId: string;
  kind: 'audio' | 'video';
  rtpParameters: any;
}
