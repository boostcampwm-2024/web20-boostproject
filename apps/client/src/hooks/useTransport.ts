import * as mediasoupClient from 'mediasoup-client';
import { useEffect, useState } from 'react';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { Device } from 'mediasoup-client/lib/types';
import { useTransportProps, RtpCapabilitiesResponse, TransportInfo } from '../types/mediasoupTypes';

export const useTransport = ({ socket, roomId, isProducer = false }: useTransportProps) => {
  const [transportInfo, setTransportInfo] = useState<TransportInfo | null>(null);
  const [transportError, setTransportError] = useState<Error | null>(null);
  const [device, setDevice] = useState<Device | null>(null);

  const getRtpCapabilities = async (roomId: string) => {
    if (!socket) return null;

    try {
      const rtpCapabilities: RtpCapabilities = await new Promise(resolve => {
        socket.emit('getRtpCapabilities', { roomId }, (response: RtpCapabilitiesResponse) => {
          console.log('rtp Capability');
          resolve(response.rtpCapabilities);
        });
      });
      console.log('RTP capabilities 갖고옴');
      return rtpCapabilities;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('RTP Capabilities 요청 실패');
      console.error('RTP Capabilities 요청 중 에러:', error);
      setTransportError(error);
      return null;
    }
  };

  const createDevice = async (rtpCapabilities: RtpCapabilities) => {
    try {
      if (!rtpCapabilities) return null;

      const newDevice = new mediasoupClient.Device();
      await newDevice.load({
        routerRtpCapabilities: rtpCapabilities,
      });
      console.log('Device 생성');
      return newDevice;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Device 생성 실패');
      console.error('Device 생성 실패:', error);
      setTransportError(error);
      return null;
    }
  };

  const createTransport = async (device: Device, roomId: string) => {
    if (!socket || !device || !roomId) return;

    try {
      const transportResponse: TransportInfo = await new Promise(resolve => {
        socket.emit('createTransport', { roomId: roomId, isProducer }, (response: TransportInfo) => {
          console.log('transport 생성');
          resolve(response);
        });
      });

      setTransportInfo(transportResponse);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transport 생성 에러');
      console.error('Transport 생성 중 에러:', error);
      setTransportError(error);
    }
  };

  const initializeTransport = async (roomId: string) => {
    if (!socket || !roomId) return;

    const rtpCapabilities = await getRtpCapabilities(roomId);
    if (!rtpCapabilities) return;

    const newDevice = await createDevice(rtpCapabilities);
    if (!newDevice) return;
    setDevice(newDevice);

    await createTransport(newDevice, roomId);
    if (!transportInfo) return;
  };

  useEffect(() => {
    if (!socket || !roomId) {
      return;
    }

    initializeTransport(roomId);

    return () => {};
  }, [socket, roomId]);

  return {
    transportInfo,
    device,
    transportError,
  };
};
