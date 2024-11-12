import * as mediasoupClient from 'mediasoup-client';
import { RtpCapabilities, RtpCodecCapability, RtpHeaderExtension } from 'mediasoup-client/lib/RtpParameters';
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface RtpCapabilitiesResponse {
  rtpCapabilities: {
    codecs: RtpCodecCapability[];
    headerExtensions: RtpHeaderExtension[];
  };
}

export const useMediasoupDevice = (socket: Socket) => {
  const rtpCapabilitiesRef = useRef<RtpCapabilities | null>(null);
  const deviceRef = useRef<mediasoupClient.Device | null>(null);
  const [deviceError, setDeviceError] = useState<Error | null>(null);

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
    try {
      socket.emit('getRtpCapabilities', async (response: RtpCapabilitiesResponse) => {
        rtpCapabilitiesRef.current = response.rtpCapabilities;
        await createDevice();
      });
    } catch (err) {
      setDeviceError(err instanceof Error ? err : new Error('RTP Capabilities 요청 실패'));
    }
  }, [socket]);

  return {
    rtpCapabilities: rtpCapabilitiesRef.current,
    device: deviceRef.current,
    deviceError,
  };
};
