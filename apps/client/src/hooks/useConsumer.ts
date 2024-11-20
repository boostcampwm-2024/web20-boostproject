import { useEffect, useRef, useState } from 'react';
import { Transport, Device } from 'mediasoup-client/lib/types';
import { ConnectTransportResponse, TransportInfo, CreateConsumerResponse } from '../types/mediasoupTypes';
import { Socket } from 'socket.io-client';

export const useConsumer = ({
  socket,
  device,
  roomId,
  transportInfo,
  isConnected,
}: {
  socket: Socket | null;
  device: Device | null;
  roomId: string | undefined;
  transportInfo: TransportInfo | null;
  isConnected: boolean;
}) => {
  const transport = useRef<Transport | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [mediastream, setMediastream] = useState<MediaStream | null>(null);

  const connectTransport = async (params: {
    socket: Socket;
    transportInfo: TransportInfo;
    device: Device;
    roomId: string | undefined;
  }) => {
    const { socket, transportInfo, device, roomId } = params;
    if (!socket || !transportInfo || !device || !roomId) return;
    console.log('connectTransport 함수 실행');
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

  const createConsumer = async (params: {
    socket: Socket;
    roomId: string;
    transportInfo: TransportInfo;
    transport: Transport | null;
  }) => {
    const { socket, roomId, transportInfo, transport } = params;
    console.log('createConsumer 함수 실행');
    if (!transport) return;

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
    });
    createConsumer({
      socket,
      roomId,
      transportInfo,
      transport: transport.current,
    });

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
