import { Device, DtlsParameters, IceCandidate, IceParameters, Transport } from 'mediasoup-client/lib/types';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';

interface UseMediasoupTransportProps {
  socket: Socket;
  device: Device;
  roomId: string;
  isProducer: boolean;
}

interface createTransportResponse {
  transportId: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
}

interface ConnectTransportResponse {
  connected: boolean;
  isProducer: boolean;
}

export const useMediasoupTransport = ({ socket, device, roomId, isProducer }: UseMediasoupTransportProps) => {
  const transport = useRef<Transport | null>(null);
  const [connected, setConnected] = useState(false);
  const [transportError, setTransportError] = useState<Error | null>(null);

  const createTransport = useCallback(() => {
    if (!socket || !device) return;

    try {
      socket.emit('createTransport', { roomId, isProducer }, (transportResponse: createTransportResponse) => {
        try {
          const newTransport = isProducer
            ? device.createSendTransport({
                id: transportResponse.transportId,
                iceParameters: transportResponse.iceParameters,
                iceCandidates: transportResponse.iceCandidates,
                dtlsParameters: transportResponse.dtlsParameters,
              })
            : device.createRecvTransport({
                id: transportResponse.transportId,
                iceParameters: transportResponse.iceParameters,
                iceCandidates: transportResponse.iceCandidates,
                dtlsParameters: transportResponse.dtlsParameters,
              });

          transport.current = newTransport;

          transport.current.on('connect', async ({ dtlsParameters }, callback, errback) => {
            try {
              socket.emit(
                'connectTransport',
                {
                  roomId,
                  dtlsParameters,
                  transportId: transportResponse.transportId,
                },
                (response: ConnectTransportResponse) => {
                  if (response.connected) {
                    setConnected(true);
                    callback();
                  } else {
                    errback(new Error('서버에서 연결을 거부했습니다.'));
                  }
                },
              );
            } catch (error) {
              errback(error instanceof Error ? error : new Error('Transport 연결 중 에러가 발생했습니다.'));
            }
          });
        } catch (err) {
          setTransportError(err instanceof Error ? err : new Error('Transport 객체 생성 에러'));
        }
      });
    } catch (err) {
      setTransportError(err instanceof Error ? err : new Error('Transport 생성 에러'));
    }
  }, [socket, device, roomId, isProducer]);

  useEffect(() => {
    createTransport();

    return () => {
      if (transport.current) {
        transport.current.close();
      }
    };
  }, [socket]);

  return {
    transport: transport.current,
    connected,
    transportError,
  };
};
