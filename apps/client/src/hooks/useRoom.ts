import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export const useRoom = (socket: Socket | null, isConnected: boolean) => {
  const [roomId, setRoomId] = useState('');
  const [roomError, setRoomError] = useState<Error | null>(null);

  const getRooomId = async () => {
    if (!socket) {
      setRoomError(new Error('getRoomId Error: socket이 존재하지 않습니다.'));
      return;
    }
    try {
      const { roomId } = await new Promise<{ roomId: string }>(resolve => {
        socket.emit('createRoom', (response: { roomId: string }) => {
          resolve(response);
        });
      });
      setRoomId(roomId);
      console.log('room 생성: ', roomId);
    } catch (error) {
      setRoomError(error instanceof Error ? error : new Error('Room 생성 에러'));
    }
  };

  useEffect(() => {
    getRooomId();
  }, [isConnected]);

  return {
    roomId,
    roomError,
  };
};
