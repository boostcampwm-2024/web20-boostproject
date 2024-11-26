import BroadcastTitle from './BroadcastTitle';
import ChatContainer from '@components/ChatContainer';
import ErrorCharacter from '@components/ErrorCharacter';
import { useMediaControls } from '@hooks/useMediaControls';
import { useMediaStream } from '@hooks/useMediaStream';
import { useProducer } from '@hooks/useProducer';
import { useRoom } from '@hooks/useRoom';
import { useSocket } from '@hooks/useSocket';
import { useTransport } from '@hooks/useTransport';
import { MicrophoneOffIcon, MicrophoneOnIcon, VideoOffIcon, VideoOnIcon, MonitorShareIcon } from '@/components/Icons';
import { Button } from '@components/ui/button';
import { useEffect, useRef, useState } from 'react';
import useScreenShare from '@/hooks/useScreenShare';
import BroadcastPlayer from './BroadcastPlayer';
import { Tracks } from '@/types/mediasoupTypes';

const mediaServerUrl = import.meta.env.VITE_MEDIASERVER_URL;

function Broadcast() {
  const tracksRef = useRef<Tracks>({ video: undefined, mediaAudio: undefined, screenAudio: undefined });
  const [isStreamReady, setIsStreamReady] = useState(false);
  // 미디어 스트림(비디오, 오디오)
  const { mediaStream, mediaStreamError, isMediastreamReady: _imsr } = useMediaStream();
  const { isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo } = useMediaControls(mediaStream);

  // 화면 공유
  const { screenStream, isScreenSharing, screenShareError, toggleScreenShare } = useScreenShare();

  // 방송 송출
  const { socket, isConnected, socketError } = useSocket(mediaServerUrl);
  const { roomId, roomError } = useRoom(socket, isConnected);
  const { transportInfo, device, transportError } = useTransport({ socket, roomId, isProducer: true });
  const { transport, error: mediasoupError } = useProducer({
    socket,
    tracks: tracksRef.current,
    isStreamReady,
    transportInfo,
    device,
    roomId,
  });
  const [title, setTitle] = useState<string>('J000님의 방송');

  const stopBroadcast = (e?: BeforeUnloadEvent) => {
    if (e) {
      e.preventDefault();
      e.returnValue = '';
    }
    if (socket) {
      socket.emit('stopBroadcast', { roomId }, (response: { isCleaned: boolean; roomId: string }) => {
        if (response.isCleaned) {
          console.log(`${response.roomId} 방이 정리됐습니다.`);
        } else {
          console.error('방 정리 실패');
        }
      });
      socket.disconnect();
      mediaStream?.getTracks().forEach(track => {
        track.stop();
      });
    }
    transport?.close();
  };

  useEffect(() => {
    window.addEventListener('beforeunload', stopBroadcast);

    tracksRef.current['mediaAudio'] = mediaStream?.getAudioTracks()[0];
    return () => {
      window.removeEventListener('beforeunload', stopBroadcast);
    };
  }, []);

  const handleCheckout = () => {
    stopBroadcast();
    window.close();
  };

  const handleBroadcastTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  if (socketError || roomError || transportError || screenShareError) {
    return (
      <div className="flex h-full justify-center items-center">
        <ErrorCharacter
          size={300}
          message={`방송 연결 중 에러가 발생했습니다: ${
            socketError
              ? socketError.message
              : roomError
              ? roomError.message
              : transportError
              ? transportError.message
              : screenShareError?.message
          }`}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 h-full">
      {mediaStreamError || mediasoupError ? (
        <>
          <h2 className="text-display-bold24 text-text-danger">Error</h2>
          {mediaStreamError && <div className="text-display-medium16 text-text-danger">{mediaStreamError.message}</div>}
          {mediasoupError && <div className="text-display-medium16 text-text-danger">{mediasoupError.message}</div>}
        </>
      ) : (
        <>
          <BroadcastPlayer
            mediaStream={mediaStream}
            screenStream={screenStream}
            isVideoEnabled={isVideoEnabled}
            isScreenSharing={isScreenSharing}
            isStreamReady={isStreamReady}
            setIsStreamReady={setIsStreamReady}
            tracksRef={tracksRef}
          />
          <div className="w-full">
            <BroadcastTitle currentTitle={title} onTitleChange={handleBroadcastTitle} />
            <div className="flex justify-between items-center m-4">
              <Button onClick={handleCheckout} className="bg-surface-brand-default hover:hover:bg-surface-brand-alt">
                체크아웃
              </Button>
              <div className="flex items-center gap-4">
                <button onClick={toggleVideo}>{isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}</button>
                <button onClick={toggleAudio}>{isAudioEnabled ? <MicrophoneOnIcon /> : <MicrophoneOffIcon />}</button>
                <button onClick={toggleScreenShare}>
                  <MonitorShareIcon />
                </button>
              </div>
            </div>
          </div>
          <ChatContainer roomId={roomId} isProducer={true} />
        </>
      )}
    </div>
  );
}

export default Broadcast;
