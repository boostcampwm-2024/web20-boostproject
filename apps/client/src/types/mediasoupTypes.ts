// types/broadcast.ts
import { MediaKind, RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { Device, Transport, DtlsParameters, IceCandidate, IceParameters } from 'mediasoup-client/lib/types';
import { Socket } from 'socket.io-client';

export interface useMediasoupProps {
  socketUrl: string;
  liveId: string | undefined;
  mediastream: MediaStream | null;
  isMediastreamReady: boolean;
  isProducer: boolean;
}

export interface useProducerProps {
  socketUrl: string;
  mediastream: MediaStream | null;
  isMediastreamReady: boolean;
}

export interface useConsumerProps {
  socketUrl: string;
  liveId: string | undefined;
}

export interface useTransportProps {
  socket: Socket | null;
  roomId: string | undefined;
  isProducer: boolean;
}

export interface RtpCapabilitiesResponse {
  rtpCapabilities: RtpCapabilities;
}

export interface CreateRoomResponse {
  roomId: string;
}

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

export interface CreateConsumer {
  consumerId: string;
  producerId: string;
  kind: MediaKind;
  rtpParameters: any;
}

export interface CreateConsumerResponse {
  consumers: CreateConsumer[];
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

export interface ConnectTransportResponse {
  connected: boolean;
  isProducer: boolean;
}
