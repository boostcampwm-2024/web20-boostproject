import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

type MediaStreamCallback = (mediaStream: MediaStream) => void;

function Broadcast() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    getUserVideo((mediaStream: MediaStream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        streamRef.current = mediaStream;
      }
    });
  }, []);

  const getUserVideo = async (callback: MediaStreamCallback) => {
    try {
      const constraints = {
        video: true,
        audio: true,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      callback(mediaStream);
    } catch (err) {
      console.error(err);
      return undefined;
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  return (
    <div className="">
      <div className="w-full aspect-video p-4">
        <video ref={videoRef} autoPlay muted className="w-full h-full bg-surface-alt rounded-xl" />
        <audio />
      </div>
      <div className="w-full">
        <div className="flex flex-row justify-between">
          <div>방송 제목</div>
          <Button className="bg-transparent border border-border-default">수정</Button>
        </div>
        <div className="flex justify-end">
          <button onClick={toggleVideo} className="border">
            비디오 {isVideoEnabled ? '끄기' : '켜기'}
          </button>
          <button onClick={toggleAudio} className="border">
            오디오 {isAudioEnabled ? '끄기' : '켜기'}
          </button>
        </div>
      </div>
      <div className="border border-border-default rounded-xl"></div>
    </div>
  );
}

export default Broadcast;
