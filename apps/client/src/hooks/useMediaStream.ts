import { useEffect, useRef, useState } from 'react';

export const useMediaStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  // const [mediaStream, setIsMediastream] = useState<MediaStream | null>(null);
  const [mediaStreamError, setMediaStreamError] = useState<Error | null>(null);
  const [isMediastreamReady, setIsMediastreamReady] = useState(false);

  const initializeStream = async () => {
    try {
      const constraints = {
        video: true,
        audio: true,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setIsMediastreamReady(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      mediaStreamRef.current = mediaStream;
    } catch (err) {
      setMediaStreamError(err instanceof Error ? err : new Error('유저 미디어(비디오, 오디오) 갖고 오기 실패'));
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    initializeStream();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, []);

  return {
    mediaStream: mediaStreamRef.current,
    mediaStreamError,
    isMediastreamReady,
    videoRef,
  };
};
