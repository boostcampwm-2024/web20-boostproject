import { useEffect, useRef, useState } from 'react';

export const useMedia = () => {
  // 미디어 스트림
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [mediaStreamError, setMediaStreamError] = useState<Error | null>(null);
  const [isMediaStreamReady, setIsMediaStreamReady] = useState(false);

  // 미디어 컨트롤
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const initializeStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: { ideal: 16 / 9 },
        },
        audio: true,
      });

      mediaStreamRef.current = mediaStream;
      setIsMediaStreamReady(true);

      const videoTrack = mediaStream.getVideoTracks()[0];
      const audioTrack = mediaStream.getAudioTracks()[0];
      setIsVideoEnabled(videoTrack?.enabled ?? false);
      setIsAudioEnabled(audioTrack?.enabled ?? false);
    } catch (err) {
      setMediaStreamError(err instanceof Error ? err : new Error('유저 미디어(비디오, 오디오) 갖고 오기 실패'));
    }
  };

  const toggleVideo = () => {
    if (!mediaStreamRef.current) return;
    const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (!mediaStreamRef.current) return;

    const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
    }
  };

  // 초기화 및 클린업
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
    isMediaStreamReady,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
  };
};
