import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (url: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [socketError, setSocketError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(url, {
      withCredentials: true,
      secure: true,
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('소켓 연결');
    });

    socket.on('connect_error', error => {
      setSocketError(new Error(`Websocket 연결 실패: ${error}`));
    });

    socket.on('exception', error => {
      console.log(error);
    });

    return () => {
      if (socket?.connected) {
        socket.disconnect();
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    socketError,
  };
};
