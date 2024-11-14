import { useEffect, useState } from 'react';

interface MediaControlsState {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

interface MediaControlsActions {
  toggleVideo: () => void;
  toggleAudio: () => void;
}

export const useMediaControls = (mediaStream: MediaStream | null): MediaControlsState & MediaControlsActions => {
  const [state, setState] = useState<MediaControlsState>({
    isVideoEnabled: true,
    isAudioEnabled: true,
  });

  useEffect(() => {
    if (!mediaStream) return;

    const videoTrack = mediaStream.getVideoTracks()[0];
    const audioTrack = mediaStream.getAudioTracks()[0];

    setState({
      isVideoEnabled: videoTrack?.enabled ?? false,
      isAudioEnabled: audioTrack?.enabled ?? false,
    });
  }, []);

  const toggleVideo = () => {
    if (!mediaStream) return;
    console.log('toggleVIdeo');
    const videoTrack = mediaStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setState(prev => ({ ...prev, isVideoEnabled: videoTrack.enabled }));
    }
  };

  const toggleAudio = () => {
    if (!mediaStream) return;
    console.log('toggleAudio');
    const audioTrack = mediaStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setState(prev => ({ ...prev, isAudioEnabled: audioTrack.enabled }));
    }
  };

  return {
    ...state,
    toggleVideo,
    toggleAudio,
  };
};
