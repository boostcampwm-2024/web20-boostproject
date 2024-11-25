import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  mediaStream: MediaStream | null;
  screenStream: MediaStream | null;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isStreamReady: boolean;
  setIsStreamReady: (ready: boolean) => void;
  stream: React.MutableRefObject<MediaStream | null>;
  isAudioEnabled: boolean;
}

function VideoPlayer({
  mediaStream,
  screenStream,
  isVideoEnabled,
  isScreenSharing,
  isStreamReady,
  setIsStreamReady,
  stream,
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
  }, [mediaStream]);

  // 화면 공유 스트림 설정
  useEffect(() => {
    if (screenShareRef.current && screenStream) {
      screenShareRef.current.srcObject = screenStream;
    }
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
      if (mediaStream && isAudioEnabled) {
        const audioTrack = mediaStream.getAudioTracks()[0];
        mixedStream.addTrack(audioTrack);
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
  }, [
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    mediaStream,
    screenStream,
    stream,
    isStreamReady,
    setIsStreamReady,
  ]);

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
        className="absolute top-0 left-0 w-full h-full bg-surface-alt rounded-xl object-cover"
      />
    </div>
  );
}

export default VideoPlayer;
