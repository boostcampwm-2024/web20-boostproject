import BroadcastTitle from './BroadcastTitle';
import ChatContainer from '@components/ChatContainer';
import ErrorCharacter from '@components/ErrorCharacter';
import { useProducer } from '@hooks/useProducer';
import { useRoom } from '@hooks/useRoom';
import { useSocket } from '@hooks/useSocket';
import { useTransport } from '@hooks/useTransport';
import {
  MicrophoneOffIcon,
  MicrophoneOnIcon,
  VideoOffIcon,
  VideoOnIcon,
  ScreenShareIcon,
  ScreenShareIconOff,
} from '@/components/Icons';
import { Button } from '@components/ui/button';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import useScreenShare from '@/hooks/useScreenShare';
import BroadcastPlayer from './BroadcastPlayer';
import { Tracks } from '@/types/mediasoupTypes';
import RecordButton from './RecordButton';
import axiosInstance from '@/services/axios';
import { useMedia } from '@/hooks/useMedia';
import { useTheme } from '@/hooks/useTheme';

const mediaServerUrl = import.meta.env.VITE_MEDIASERVER_URL;

function Broadcast() {
  // 미디어 스트림(비디오, 오디오)
  const {
    mediaStream,
    mediaStreamError,
    isMediaStreamReady,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
  } = useMedia();

  // 화면 공유
  const { screenStream, isScreenSharing, screenShareError, toggleScreenShare } = useScreenShare();
  // 송출 정보
  const tracksRef = useRef<Tracks>({ video: undefined, mediaAudio: undefined, screenAudio: undefined });
  const [isStreamReady, setIsStreamReady] = useState(false);
  // 방송 송출
  const { socket, isConnected, socketError } = useSocket(mediaServerUrl);
  const { roomId, roomError } = useRoom(socket, isConnected, isMediaStreamReady);
  const { transportInfo, device, transportError } = useTransport({ socket, roomId, isProducer: true });
  const {
    transport,
    error: mediasoupError,
    producers,
  } = useProducer({
    socket,
    mediaStream,
    isMediaStreamReady,
    transportInfo,
    device,
    roomId,
  });
  // 방송 정보
  const [title, setTitle] = useState<string>('');
  // 테마
  const { theme } = useTheme();

  useLayoutEffect(() => {
    if (theme === 'light') {
      document.querySelector('html')?.setAttribute('data-theme', 'light');
    } else {
      document.querySelector('html')?.removeAttribute('data-theme');
    }
  }, []);

  useEffect(() => {
    tracksRef.current['mediaAudio'] = mediaStream?.getAudioTracks()[0];

    axiosInstance.get('/v1/members/info').then(response => {
      if (response.data.success) {
        setTitle(`${response.data.data.camperId}님의 방송`);
      }
    });

    window.addEventListener('beforeunload', stopBroadcast);
    return () => {
      window.removeEventListener('beforeunload', stopBroadcast);
    };
  }, []);

  useEffect(() => {
    changeTrack();
  }, [isVideoEnabled, isScreenSharing]);

  const changeTrack = async () => {
    const currentProducer = producers.get('video');
    if (!currentProducer) return;

    currentProducer.pause();

    let newTrack = null;

    if (isVideoEnabled && isScreenSharing) {
      newTrack = tracksRef.current.video || null;
    } else if (isVideoEnabled && !isScreenSharing) {
      newTrack = mediaStream?.getVideoTracks()[0] || null;
    } else if (!isVideoEnabled && isScreenSharing) {
      newTrack = screenStream?.getVideoTracks()[0] || null;
    }

    if (isVideoEnabled && mediaStream) mediaStream.getVideoTracks()[0].enabled = true;
    if (isScreenSharing && screenStream) screenStream.getVideoTracks()[0].enabled = true;

    await currentProducer.replaceTrack({ track: newTrack });

    if (newTrack) {
      currentProducer.resume();
    }
  };

  const stopBroadcast = (e?: BeforeUnloadEvent) => {
    if (e) {
      e.preventDefault();
      e.returnValue = '';
    }
    if (socket) {
      socket.emit('stopBroadcast', { roomId });
      socket.disconnect();
      mediaStream?.getTracks().forEach(track => {
        track.stop();
      });
    }
    transport?.close();
  };

  const handleCheckout = () => {
    stopBroadcast();
    window.close();
  };

  const handleBroadcastTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  const playPauseAudio = () => {
    if (isAudioEnabled) {
      producers.get('mediaAudio')?.pause();
      if (tracksRef.current.mediaAudio) tracksRef.current.mediaAudio.enabled = false;
    } else {
      producers.get('mediaAudio')?.resume();
      if (tracksRef.current.mediaAudio) tracksRef.current.mediaAudio.enabled = true;
    }
  };

  if (socketError || roomError || transportError || screenShareError) {
    mediaStream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    return (
      <div className="flex h-full justify-center items-center">
        <ErrorCharacter size={300} message="방송 연결 중 에러가 발생했습니다" />
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
              <div className="flex justify-around gap-2">
                <Button onClick={handleCheckout} className="bg-surface-brand-default hover:hover:bg-surface-brand-alt">
                  체크아웃
                </Button>
                <RecordButton socket={socket} roomId={roomId} />
              </div>

              <div className="flex items-center gap-4">
                <button onClick={toggleVideo}>{isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}</button>
                <button
                  onClick={() => {
                    toggleAudio();
                    playPauseAudio();
                  }}
                >
                  {isAudioEnabled ? <MicrophoneOnIcon /> : <MicrophoneOffIcon />}
                </button>
                <button onClick={toggleScreenShare}>
                  {isScreenSharing ? <ScreenShareIcon /> : <ScreenShareIconOff />}
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
