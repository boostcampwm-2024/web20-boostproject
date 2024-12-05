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
    error: consumerError,
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
    <div className="flex flex-row w-full h-full gap-10 pb-5">
      {!liveId ? (
        <ErrorCharacter size={400} message="방 정보가 없습니다." />
      ) : (
        <>
          <div className="flex flex-col flex-1 gap-4 ml-8">
            <LivePlayer
              mediaStream={mediaStream}
              transportId={transportInfo?.transportId}
              socket={socket}
              errors={{ socketError, transportError, consumerError }}
            />
            <div className="flex justify-center items-center h-36 w-full">
              <LiveCamperInfo liveId={liveId} />
            </div>
          </div>
          <div className="flex h-full w-80 pr-5">
            <ChatContainer roomId={liveId} isProducer={false} />
          </div>
        </>
      )}
    </div>
  );
}
