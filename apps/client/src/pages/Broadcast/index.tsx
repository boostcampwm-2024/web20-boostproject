import BroadcastTitle from './BroadcastTitle';
import ChatContainer from '@components/ChatContainer';
import ErrorCharacter from '@components/ErrorCharacter';
import { useMediaControls } from '@hooks/useMediaControls';
import { useMediaStream } from '@hooks/useMediaStream';
import { useProducer } from '@hooks/useProducer';
import { useRoom } from '@hooks/useRoom';
import { useSocket } from '@hooks/useSocket';
import { useTransport } from '@hooks/useTransport';
import {
  ChatIcon,
  MicrophoneOffIcon,
  MicrophoneOnIcon,
  VideoOffIcon,
  VideoOnIcon,
  MonitorShareIcon,
} from '@/components/Icons';
import { Button } from '@components/ui/button';
import { useEffect, useRef, useState } from 'react';
import useScreenShare from '@/hooks/useScreenShare';

const mediaServerUrl = import.meta.env.VITE_MEDIASERVER_URL;

function Broadcast() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [isStreamReady, setIsStreamReady] = useState(false);
  // 미디어 스트림(비디오, 오디오)
  const { mediaStream, mediaStreamError, isMediastreamReady } = useMediaStream();
  const { isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo } = useMediaControls(mediaStream);
  // 화면 공유
  const { screenStream, isScreenSharing, screenShareError, toggleScreenShare } = useScreenShare();

  // 방송 송출
  const { socket, isConnected, socketError } = useSocket(mediaServerUrl);
  const { roomId, roomError } = useRoom(socket, isConnected);
  const { transportInfo, device, transportError } = useTransport({ socket, roomId, isProducer: true });
  const { transport, error: mediasoupError } = useProducer({
    socket,
    stream: stream.current,
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

      screenStream?.getTracks().forEach(track => {
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

  // 체크아웃 안하고 바로 창 닫을 때 처리
  useEffect(() => {
    window.addEventListener('beforeunload', stopBroadcast);

    return () => {
      window.removeEventListener('beforeunload', stopBroadcast);
    };
  }, []);

  // 비디오 스트림 설정
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [isMediastreamReady]);

  // 화면 공유 스트림 설정
  useEffect(() => {
    if (screenShareRef.current && screenStream) {
      screenShareRef.current.srcObject = screenStream;
    }
  }, [isScreenSharing]);

  // 미디어스트림 캔버스에 넣기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 1280;
    canvas.height = 720;

    const context = canvas.getContext('2d');
    if (!context) return;

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // 화면 공유 on
      if (isScreenSharing && screenShareRef.current) {
        context.drawImage(screenShareRef.current, 0, 0, canvas.width, canvas.height);
        // 캠 on
        if (isVideoEnabled && videoRef.current) {
          const pipWidth = canvas.width / 4;
          const pipHeight = canvas.height / 4;
          const pipX = canvas.width - pipWidth;
          const pipY = canvas.height - pipHeight;
          context.drawImage(videoRef.current, pipX, pipY, pipWidth, pipHeight);
        }
      } else if (isVideoEnabled && videoRef.current) {
        // 화면 공유 off / 캠 on
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      } else {
        // 화면 공유 off / 캠 off
        context.fillStyle = '#d9d9d9';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      requestAnimationFrame(draw);
    };

    // produce할 때 사용할 새 MediaStream 생성
    const createMixedStream = () => {
      const canvasVideoStream = canvas.captureStream(30);
      const mixedStream = new MediaStream();

      // 캔버스 비디오
      canvasVideoStream.getVideoTracks().forEach(track => {
        mixedStream.addTrack(track);
      });

      // 미디어 오디오
      if (mediaStream) {
        const audioTrack = mediaStream.getAudioTracks()[0];
        if (audioTrack && audioTrack.enabled) {
          mixedStream.addTrack(audioTrack);
        }
      }

      // 화면 공유 오디오
      if (isScreenSharing && screenStream) {
        const screenAudioTracks = screenStream.getAudioTracks();
        screenAudioTracks.forEach(track => {
          mixedStream.addTrack(track);
        });
      }

      return mixedStream;
    };

    const startDrawing = async () => {
      draw();
      stream.current = createMixedStream();
      if (!isStreamReady) setIsStreamReady(true);
    };

    if (videoRef.current) {
      videoRef.current.onloadedmetadata = startDrawing;
      if (videoRef.current.readyState >= 2) {
        startDrawing();
      }
    }
  }, [isVideoEnabled, isAudioEnabled, isScreenSharing, mediaStream, screenStream]);

  if (socketError || roomError || transportError) {
    return (
      <div className="flex h-full justify-center items-center">
        <ErrorCharacter
          size={300}
          message={`방송 연결 중 에러가 발생했습니다: ${
            socketError ? socketError.message : roomError ? roomError.message : transportError?.message
          }`}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 h-full">
      {mediaStreamError || mediasoupError || screenShareError ? (
        <>
          <h2 className="text-display-bold24 text-text-danger">Error</h2>
          {mediaStreamError && <div className="text-display-medium16 text-text-danger">{mediaStreamError.message}</div>}
          {mediasoupError && <div className="text-display-medium16 text-text-danger">{mediasoupError.message}</div>}
          {screenShareError && <div className="text-display-medium16 text-text-danger">{screenShareError.message}</div>}
        </>
      ) : (
        <>
          <div className="relative w-full max-h-[310px] aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <video
              ref={screenShareRef}
              autoPlay
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="absolute top-0 left-0 w-full h-full bg-surface-alt rounded-xl object-cover"
            ></canvas>
          </div>
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
                <button>
                  <ChatIcon />
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
