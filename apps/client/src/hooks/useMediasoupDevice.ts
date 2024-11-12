import * as mediasoupClient from 'mediasoup-client';
import { RtpCapabilities, RtpCodecCapability, RtpHeaderExtension } from 'mediasoup-client/lib/RtpParameters';
import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';

const SERVER_URL = 'ws://localhost:3001';

interface RtpCapabilitiesResponse {
  rtpCapabilities: {
    codecs: RtpCodecCapability[];
    headerExtensions: RtpHeaderExtension[];
  };
}

export const useMediasoupDevice = () => {
  const socketRef = useRef<Socket | null>(null);
  const rtpCapabilitiesRef = useRef<RtpCapabilities | null>(null);
  const deviceRef = useRef<mediasoupClient.Device | null>(null);

  const [deviceError, setDeviceError] = useState<Error | null>(null);

  const getRtpCapabilities = async () => {
    try {
      const newSocket = io(SERVER_URL);
      socketRef.current = newSocket;

      newSocket.on('connect_error', error => {
        setDeviceError(new Error(`WebSocket 연결 실패: ${error}`));
      });

      socketRef.current.emit('getRtpCapabilities', async (response: RtpCapabilitiesResponse) => {
        rtpCapabilitiesRef.current = response.rtpCapabilities;
        await createDevice();
      });
    } catch (err) {
      setDeviceError(err instanceof Error ? err : new Error('RTP Capabilities 요청 실패'));
    }
  };

  const createDevice = async () => {
    try {
      if (!rtpCapabilitiesRef.current) return;

      deviceRef.current = new mediasoupClient.Device();
      await deviceRef.current.load({
        routerRtpCapabilities: rtpCapabilitiesRef.current,
      });
    } catch (err) {
      setDeviceError(err instanceof Error ? err : new Error('Device 생성 실패'));
    }
  };

  useEffect(() => {
    getRtpCapabilities();

    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    rtpCapabilities: rtpCapabilitiesRef.current,
    device: deviceRef.current,
    deviceError,
  };
};
