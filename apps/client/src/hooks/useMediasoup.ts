import * as mediasoupClient from 'mediasoup-client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { Transport, Device } from 'mediasoup-client/lib/types';
import {
  RtpCapabilitiesResponse,
  CreateRoomResponse,
  CreateTransportResponse,
  ConnectTransportResponse,
} from '../types/mediasoupTypes';
import { useSocket } from './useSocket';

export const useMediasoup = ({ url, isProducer = true }: { url: string; isProducer: boolean }) => {
  const rtpCapabilitiesRef = useRef<RtpCapabilities | null>(null);
  const transport = useRef<Transport | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { socket, isConnected, socketError } = useSocket(url);

  const getRtpCapabilities = useCallback(async () => {
    if (!socket) return null;

    try {
      const rtpCapabilities: RtpCapabilities = await new Promise(resolve => {
        socket.emit('getRtpCapabilities', (response: RtpCapabilitiesResponse) => {
          console.log('rtp Capability');
          resolve(response.rtpCapabilities);
        });
      });

      rtpCapabilitiesRef.current = rtpCapabilities;
      console.log('RTP capabilities 갖고옴');
      return rtpCapabilities;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('RTP Capabilities 요청 실패');
      console.error('RTP Capabilities 요청 중 에러:', error);
      setError(error);
      return null;
    }
  }, [socket]);

  const createDevice = useCallback(async () => {
    try {
      if (!rtpCapabilitiesRef.current) return null;

      const device = new mediasoupClient.Device();
      await device.load({
        routerRtpCapabilities: rtpCapabilitiesRef.current,
      });
      console.log('Device 생성');
      return device;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Device 생성 실패');
      console.error('Device 생성 실패:', error);
      setError(error);
      return null;
    }
  }, []);

  const createTransport = useCallback(
    async (device: Device, roomId: string) => {
      if (!socket || !device || !roomId) return;

      try {
        const transportResponse: CreateTransportResponse = await new Promise(resolve => {
          socket.emit('createTransport', { roomId, isProducer }, (response: CreateTransportResponse) => {
            console.log('transport 생성');
            resolve(response);
          });
        });

        const newTransport = isProducer
          ? device.createSendTransport({
              id: transportResponse.transportId,
              iceParameters: transportResponse.iceParameters,
              iceCandidates: transportResponse.iceCandidates,
              dtlsParameters: transportResponse.dtlsParameters,
            })
          : device.createRecvTransport({
              id: transportResponse.transportId,
              iceParameters: transportResponse.iceParameters,
              iceCandidates: transportResponse.iceCandidates,
              dtlsParameters: transportResponse.dtlsParameters,
            });

        transport.current = newTransport;

        transport.current.on('connect', async ({ dtlsParameters }, callback, errback) => {
          try {
            const response: ConnectTransportResponse = await new Promise(resolve => {
              socket.emit(
                'connectTransport',
                {
                  roomId: roomId,
                  dtlsParameters: dtlsParameters,
                  transportId: transportResponse.transportId,
                },
                (result: ConnectTransportResponse) => {
                  console.log('connectTransport');
                  resolve(result);
                },
              );
            });

            if (response.connected) {
              console.log('transport 연결 성공');
              callback();
            } else {
              const error = new Error('서버에서 연결을 거부했습니다.');
              console.error(error);
              setError(error);
              errback(error);
            }
          } catch (err) {
            const error = err instanceof Error ? err : new Error('Transport 연결 중 에러가 발생했습니다.');
            console.error('Transport 연결 중 에러:', error);
            setError(error);
            errback(error);
          }
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Transport 생성 에러');
        console.error('Transport 생성 중 에러:', error);
        setError(error);
      }
    },
    [socket, isProducer],
  );

  const initializeMediasoup = useCallback(async () => {
    try {
      if (!socket) {
        console.log('소켓이 없습니다');
        return;
      }

      const rtpCapabilities = await getRtpCapabilities();
      if (!rtpCapabilities) return;

      const device = await createDevice();
      if (!device) return;

      const { roomId } = await new Promise<CreateRoomResponse>(resolve => {
        socket.emit('createRoom', (response: CreateRoomResponse) => {
          resolve(response);
        });
      });

      console.log('Room id: ', roomId);
      await createTransport(device, roomId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Mediasoup 초기화 중 에러');
      console.error('Mediasoup 초기화 중 에러:', error);
      setError(error);
    }
  }, [socket, getRtpCapabilities, createDevice, createTransport]);

  useEffect(() => {
    if (socketError) {
      setError(socketError);
      return;
    }

    initializeMediasoup();

    return () => {
      if (transport.current) {
        transport.current.close();
      }
    };
  }, [socket, isConnected]);

  return {
    transport: transport.current,
    error,
  };
};
