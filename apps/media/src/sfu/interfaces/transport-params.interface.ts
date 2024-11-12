import * as mediasoup from 'mediasoup';

export interface TransportParams {
  roomId: string;
  transportId: string;
  dtlsParameters: mediasoup.types.DtlsParameters;
}
