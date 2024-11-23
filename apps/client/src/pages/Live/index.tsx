import ChatContainer from '@components/ChatContainer';
import ErrorCharacter from '@components/ErrorCharacter';
import LiveCamperInfo from './LiveCamperInfo';
import { useConsumer } from '@hooks/useConsumer';
import { useSocket } from '@hooks/useSocket';
import { useTransport } from '@hooks/useTransport';
import LivePlayer from './LivePlayer';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const socketUrl = import.meta.env.VITE_MEDIASERVER_URL;

export default function Live() {
  const { liveId } = useParams<{ liveId: string }>();
  const { socket, isConnected, socketError } = useSocket(socketUrl);
  const { transportInfo, device, transportError } = useTransport({
    socket,
    roomId: liveId,
    isProducer: false,
  });
  const {
    transport,
    mediastream: mediaStream,
    error: _error,
  } = useConsumer({
    socket,
    device,
    roomId: liveId,
    transportInfo,
    isConnected,
  });

  const handleLeaveLive = () => {
    if (socket && liveId && transportInfo) {
      socket.emit('leaveBroadcast', { transportId: transportInfo.transportId, roomId: liveId });
    }

    socket?.disconnect();
    transport?.close();
  };

  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    handleLeaveLive();
    e.returnValue = '';
  };

  useEffect(() => {
    window.addEventListener('beforeunload', preventClose);

    return () => {
      handleLeaveLive();
      window.removeEventListener('beforeunload', preventClose);
    };
  }, []);

  return (
    <div className="h-full bottom-0 left-0 right-0 overflow-auto flex flex-row w-full gap-10">
      {socketError || transportError ? (
        <div className="flex w-full h-full justify-center items-center">
          <ErrorCharacter
            size={400}
            message={`방송 연결 중 에러가 발생했습니다: ${socketError ? socketError.message : transportError?.message}`}
          />
        </div>
      ) : !liveId ? (
        <ErrorCharacter size={400} message="방 정보가 없습니다." />
      ) : (
        <>
          <div className="flex flex-col flex-grow gap-4 h-full ml-8">
            <LivePlayer mediaStream={mediaStream} />
            <LiveCamperInfo liveId={liveId} />
          </div>
          <div className="flex h-full w-80 pr-5">
            <ChatContainer roomId={liveId} isProducer={false} />
          </div>
        </>
      )}
    </div>
  );
}
