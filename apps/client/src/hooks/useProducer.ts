import { useEffect, useRef, useState } from 'react';
import { Transport, Device } from 'mediasoup-client/lib/types';
import { ConnectTransportResponse, Tracks, TransportInfo } from '../types/mediasoupTypes';
import { Socket } from 'socket.io-client';
import { checkDependencies } from '@/utils/utils';

interface UseProducerProps {
  socket: Socket | null;
  tracks: Tracks;
  isStreamReady: boolean;
  roomId: string;
  device: Device | null;
  transportInfo: TransportInfo | null;
}

interface UseProducerReturn {
  transport: Transport | null;
  error: Error | null;
  producerId: string;
}

export const useProducer = ({
  socket,
  tracks,
  isStreamReady,
  roomId,
  device,
  transportInfo,
}: UseProducerProps): UseProducerReturn => {
  const transport = useRef<Transport | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [producerId, setProducerId] = useState<string>('');

  const createTransport = async (socket: Socket, device: Device, roomId: string, transportInfo: TransportInfo) => {
    if (!socket || !device || !roomId || !transportInfo) {
      const dependencyError = checkDependencies('createTransport', { socket, device, roomId, transportInfo });
      setError(dependencyError);
      return;
    }

    setError(null);

    try {
      const newTransport = device.createSendTransport({
        id: transportInfo.transportId,
        iceParameters: transportInfo.iceParameters,
        iceCandidates: transportInfo.iceCandidates,
        dtlsParameters: transportInfo.dtlsParameters,
      });

      transport.current = newTransport;

      transport.current.on('connect', async (parameters, callback) => {
        try {
          await new Promise<void>((resolve, reject) =>
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
                  resolve();
                } else {
                  reject(new Error('Transport connection failed'));
                }
              },
            ),
          );
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Transport connection failed'));
          throw err;
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Transport creation failed'));
      throw err;
    }
  };

  const createProducer = async (socket: Socket, transportInfo: TransportInfo) => {
    if (!transport.current || !socket || !tracks) {
      console.log('useProducer stream:', tracks);
      const dependencyError = checkDependencies('createProducer', {
        socket,
        tracks,
        transport: transport.current,
      });
      setError(dependencyError);
      return;
    }

    setError(null);

    try {
      await new Promise<string>(resolve => {
        transport.current!.on('produce', async (parameters, callback) => {
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
              resolve(response.producerId);
            },
          );
        });

        (Object.keys(tracks) as Array<keyof Tracks>).forEach(track => {
          transport.current!.produce({ track: tracks[track] });
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Producer creation failed'));
      throw err;
    }
  };

  useEffect(() => {
    if (!socket || !device || !roomId || !tracks || !isStreamReady || !transportInfo) {
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
  }, [socket, device, roomId, transportInfo, isStreamReady]);

  return {
    transport: transport.current,
    error,
    producerId,
  };
};
