import { Tracks } from '@/types/mediasoupTypes';
import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  mediaStream: MediaStream | null;
  screenStream: MediaStream | null;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isStreamReady: boolean;
  setIsStreamReady: (ready: boolean) => void;
  tracksRef: React.MutableRefObject<Tracks>;
  isAudioEnabled: boolean;
}

function VideoPlayer({
  mediaStream,
  screenStream,
  isVideoEnabled,
  isScreenSharing,
  isStreamReady,
  setIsStreamReady,
  tracksRef,
  isAudioEnabled,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 비디오 스트림 설정
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
    tracksRef.current['mediaAudio'] = mediaStream?.getAudioTracks()[0];
  }, [mediaStream]);

  // 화면 공유 스트림 설정
  useEffect(() => {
    if (screenShareRef.current && screenStream) {
      screenShareRef.current.srcObject = screenStream;
    }
    tracksRef.current['screenAudio'] = screenStream?.getAudioTracks()[0];
  }, [isScreenSharing, screenStream]);

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
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      requestAnimationFrame(draw);
    };

    const startDrawing = async () => {
      draw();
      tracksRef.current['video'] = canvas.captureStream(30).getVideoTracks()[0];
      if (!isStreamReady) setIsStreamReady(true);
    };

    if (videoRef.current) {
      videoRef.current.onloadedmetadata = startDrawing;
      if (videoRef.current.readyState >= 2) {
        startDrawing();
      }
    }
  }, [isVideoEnabled, isAudioEnabled, isScreenSharing, mediaStream, screenStream, isStreamReady, setIsStreamReady]);

  return (
    <div className="relative w-full max-h-[310px] aspect-video">
      <video ref={videoRef} autoPlay muted playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
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
        className="absolute top-0 left-0 w-full h-full bg-surface-alt object-cover"
      />
    </div>
  );
}

export default VideoPlayer;
