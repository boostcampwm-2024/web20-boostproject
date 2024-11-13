import * as mediasoupClient from 'mediasoup-client';
import { useEffect, useRef, useState } from 'react';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { Transport, Device } from 'mediasoup-client/lib/types';
import {
  RtpCapabilitiesResponse,
  CreateRoomResponse,
  CreateTransportResponse,
  ConnectTransportResponse,
  useProducerProps,
} from '../types/mediasoupTypes';
import { useSocket } from './useSocket';

export const useProducer = ({ socketUrl, mediastream, isMediastreamReady }: useProducerProps) => {
  const rtpCapabilitiesRef = useRef<RtpCapabilities | null>(null);
  const transport = useRef<Transport | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { socket, isConnected, socketError } = useSocket(socketUrl);

  const getRtpCapabilities = async () => {
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
  };

  const createDevice = async () => {
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
  };

  const createTransport = async (device: Device, roomId: string) => {
    if (!socket || !device || !roomId) return;

    try {
      const transportResponse: CreateTransportResponse = await new Promise(resolve => {
        socket.emit('createTransport', { roomId, isProducer: true }, (response: CreateTransportResponse) => {
          console.log('transport 생성');
          resolve(response);
        });
      });

      const newTransport = device.createSendTransport({
        id: transportResponse.transportId,
        iceParameters: transportResponse.iceParameters,
        iceCandidates: transportResponse.iceCandidates,
        dtlsParameters: transportResponse.dtlsParameters,
      });

      transport.current = newTransport;

      transport.current.on('connect', async (parameters, callback) => {
        await new Promise(resolve =>
          socket.emit(
            'connectTransport',
            {
              roomId: roomId,
              dtlsParameters: parameters.dtlsParameters,
              transportId: transportResponse.transportId,
            },
            (response: ConnectTransportResponse) => {
              console.log('connected: ', response.connected);
              console.log('isProducer: ', response.isProducer);
              callback();
              resolve;
            },
          ),
        );
      });

      transport.current.on('produce', async (parameters, callback) => {
        socket.emit(
          'createProducer',
          {
            roomId,
            transportId: transportResponse.transportId,
            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,
          },
          (response: { producerId: string }) => {
            callback({ id: response.producerId });
          },
        );
      });

      await transport.current.produce({ track: mediastream?.getVideoTracks()[0] });
      await transport.current.produce({ track: mediastream?.getAudioTracks()[0] });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transport 생성 에러');
      console.error('Transport 생성 중 에러:', error);
      setError(error);
    }
  };

  const initializeMediasoup = async () => {
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
          console.log(response.roomId);
          resolve(response);
        });
      });

      await createTransport(device, roomId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Mediasoup 초기화 중 에러');
      console.error('Mediasoup 초기화 중 에러:', error);
      setError(error);
    }
  };

  useEffect(() => {
    if (socketError) {
      setError(socketError);
      console.log('소켓 에러');
      return;
    }
    if (!mediastream) {
      return;
    }

    initializeMediasoup();

    return () => {
      if (transport.current) {
        transport.current.close();
      }
    };
  }, [isConnected, isMediastreamReady]);

  return {
    transport: transport.current,
    error,
  };
};
