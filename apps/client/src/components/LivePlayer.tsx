import { useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import VolumeOnIcon from './icons/VolumeOnIcon';
import VolumeOffIcon from './icons/VolumeOffIcon';
import ExpandIcon from './icons/ExpandIcon';

type VideoQuality = '480' | '720' | '1080';

function LivePlayer(props: { mediastream: MediaStream | null }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('480');

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !props.mediastream) return;

    const videoElement = videoRef.current;
    videoElement.srcObject = props.mediastream;

    return () => {
      if (videoElement.srcObject) {
        videoElement.srcObject = null;
      }
    };
  }, [props.mediastream]);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (videoRef.current.paused) {
        await videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error('Play/Pause error:', err);
    }
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMute(prev => !prev);
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
    <section className="relative w-full aspect-video flex-grow min-h-[70%]">
      <video ref={videoRef} autoPlay className="w-full h-full bg-surface-alt rounded-xl" />
      <div className="absolute bottom-4 left-0 right-0 px-6 text-text-default h-6 flex flex-row justify-between items-center">
        <div className="flex flex-row space-x-6 items-center">
          <button onClick={handlePlayPause}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>
          <button onClick={handleMute}>{isMute ? <VolumeOffIcon /> : <VolumeOnIcon />}</button>
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
