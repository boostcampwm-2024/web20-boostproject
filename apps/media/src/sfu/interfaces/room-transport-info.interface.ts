import * as mediasoup from 'mediasoup';

export interface RoomTransportInfo {
  producerTransportId?: string;
  transports: Map<string, mediasoup.types.WebRtcTransport>;
}
