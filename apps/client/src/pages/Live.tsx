import ChatContainer from '@/components/ChatContainer';
import ErrorCharacter from '@/components/common/ErrorCharacter';
import LiveCamperInfo from '@/components/LiveCamperInfo';
import { useConsumer } from '@/hooks/useConsumer';
import { useSocket } from '@/hooks/useSocket';
import { useTransport } from '@/hooks/useTransport';
import LivePlayer from '@components/LivePlayer';
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
    <div className="fixed top-[88px] bottom-0 left-0 right-0 overflow-auto flex flex-row w-full gap-10">
      {socketError || transportError ? (
        <div className="flex w-full h-full justify-center items-center">
          <ErrorCharacter size={400} message="방송 연결 중 에러가 발생했습니다. 관리자에게 문의하세요" />
        </div>
      ) : (
        <>
          <div className="flex flex-col basis-3/4 gap-4 w-7/12 h-full ml-8">
            <LivePlayer mediaStream={mediaStream} />
            <div className="flex-grow">
              <LiveCamperInfo liveId={liveId} />
            </div>
          </div>
          <div className="basis-1/4 pr-5">
            <ChatContainer />
          </div>
        </>
      )}
    </div>
  );
}
