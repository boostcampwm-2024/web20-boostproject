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
  const { socket, isConnected, socketError: _se } = useSocket(socketUrl);
  const {
    transportInfo,
    device,
    transportError: _te,
  } = useTransport({
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
  }, [socket, liveId, transportInfo]);

  return (
    <div className="fixed top-[88px] bottom-0 left-0 right-0 overflow-auto flex flex-row w-full gap-10">
      <div className="flex flex-col basis-3/4 gap-4 w-7/12 h-full ml-8">
        <LivePlayer mediaStream={mediaStream} />
        <div className="flex-grow">
          <LiveCamperInfo />
        </div>
      </div>
      <div className="bg-surface-alt basis-1/4">채팅</div>
    </div>
  );
}
