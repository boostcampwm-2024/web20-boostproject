import { useEffect, useRef, useState } from 'react';

export const useMedia = () => {
  // 미디어 스트림 ref와 상태들
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [mediaStreamError, setMediaStreamError] = useState<Error | null>(null);
  const [isMediaStreamReady, setIsMediaStreamReady] = useState(false);

  // 미디어 컨트롤 상태들
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const initializeStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      mediaStreamRef.current = mediaStream;
      setIsMediaStreamReady(true);

      // 초기 트랙 상태 설정
      const videoTrack = mediaStream.getVideoTracks()[0];
      const audioTrack = mediaStream.getAudioTracks()[0];
      setIsVideoEnabled(videoTrack?.enabled ?? false);
      setIsAudioEnabled(audioTrack?.enabled ?? false);
    } catch (err) {
      setMediaStreamError(err instanceof Error ? err : new Error('유저 미디어(비디오, 오디오) 갖고 오기 실패'));
    }
  };

  const getNewVideoStream = async () => {
    try {
      // 비디오만 새로 받아옴
      const newVideoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false, // 오디오는 새로 받지 않음
      });

      if (mediaStreamRef.current) {
        // 기존 오디오 트랙 유지
        const audioTrack = mediaStreamRef.current.getAudioTracks()[0];

        // 기존 비디오 트랙만 정리
        mediaStreamRef.current.getVideoTracks().forEach(track => track.stop());

        // 새로운 스트림에 기존 오디오 트랙 추가
        newVideoStream.addTrack(audioTrack);
      }

      mediaStreamRef.current = newVideoStream;
      setIsVideoEnabled(true);

      return newVideoStream;
    } catch (err) {
      setMediaStreamError(err instanceof Error ? err : new Error('비디오 스트림 획득 실패'));
      return null;
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
    getNewVideoStream,
    mediaStream: mediaStreamRef.current,
    mediaStreamError,
    isMediaStreamReady,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
  };
};
