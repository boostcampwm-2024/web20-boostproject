import { useMediaControls } from '@/hooks/useMediaControls';
import { useMediaStream } from '@/hooks/useMediaStream';
import { useProducer } from '@/hooks/useProducer';
import { useRoom } from '@/hooks/useRoom';
import { useSocket } from '@/hooks/useSocket';
import { useTransport } from '@/hooks/useTransport';
import ChatIcon from '@components/icons/ChatIcon';
import MicrophoneOffIcon from '@components/icons/MicrophoneOffIcon';
import MicrophoneOnIcon from '@components/icons/MicrophoneOnIcon';
import MonitorShareIcon from '@components/icons/MonitorShareIcon';
import VideoOffIcon from '@components/icons/VideoOffIcon';
import VideoOnIcon from '@components/icons/VideoOnIcon';
import { Button } from '@components/ui/button';
import { useCallback, useEffect } from 'react';

const socketUrl = import.meta.env.VITE_MEDIASERVER_URL;

function Broadcast() {
  const { mediaStream, mediaStreamError, isMediastreamReady, videoRef } = useMediaStream();
  const { isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo } = useMediaControls(mediaStream);
  const { socket, isConnected, socketError: _se } = useSocket(socketUrl);
  const { roomId, roomError: _re } = useRoom(socket, isConnected);
  const { transportInfo, device, transportError: _te } = useTransport({ socket, roomId, isProducer: true });

  const { transport: _t, error: mediasoupError } = useProducer({
    socket,
    isMediastreamReady,
    mediaStream,
    transportInfo,
    device,
    roomId,
  });

  const stopBroadcast = useCallback(
    (e?: BeforeUnloadEvent) => {
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
    },
    [socket, roomId],
  );

  useEffect(() => {
    window.addEventListener('beforeunload', stopBroadcast);
  }, [socket]);

  const handleCheckout = () => {
    stopBroadcast();
    window.close();
  };

  return (
    <>
      {mediaStreamError || mediasoupError ? (
        <div className="flex flex-col ">
          <h2 className="text-display-bold24 text-text-danger">Error</h2>
          {mediaStreamError && <div className="text-display-medium16 text-text-danger">{mediaStreamError.message}</div>}
          {mediasoupError && <div className="text-display-medium16 text-text-danger">{mediasoupError.message}</div>}
        </div>
      ) : (
        <>
          <div className="w-full aspect-video p-4">
            <video ref={videoRef} autoPlay muted className="w-full h-full bg-surface-alt rounded-xl" />
            <audio />
          </div>
          <div className="w-full">
            <div className="flex flex-row justify-between p-4">
              <div className="text-text-default text-display-medium16">방송 제목</div>
              <Button className="bg-transparent border border-border-default">수정</Button>
            </div>
            <div className="flex justify-between items-center m-4">
              <Button onClick={handleCheckout} className="bg-surface-brand-default hover:hover:bg-surface-brand-alt">
                체크아웃
              </Button>
              <div className="flex items-center gap-4">
                <button onClick={toggleVideo}>{isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}</button>
                <button onClick={toggleAudio}>{isAudioEnabled ? <MicrophoneOnIcon /> : <MicrophoneOffIcon />}</button>
                <button>
                  <MonitorShareIcon />
                </button>
                <button>
                  <ChatIcon />
                </button>
              </div>
            </div>
          </div>
          <div className="border border-border-default rounded-xl"></div>
        </>
      )}
    </>
  );
}

export default Broadcast;
