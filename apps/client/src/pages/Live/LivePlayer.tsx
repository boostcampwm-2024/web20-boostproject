import { useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import PlayIcon from '@components/icons/PlayIcon';
import PauseIcon from '@components/icons/PauseIcon';
import VolumeOnIcon from '@components/icons/VolumeOnIcon';
import VolumeOffIcon from '@components/icons/VolumeOffIcon';
import ExpandIcon from '@components/icons/ExpandIcon';

type VideoQuality = '480' | '720' | '1080';

function LivePlayer({ mediaStream }: { mediaStream: MediaStream | null }) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('480');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && mediaStream) {
      videoElement.srcObject = mediaStream;
    }

    return () => {
      if (videoElement && videoElement.srcObject) {
        videoElement.srcObject = null;
      }
    };
  }, [mediaStream]);

  const handlePlayPause = async () => {
    if (mediaStream && videoRef.current) {
      if (isVideoEnabled) {
        videoRef.current.pause();
        setIsVideoEnabled(false);
      } else {
        videoRef.current.play();
        setIsVideoEnabled(true);
      }
    }
  };

  const handleMute = () => {
    if (mediaStream) {
      setIsAudioEnabled(prev => !prev);
    }
  };

  const handleVideoQuality = (videoQuality: VideoQuality) => {
    setVideoQuality(videoQuality);
  };

  const handleExpand = async () => {
    try {
      await videoRef.current?.requestFullscreen?.();
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  return (
    <section className="relative w-full h-full rounded-xl flex justify-center">
      <video
        ref={videoRef}
        autoPlay
        muted={isAudioEnabled ? false : true}
        className=" h-full aspect-video object-cover"
      />
      <div className="absolute bottom-4 left-0 right-0 px-6 text-text-default h-6 flex flex-row justify-between items-center">
        <div className="flex flex-row space-x-6 items-center">
          <button onClick={handlePlayPause}>{isVideoEnabled ? <PauseIcon /> : <PlayIcon />}</button>
          <button onClick={handleMute}>{isAudioEnabled ? <VolumeOnIcon /> : <VolumeOffIcon />}</button>
        </div>
        <div className="flex flex-row space-x-6 items-center">
          <Select onValueChange={value => handleVideoQuality(value as VideoQuality)}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={videoQuality + 'p'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="480">480p</SelectItem>
              <SelectItem value="720">720p</SelectItem>
              <SelectItem value="1080">1080p</SelectItem>
            </SelectContent>
          </Select>
          <button onClick={handleExpand}>
            <ExpandIcon />
          </button>
        </div>
      </div>
    </section>
  );
}

export default LivePlayer;
