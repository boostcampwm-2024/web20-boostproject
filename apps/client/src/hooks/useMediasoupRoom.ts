import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface createRoomResponse {
  roomId: string;
}

export const useMediasoupRoom = (socket: Socket) => {
  const [roomId, setRoomId] = useState<string>('');
  const [roomError, setRoomError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      socket.emit('createRoom', (response: createRoomResponse) => {
        setRoomId(response.roomId);
      });
    } catch (err) {
      setRoomError(err instanceof Error ? err : new Error('Room 생성 실패'));
    }
  }, [socket]);

  return {
    roomId,
    roomError,
  };
};
