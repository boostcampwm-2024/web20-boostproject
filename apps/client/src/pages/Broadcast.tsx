import { useMediaControls } from '@/hooks/useMediaControls';
import { useMediaStream } from '@/hooks/useMediaStream';
import ChatIcon from '@components/icons/ChatIcon';
import MicrophoneOffIcon from '@components/icons/MicrophoneOffIcon';
import MicrophoneOnIcon from '@components/icons/MicrophoneOnIcon';
import MonitorShareIcon from '@components/icons/MonitorShareIcon';
import VideoOffIcon from '@components/icons/VideoOffIcon';
import VideoOnIcon from '@components/icons/VideoOnIcon';
import { Button } from '@components/ui/button';

function Broadcast() {
  const { mediaStream, error, videoRef } = useMediaStream();
  const { isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo } = useMediaControls(mediaStream);

  const handleCheckout = () => {
    // TODO: 연결 끊기
    window.close();
  };

  if (error) {
    return (
      <div className="flex flex-col">
        <h2 className="text-display-bold24 text-text-danger">미디어 스트림을 불러오는데 실패했습니다.</h2>
        <div className="text-display-medium16 text-text-danger">error</div>
      </div>
    );
  }

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
