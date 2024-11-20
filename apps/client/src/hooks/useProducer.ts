import { useEffect, useRef, useState } from 'react';
import { Transport, Device } from 'mediasoup-client/lib/types';
import { ConnectTransportResponse, TransportInfo } from '../types/mediasoupTypes';
import { Socket } from 'socket.io-client';
import { checkDependencies } from '@/lib/utils';

interface UseProducerProps {
  socket: Socket | null;
  mediaStream: MediaStream | null;
  isMediastreamReady: boolean;
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
  mediaStream,
  isMediastreamReady,
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

        transport.current!.produce({ track: mediaStream?.getVideoTracks()[0] });
        transport.current!.produce({ track: mediaStream?.getAudioTracks()[0] });
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Producer creation failed'));
      throw err;
    }
  };

  useEffect(() => {
    if (!socket || !device || !roomId || !isMediastreamReady || !mediaStream || !transportInfo) {
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
  }, [socket, device, roomId, transportInfo, isMediastreamReady]);

  return {
    transport: transport.current,
    error,
    producerId,
  };
};
