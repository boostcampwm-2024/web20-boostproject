import ChatIcon from '@components/icons/ChatIcon';
import MicrophoneOffIcon from '@components/icons/MicrophoneOffIcon';
import MicrophoneOnIcon from '@components/icons/MicrophoneOnIcon';
import MonitorShareIcon from '@components/icons/MonitorShareIcon';
import VideoOffIcon from '@components/icons/VideoOffIcon';
import VideoOnIcon from '@components/icons/VideoOnIcon';
import { Button } from '@components/ui/button';
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

        const audioTrack = mediaStream.getAudioTracks()[0];
        const videoTrack = mediaStream.getVideoTracks()[0];
        setIsAudioEnabled(audioTrack.enabled);
        setIsVideoEnabled(videoTrack.enabled);
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

  const handleCheckout = () => {
    // TODO: 연결 끊기
    window.close();
  };

  return (
    <div className="">
      <div className="w-full aspect-video p-4">
        <video ref={videoRef} autoPlay muted className="w-full h-full bg-surface-alt rounded-xl" />
        <audio />
      </div>
      <div className="w-full">
        <div className="flex flex-row justify-between p-4">
          <div className="text-text-default text-display-medium16">방송 제목</div>
          <Button className="bg-transparent border border-border-default">수정</Button>
        </div>
        <div className="flex justify-between items-center m-4">
          <Button onClick={handleCheckout} className="bg-surface-brand-default hover:hover:bg-surface-brand-alt">
            체크아웃
          </Button>
          <div className="flex items-center gap-4">
            <button onClick={toggleVideo}>{isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}</button>
            <button onClick={toggleAudio}>{isAudioEnabled ? <MicrophoneOnIcon /> : <MicrophoneOffIcon />}</button>
            <button>
              <MonitorShareIcon />
            </button>
            <button>
              <ChatIcon />
            </button>
          </div>
        </div>
      </div>
      <div className="border border-border-default rounded-xl"></div>
    </div>
  );
}

export default Broadcast;
