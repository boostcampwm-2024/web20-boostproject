import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export const useRoom = (socket: Socket | null, isConnected: boolean, isMediaStreamReady: boolean) => {
  const [roomId, setRoomId] = useState('');
  const [roomError, setRoomError] = useState<Error | null>(null);

  const getRooomId = async () => {
    if (!socket) {
      setRoomError(new Error('getRoomId Error: socket이 존재하지 않습니다.'));
      return;
    }

    setRoomError(null);
    socket.emit('createRoom', (response: { roomId: string }) => {
      setRoomId(response.roomId);
    });
  };

  useEffect(() => {
    if (!isMediaStreamReady) return;
    getRooomId();
  }, [isConnected, isMediaStreamReady]);

  return {
    roomId,
    roomError,
  };
};
