import { RESOLUTION_OPTIONS } from '@/constants/videoOptions';
import { Tracks } from '@/types/mediasoupTypes';
import { useEffect, useRef } from 'react';

interface BroadcastPlayerProps {
  mediaStream: MediaStream | null;
  screenStream: MediaStream | null;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isStreamReady: boolean;
  setIsStreamReady: (ready: boolean) => void;
  tracksRef: React.MutableRefObject<Tracks>;
}

function BroadcastPlayer({
  mediaStream,
  screenStream,
  isVideoEnabled,
  isScreenSharing,
  isStreamReady,
  setIsStreamReady,
  tracksRef,
}: BroadcastPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // 비디오 스트림 설정
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [isVideoEnabled, mediaStream]);

  // 화면 공유 스트림 설정
  useEffect(() => {
    if (screenShareRef.current && screenStream) {
      screenShareRef.current.srcObject = screenStream;
    }
  }, [isScreenSharing, screenStream]);

  useEffect(() => {
    tracksRef.current['mediaAudio'] = mediaStream?.getAudioTracks()[0];
  }, [mediaStream]);

  useEffect(() => {
    tracksRef.current['screenAudio'] = screenStream?.getAudioTracks()[0];
  }, [screenStream]);

  // 미디어스트림 캔버스에 넣기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = RESOLUTION_OPTIONS['high'].width;
    canvas.height = RESOLUTION_OPTIONS['high'].height;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (isScreenSharing && screenShareRef.current) {
        const screenVideo = screenShareRef.current;

        const screenRatio = screenVideo.videoWidth / screenVideo.videoHeight;
        const canvasRatio = canvas.width / canvas.height;
        const draw = { width: canvas.width, height: canvas.height, x: 0, y: 0 };

        if (screenRatio > canvasRatio) {
          // 화면이 더 넓은 경우
          draw.height = canvas.width / screenRatio;
          draw.y = (canvas.height - draw.height) / 2;
        } else {
          // 화면이 더 좁은 경우
          draw.width = canvas.height * screenRatio;
          draw.x = (canvas.width - draw.width) / 2;
        }

        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(screenVideo, draw.x, draw.y, draw.width, draw.height);

        if (isVideoEnabled && videoRef.current) {
          const pipWidth = canvas.width / 4;
          const pipHeight = canvas.height / 4;
          const pipX = canvas.width - pipWidth;
          const pipY = canvas.height - pipHeight;
          context.drawImage(videoRef.current, pipX, pipY, pipWidth, pipHeight);
        }
      }
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    const startDrawing = async () => {
      draw();
      tracksRef.current['video'] = canvas.captureStream(30).getVideoTracks()[0];
      videoRef.current?.play();
      screenShareRef.current?.play();
      if (!isStreamReady) setIsStreamReady(true);
    };

    if (isVideoEnabled && isScreenSharing && mediaStream && screenStream) {
      startDrawing();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVideoEnabled, isScreenSharing, mediaStream, screenStream, isStreamReady]);

  return (
    <div className="relative w-full max-h-[310px] aspect-video">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`absolute top-0 left-0 w-full h-full bg-black ${isVideoEnabled ? '' : 'hidden'}`}
      />
      <video
        ref={screenShareRef}
        autoPlay
        muted
        playsInline
        className={`absolute top-0 left-0 w-full h-full bg-black ${isScreenSharing ? '' : 'hidden'}`}
      />
      <canvas
        ref={canvasRef}
        width={RESOLUTION_OPTIONS['high'].width}
        height={RESOLUTION_OPTIONS['high'].height}
        className={`absolute top-0 left-0 w-full h-full bg-black object-cover ${
          !isScreenSharing || !isVideoEnabled ? 'hidden' : ''
        }`}
      />
    </div>
  );
}

export default BroadcastPlayer;
