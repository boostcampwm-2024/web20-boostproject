import { useEffect, useRef, useState } from 'react';

const useScreenShare = () => {
  const screenStreamRef = useRef<MediaStream | null>(null);
  const [screenShareError, setScreenShareError] = useState<Error | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const startScreenShare = async () => {
    try {
      const options = {
        video: true,
        audio: true,
      };

      const mediaStream = await navigator.mediaDevices.getDisplayMedia(options);
      setIsScreenSharing(true);
      screenStreamRef.current = mediaStream;
    } catch (err) {
      setScreenShareError(err instanceof Error ? err : new Error('화면 공유 실패'));
    }
  };

  const endScreenShare = async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsScreenSharing(false);
  };

  const toggleScreenShare = () => {
    if (isScreenSharing) {
      endScreenShare();
    } else {
      startScreenShare();
    }
  };

  useEffect(() => {
    if (isScreenSharing) {
      startScreenShare();
      setIsScreenSharing(false);
    }

    return () => {
      endScreenShare();
    };
  }, []);

  return {
    screenStream: screenStreamRef.current,
    isScreenSharing,
    screenShareError,
    toggleScreenShare,
  };
};

export default useScreenShare;
