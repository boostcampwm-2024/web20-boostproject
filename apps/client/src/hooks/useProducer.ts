import { useEffect, useRef, useState } from 'react';
import { Transport, Device } from 'mediasoup-client/lib/types';
import { ConnectTransportResponse, TransportInfo } from '../types/mediasoupTypes';
import { Socket } from 'socket.io-client';

interface useProducerProps {
  socket: Socket | null;
  mediaStream: MediaStream | null;
  isMediastreamReady: boolean;
  roomId: string;
  device: Device | null;
  transportInfo: TransportInfo | null;
}

export const useProducer = ({
  socket,
  mediaStream,
  isMediastreamReady,
  roomId,
  device,
  transportInfo,
}: useProducerProps) => {
  const transport = useRef<Transport | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [producerId, setProducerId] = useState<string>('');

  const createTransport = async (socket: Socket, device: Device, roomId: string, transportInfo: TransportInfo) => {
    if (!socket || !device || !roomId || !transportInfo) return;

    const newTransport = device.createSendTransport({
      id: transportInfo.transportId,
      iceParameters: transportInfo.iceParameters,
      iceCandidates: transportInfo.iceCandidates,
      dtlsParameters: transportInfo.dtlsParameters,
    });

    transport.current = newTransport;

    transport.current.on('connect', async (parameters, callback) => {
      await new Promise((resolve, reject) =>
        socket.emit(
          'connectTransport',
          {
            roomId: roomId,
            dtlsParameters: parameters.dtlsParameters,
            transportId: transportInfo.transportId,
          },
          (response: ConnectTransportResponse) => {
            if (response.connected) {
              callback();
              resolve(true);
            } else {
              reject(new Error('Transport connection failed'));
            }
          },
        ),
      );
    });
  };

  const createProducer = async (socket: Socket, transportInfo: TransportInfo) => {
    if (!transport.current || !socket) return;
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
    } catch (error) {
      setError(error instanceof Error ? error : new Error('producer 생성 에러'));
    }
  };

  useEffect(() => {
    if (!socket || !device || !roomId || !isMediastreamReady || !mediaStream || !transportInfo) {
      return;
    }

    createTransport(socket, device, roomId, transportInfo)
      .then(() => createProducer(socket, transportInfo))
      .catch(error => setError(error instanceof Error ? error : new Error('useProducer 에러')));
    return () => {
      if (transport.current) {
        transport.current.close();
      }
    };
  }, [socket, isMediastreamReady, device, roomId, mediaStream, transportInfo]);

  return {
    transport: transport.current,
    error,
    producerId,
  };
};
