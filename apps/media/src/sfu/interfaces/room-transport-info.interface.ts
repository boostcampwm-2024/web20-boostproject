import * as mediasoup from 'mediasoup';

export interface IRoomTransportInfo {
  producerTransportId?: string;
  transports: Map<string, mediasoup.types.WebRtcTransport>;
}
