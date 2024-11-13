import * as mediasoup from 'mediasoup';

export class ConnectTransportDto {
  roomId: string;
  transportId: string;
  dtlsParameters: mediasoup.types.DtlsParameters;
}
