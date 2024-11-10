import { useRef, useState } from 'react';
import ExpandIcon from './icons/ExpandIcon';
import PlayIcon from './icons/PlayIcon';
import SoundIcon from './icons/SoundIcon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { PauseIcon } from 'lucide-react';
import SoundXIcon from './icons/SoundXIcon';

type VideoQuality = '480' | '720' | '1080';

function LivePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('480');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(prev => !prev);
    }
  };

  const handleMute = () => {
    setIsMute(prev => !prev);
  };

  const handleVideoQuality = (videoQuality: VideoQuality) => {
    setVideoQuality(videoQuality);
  };

  const handleExpand = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section className="relative w-full aspect-video flex-grow min-h-[70%]">
      <video ref={videoRef} autoPlay className="w-full h-full bg-surface-alt rounded-xl" />
      <div className="absolute bottom-4 left-0 right-0 px-6 text-text-default h-6 flex flex-row justify-between items-center">
        <div className="flex flex-row space-x-6 items-center">
          <button onClick={handlePlayPause}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>
          <button onClick={handleMute}>{isMute ? <SoundXIcon /> : <SoundIcon />}</button>
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
