import { useEffect, useRef, useState } from 'react';
import { Transport, Device, MediaKind } from 'mediasoup-client/lib/types';
import { ConnectTransportResponse, TransportInfo } from '@/types/mediasoupTypes';
import { Socket } from 'socket.io-client';
import { checkDependencies } from '@utils/utils';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [mediastream, setMediastream] = useState<MediaStream | null>(null);

  const connectTransport = async ({ socket, transportInfo, device, roomId }: ConnectTransportParams) => {
    if (!socket || !transportInfo || !device || !roomId) {
      const dependencyError = checkDependencies('connectTransport', { socket, transportInfo, device, roomId });
      setError(dependencyError);
      return;
    }

    setError(null);

    const newTransport = device.createRecvTransport({
      id: transportInfo.transportId,
      iceParameters: transportInfo.iceParameters,
      iceCandidates: transportInfo.iceCandidates,
      dtlsParameters: transportInfo.dtlsParameters,
    });

    transport.current = newTransport;

    transport.current.on('connect', async ({ dtlsParameters }, callback) => {
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
    });
  };

  const createConsumer = async ({ socket, roomId, transportInfo, transport }: CreateConsumerParams) => {
    if (!transport || !socket) {
      const dependencyError = checkDependencies('createConsumer', { socket, transport });
      setError(dependencyError);
      return;
    }

    setError(null);

    socket.emit(
      'createConsumer',
      {
        roomId,
        transportId: transportInfo.transportId,
      },
      async ({ consumers }: CreateConsumerResponse) => {
        const newMediastream = new MediaStream();
        for (const consumerData of consumers) {
          const consumer = await transport.consume({
            id: consumerData.consumerId,
            producerId: consumerData.producerId,
            rtpParameters: consumerData.rtpParameters,
            kind: consumerData.kind,
          });

          if (consumer.track.kind === 'video') {
            consumer.track.enabled = true;
          }
          newMediastream.addTrack(consumer.track);
          consumer.resume();
        }

        setMediastream(newMediastream);
      },
    );
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
      .then(() => setIsLoading(false))
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
    isLoading,
  };
};
