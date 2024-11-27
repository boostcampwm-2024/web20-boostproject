import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Socket } from 'socket.io-client';

interface Input {
  title: string;
}

interface RecordButtonProps {
  socket: Socket | null;
  roomId: string;
}

function RecordButton({ socket, roomId }: RecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const recordTitleRef = useRef<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();

  const handleStartRecording = () => {
    if (!socket || !roomId) return;
    socket.emit('startRecord', { roomId: roomId }, () => {
      setIsRecording(true);
    });
  };

  const handleStopRecording: SubmitHandler<Input> = () => {
    if (!socket || !roomId) return;
    socket.emit('stopRecord', { roomId: roomId, title: recordTitleRef.current }, () => {
      setIsRecording(false);
    });
  };

  return (
    <>
      {isRecording ? (
        <Button onClick={() => setIsEditing(true)} className="flex gap-2 bg-surface-danger hover:bg-surface-danger-alt">
          <div className="animate-pulse rounded-circle h-3 w-3 bg-white/70" />
          <div className="flex flex-1 justify-center">녹화 중</div>
        </Button>
      ) : (
        <Button onClick={handleStartRecording} className="bg-surface-brand-default hover:bg-surface-brand-alt">
          녹화
        </Button>
      )}
      {isEditing &&
        createPortal(
          <Modal setShowModal={setIsEditing}>
            <div className="flex flex-row justify-between p-4 w-full h-20">
              <form onSubmit={handleSubmit(handleStopRecording)} className="flex w-full">
                <div className="flex-1 mr-2 relative">
                  <input
                    defaultValue={recordTitleRef.current}
                    {...register('title', { required: true, maxLength: 255 })}
                    className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
                  />
                  {(errors.title?.type === 'required' || errors.title?.type === 'maxLength') && (
                    <p role="alert" className="absolute top-11 left-0 text-text-danger text-display-medium12">
                      {errors.title?.type === 'required' ? '제목을 입력해주세요' : '제목은 255자 이하로 입력해주세요'}
                    </p>
                  )}
                </div>
                <Button type="submit" className="h-10 shrink-0">
                  저장
                </Button>
              </form>
            </div>
          </Modal>,
          document.body,
        )}
    </>
  );
}

export default RecordButton;
