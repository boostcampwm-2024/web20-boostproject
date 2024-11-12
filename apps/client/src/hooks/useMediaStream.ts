import { useEffect, useRef, useState } from 'react';

interface MediaStreamState {
  mediaStream: MediaStream | null;
  error: Error | null;
}

export const useMediaStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [mediaStramState, setMediaStreamState] = useState<MediaStreamState>({ mediaStream: null, error: null });

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
      setMediaStreamState({
        mediaStream: mediaStream,
        error: null,
      });
    } catch (err) {
      setMediaStreamState({
        mediaStream: null,
        error: err instanceof Error ? err : new Error('Failed to get user media'),
      });
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

  return { ...mediaStramState, videoRef };
};
