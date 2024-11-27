import { Button } from '@/components/ui/button';
import { useState } from 'react';

function RecordButton() {
  // 녹화
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  return (
    <>
      {isRecording ? (
        <Button onClick={handleStopRecording} className="flex gap-2 bg-surface-danger hover:bg-surface-danger-alt">
          <div className="animate-pulse rounded-circle h-3 w-3 bg-white/70" />
          <div className="flex flex-1 justify-center">녹화 중</div>
        </Button>
      ) : (
        <Button onClick={handleStartRecording} className="bg-surface-brand-default hover:bg-surface-brand-alt">
          녹화
        </Button>
      )}
    </>
  );
}

export default RecordButton;
