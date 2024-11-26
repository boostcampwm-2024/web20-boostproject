import { useEffect, useRef, useState } from 'react';

export const useMediaStream = () => {
  const mediaStreamRef = useRef<MediaStream | null>(null);
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

      mediaStreamRef.current = mediaStream;
    } catch (err) {
      setMediaStreamError(err instanceof Error ? err : new Error('유저 미디어(비디오, 오디오) 갖고 오기 실패'));
    }
  };

  useEffect(() => {
    initializeStream();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    mediaStream: mediaStreamRef.current,
    mediaStreamError,
    isMediastreamReady,
  };
};
