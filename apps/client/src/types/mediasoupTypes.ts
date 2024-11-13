// types/broadcast.ts
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { Device, Transport, DtlsParameters, IceCandidate, IceParameters } from 'mediasoup-client/lib/types';

export interface RtpCapabilitiesResponse {
  rtpCapabilities: RtpCapabilities;
}

export interface CreateRoomResponse {
  roomId: string;
}

export interface CreateTransportResponse {
  transportId: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
}

export interface ConnectTransportResponse {
  connected: boolean;
  isProducer: boolean;
}

export interface MediasoupDeviceState {
  device: Device | null;
  deviceError: Error | null;
}

export interface MediasoupRoomState {
  roomId: string;
  roomError: Error | null;
}

export interface MediasoupTransportState {
  transport: Transport | null;
  transportError: Error | null;
}

export interface MediasoupDeviceActions {
  createDevice: () => Promise<void>;
}

export interface MediasoupTransportActions {
  createTransport: () => Promise<void>;
}
