import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ExceptionData {
  status: number;
  message: string;
}

interface ExceptionResponse {
  event: string;
  data: ExceptionData;
}

export const useSocket = (url: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [socketError, setSocketError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(url, {
      withCredentials: true,
      secure: true,
      transports: ['websocket', 'polling'],
      timeout: 10000, // 10초 동안 응답 못 받으면 연결 끊음
      reconnection: true, // 재연결 시도 활성화
      reconnectionAttempts: 5, // 최대 재연결 시도 횟수
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setSocketError(null);
      console.log('소켓 연결');
    });

    socket.on('connect_error', error => {
      setIsConnected(false);
      setSocketError(new Error(`Websocket 연결 실패: ${error}`));
    });

    socket.on('disconnect', reason => {
      setIsConnected(false);
      setSocketError(new Error(`소켓 연결이 끊어졌습니다: ${reason}`));
    });

    socket.on('exception', (error: ExceptionResponse) => {
      console.error(`socket exception Error: ${error.data.status}`);
      setSocketError(new Error(error.data.message));
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
