import { useEffect, useRef, useState } from 'react';
import { Transport, Device, MediaKind } from 'mediasoup-client/lib/types';
import { ConnectTransportResponse, TransportInfo } from '../types/mediasoupTypes';
import { Socket } from 'socket.io-client';
import { checkDependencies } from '@/lib/utils';

interface UseConsumerProps {
  socket: Socket | null;
  device: Device | null;
  roomId: string | undefined;
  transportInfo: TransportInfo | null;
  isConnected: boolean;
}

interface ConnectTransportParams {
  socket: Socket;
  transportInfo: TransportInfo;
  device: Device;
  roomId: string | undefined;
}

interface CreateConsumerParams {
  socket: Socket;
  roomId: string;
  transportInfo: TransportInfo;
  transport: Transport | null;
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

export const useConsumer = ({ socket, device, roomId, transportInfo, isConnected }: UseConsumerProps) => {
  const transport = useRef<Transport | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [mediastream, setMediastream] = useState<MediaStream | null>(null);

  const connectTransport = async ({ socket, transportInfo, device, roomId }: ConnectTransportParams) => {
    if (!socket || !transportInfo || !device || !roomId) {
      const dependencyError = checkDependencies('connectTransport', { socket, transportInfo, device, roomId });
      setError(dependencyError);
      return;
    }

    setError(null);

    try {
      const newTransport = device.createRecvTransport({
        id: transportInfo.transportId,
        iceParameters: transportInfo.iceParameters,
        iceCandidates: transportInfo.iceCandidates,
        dtlsParameters: transportInfo.dtlsParameters,
      });

      transport.current = newTransport;

      transport.current.on('connect', async ({ dtlsParameters }, callback) => {
        try {
          const response = await new Promise<ConnectTransportResponse>((resolve, reject) => {
            socket.emit(
              'connectTransport',
              {
                roomId,
                dtlsParameters,
                transportId: transportInfo.transportId,
              },
              (response: ConnectTransportResponse) => {
                if (response.connected) {
                  resolve(response);
                } else {
                  reject(new Error('Transport connection failed'));
                }
              },
            );
          });

          callback();
          return response;
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Unknown transport error');
          setError(err);
          throw err;
        }
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Transport creation failed');
      setError(err);
      throw err;
    }
  };

  const createConsumer = async ({ socket, roomId, transportInfo, transport }: CreateConsumerParams) => {
    console.log('createConsumer 함수 실행');
    if (!transport || !socket) {
      const dependencyError = checkDependencies('createConsumer', { socket, transport });
      setError(dependencyError);
      return;
    }

    setError(null);

    try {
      socket.emit(
        'createConsumer',
        {
          roomId,
          transportId: transportInfo.transportId,
        },
        async ({ consumers }: CreateConsumerResponse) => {
          console.log('createConsumer emit!');
          const newMediastream = new MediaStream();
          for (const consumerData of consumers) {
            try {
              const consumer = await transport.consume({
                id: consumerData.consumerId,
                producerId: consumerData.producerId,
                rtpParameters: consumerData.rtpParameters,
                kind: consumerData.kind,
              });

              if (consumer.track.kind === 'video') {
                consumer.track.enabled = true;
              }
              console.log(consumer);
              newMediastream.addTrack(consumer.track);
              consumer.resume();
            } catch (err) {
              const error = err instanceof Error ? err : new Error('Consumer creation failed');
              setError(error);
              console.error(error);
            }
          }

          setMediastream(newMediastream);
        },
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Consumer initialization failed');
      setError(error);
      throw error;
    }
  };

  useEffect(() => {
    if (!socket || !isConnected || !roomId || !transportInfo || !device) {
      return;
    }

    connectTransport({
      socket,
      transportInfo,
      device,
      roomId,
    })
      .then(() =>
        createConsumer({
          socket,
          roomId,
          transportInfo,
          transport: transport.current,
        }),
      )
      .catch(err => setError(err instanceof Error ? err : new Error('Consumer initialization failed')));

    return () => {
      if (transport.current) {
        transport.current.close();
        transport.current = null;
      }
      setMediastream(null);
    };
  }, [socket, isConnected, transportInfo, device, roomId]);

  return {
    transport: transport.current,
    mediastream,
    error,
  };
};
