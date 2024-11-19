import * as mediasoupClient from 'mediasoup-client';
import { useEffect, useState } from 'react';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { Device } from 'mediasoup-client/lib/types';
import { checkDependencies } from '@/lib/utils';
import { Socket } from 'socket.io-client';
import { TransportInfo } from '@/types/mediasoupTypes';

interface UseTransportProps {
  socket: Socket | null;
  roomId: string | undefined;
  isProducer: boolean;
}

export const useTransport = ({ socket, roomId, isProducer = false }: UseTransportProps) => {
  const [transportInfo, setTransportInfo] = useState<TransportInfo | null>(null);
  const [transportError, setTransportError] = useState<Error | null>(null);
  const [device, setDevice] = useState<Device | null>(null);

  const getRtpCapabilities = async (roomId: string) => {
    if (!socket || !roomId) {
      const dependencyError = checkDependencies('getRtpCapabilities', { socket, roomId });
      setTransportError(dependencyError);
      return;
    }

    try {
      const rtpCapabilities: RtpCapabilities = await new Promise((resolve, reject) => {
        socket.emit('getRtpCapabilities', { roomId }, (response: { rtpCapabilities: RtpCapabilities }) => {
          if (response.rtpCapabilities) {
            resolve(response.rtpCapabilities);
          } else {
            reject(new Error('getRtpCapabilities Error: RTP Capabilities를 받아오지 못했습니다.'));
          }
        });
      });
      console.log('RTP capabilities 받음');
      return rtpCapabilities;
    } catch (err) {
      throw err instanceof Error ? err : new Error('getRtpCapabilities Error: RTP Capabilities 요청 실패');
    }
  };

  const createDevice = async (rtpCapabilities: RtpCapabilities) => {
    try {
      if (!rtpCapabilities) {
        setTransportError(new Error('createDevice Error: RTP Capabilities가 없습니다.'));
        return;
      }

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
    if (!socket || !device || !roomId) {
      const dependencyError = checkDependencies('createTransport', { socket, device, roomId });
      setTransportError(dependencyError);
      return;
    }

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
