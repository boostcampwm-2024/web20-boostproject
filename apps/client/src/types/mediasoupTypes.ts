import { DtlsParameters, IceCandidate, IceParameters } from 'mediasoup-client/lib/types';

export interface TransportInfo {
  transportId: string;
  isProducer: boolean;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
}

export interface ConnectTransportResponse {
  connected: boolean;
  isProducer: boolean;
}

export interface Tracks {
  video: MediaStreamTrack | undefined;
  mediaAudio: MediaStreamTrack | undefined;
  screenAudio: MediaStreamTrack | undefined;
}
