import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { Socket } from 'socket.io-client';

interface FormInput {
  title: string;
}

interface RecordButtonProps {
  socket: Socket | null;
  roomId: string;
}

function RecordButton({ socket, roomId }: RecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<FormInput>();

  const handleStartRecording = () => {
    if (!socket?.connected || !roomId) return;
    socket.emit('startRecord', { roomId: roomId }, (response: { success: boolean }) => {
      if (response.success) setIsRecording(true);
      else console.error('녹화 시작 실패');
    });
  };

  const handleStopRecording = (data: FormInput) => {
    if (!socket?.connected || !roomId) return;
    socket.emit('stopRecord', { roomId: roomId, title: data.title }, (response: { success: boolean }) => {
      if (response.success) {
        setIsEditing(false);
        setIsRecording(false);
        reset();
      } else {
        console.error('녹화 종료 실패');
      }
    });
  };

  useEffect(() => {
    setError('title', {
      types: {
        required: '제목을 입력해주세요',
        maxLength: '제목은 255자 이하로 입력해주세요',
      },
    });
  }, [setError]);

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
          <Modal setShowModal={setIsEditing} modalClassName="h-fit w-[80vw]">
            <div className="p-4 w-full">
              <h2 className="text-text-strong text-display-bold16 font-bold mb-1">녹화 영상 저장</h2>
              <form onSubmit={handleSubmit(handleStopRecording)} className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    {...register('title', {
                      required: '저장할 제목을 입력해주세요',
                      maxLength: { value: 255, message: '제목을 255자 이하로 입력해주세요' },
                    })}
                    className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
                  />
                  {errors.title && (
                    <p className="absolute top-11 text-text-danger font-medium text-display-medium12">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="h-10 shrink-0">
                    저장
                  </Button>
                </div>
              </form>
            </div>
          </Modal>,
          document.body,
        )}
    </>
  );
}

export default RecordButton;
