import { useEffect, useRef, useState } from 'react';
import { Transport, Device, Producer } from 'mediasoup-client/lib/types';
import { ConnectTransportResponse, TransportInfo } from '@/types/mediasoupTypes';
import { Socket } from 'socket.io-client';
import { checkDependencies } from '@/utils/utils';
import { ENCODING_OPTIONS } from '@/constants/videoOptions';

interface UseProducerProps {
  socket: Socket | null;
  // tracks: Tracks;
  // isStreamReady: boolean;
  mediaStream: MediaStream | null;
  isMediaStreamReady: boolean;
  roomId: string;
  device: Device | null;
  transportInfo: TransportInfo | null;
}

interface UseProducerReturn {
  transport: Transport | null;
  error: Error | null;
  producerId: string;
  producers: Map<string, Producer>;
}

export const useProducer = ({
  socket,
  mediaStream,
  isMediaStreamReady,
  roomId,
  device,
  transportInfo,
}: UseProducerProps): UseProducerReturn => {
  const transport = useRef<Transport | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [producerId, setProducerId] = useState<string>('');
  const [producers, setProducers] = useState<Map<string, Producer>>(new Map());

  const createTransport = async (socket: Socket, device: Device, roomId: string, transportInfo: TransportInfo) => {
    if (!socket || !device || !roomId || !transportInfo) {
      const dependencyError = checkDependencies('createTransport', { socket, device, roomId, transportInfo });
      setError(dependencyError);
      return;
    }

    setError(null);

    const newTransport = device.createSendTransport({
      id: transportInfo.transportId,
      iceParameters: transportInfo.iceParameters,
      iceCandidates: transportInfo.iceCandidates,
      dtlsParameters: transportInfo.dtlsParameters,
    });

    transport.current = newTransport;

    transport.current.on('connect', async (parameters, callback) => {
      socket.emit(
        'connectTransport',
        {
          roomId,
          dtlsParameters: parameters.dtlsParameters,
          transportId: transportInfo.transportId,
        },
        (response: ConnectTransportResponse) => {
          if (response.connected) {
            callback();
          }
        },
      );
    });
  };

  const createProducer = async (socket: Socket, transportInfo: TransportInfo) => {
    if (!transport.current || !socket || !mediaStream) {
      const dependencyError = checkDependencies('createProducer', {
        socket,
        mediaStream,
        transport: transport.current,
      });
      setError(dependencyError);
      return;
    }

    setError(null);

    transport.current!.on('produce', (parameters, callback) => {
      console.log('produce 발생');
      socket.emit(
        'createProducer',
        {
          roomId,
          transportId: transportInfo.transportId,
          kind: parameters.kind,
          rtpParameters: parameters.rtpParameters,
        },
        (response: { producerId: string }) => {
          callback({ id: response.producerId });
          setProducerId(response.producerId);
        },
      );
    });

    mediaStream.getTracks().forEach(track => {
      const producerConfig: Record<string, unknown> = {
        track: track,
        stopTracks: false,
      };

      if (track.kind === 'video') {
        producerConfig['encodings'] = ENCODING_OPTIONS;
        producerConfig['codecOptions'] = {
          videoGoogleStartBitrate: 1000,
        };
      }

      transport.current!.produce(producerConfig).then(producer => {
        setProducers(prev => new Map(prev).set(track.kind, producer));
      });
    });
  };

  useEffect(() => {
    if (!socket || !device || !roomId || !mediaStream || !isMediaStreamReady || !transportInfo) {
      return;
    }

    createTransport(socket, device, roomId, transportInfo)
      .then(() => createProducer(socket, transportInfo))
      .catch(err => setError(err instanceof Error ? err : new Error('Producer initialization failed')));

    return () => {
      if (transport.current) {
        transport.current.close();
        transport.current = null;
      }
    };
  }, [socket, device, roomId, transportInfo, isMediaStreamReady]);

  return {
    transport: transport.current,
    error,
    producerId,
    producers,
  };
};
