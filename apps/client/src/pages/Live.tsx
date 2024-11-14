import { useConsumer } from '@/hooks/useConsumer';
import { useSocket } from '@/hooks/useSocket';
import { useTransport } from '@/hooks/useTransport';
import LivePlayer from '@components/LivePlayer';
import { useParams } from 'react-router-dom';

const socketUrl = import.meta.env.VITE_MEDIASERVER_URL;

export default function Live() {
  const { liveId } = useParams<{ liveId: string }>();
  const { socket, isConnected, socketError: _se } = useSocket(socketUrl);
  const { transportInfo, device, transportError: _te } = useTransport({ socket, roomId: liveId, isProducer: false });
  const { mediastream: mediastream, error: _error } = useConsumer({
    socket,
    device,
    roomId: liveId,
    transportInfo,
    isConnected,
  });

  return (
    <div className="flex flex-row w-full gap-4">
      <div className="flex flex-col basis-3/4 gap-4 w-3/4 h-full ml-8">
        <LivePlayer mediastream={mediastream} />
        <div className="bg-surface-alt flex-grow">방송자 정보 컴포넌트</div>
      </div>
      <div className="bg-surface-alt basis-1/4">채팅</div>
    </div>
  );
}
