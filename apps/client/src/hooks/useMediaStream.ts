import { useEffect, useRef, useState } from 'react';

export const useMediaStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [mediaStreamError, setMediaStreamError] = useState<Error | null>(null);

  const initializeStream = async () => {
    try {
      const constraints = {
        video: true,
        audio: true,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      streamRef.current = mediaStream;
    } catch (err) {
      setMediaStreamError(err instanceof Error ? err : new Error('유저 미디어(비디오, 오디오) 갖고 오기 실패'));
    }
  };

  useEffect(() => {
    initializeStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return {
    mediaStream: streamRef.current,
    mediaStreamError,
    videoRef,
  };
};
