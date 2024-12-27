import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@components/ui/button';
import axiosInstance from '@services/axios';

interface Inputs {
  title: string;
}

interface BroadcastTitleProps {
  currentTitle: string;
  onTitleChange: (newTitle: string) => void;
}

function BroadcastTitle({ currentTitle, onTitleChange }: BroadcastTitleProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [isEditing, setIsEditing] = useState(false);

  const handleEditTitle = () => {
    setIsEditing(true);
  };

  const onSubmit: SubmitHandler<Inputs> = data => {
    axiosInstance.patch('/v1/broadcasts/title', { title: data.title }).then(response => {
      if (!response.data.success) {
        alert('제목 변경에 실패했습니다!');
      } else {
        onTitleChange(data.title);
      }
    });
    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
        <div className="flex flex-row justify-between p-4 w-full h-20">
          <form onSubmit={handleSubmit(onSubmit)} className="flex w-full">
            <div className="flex-1 mr-2 relative">
              <input
                defaultValue={currentTitle}
                {...register('title', { required: true, maxLength: 50 })}
                className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
              />
              {(errors.title?.type === 'required' || errors.title?.type === 'maxLength') && (
                <p role="alert" className="absolute top-11 left-0 text-text-danger text-display-medium12">
                  {errors.title?.type === 'required'
                    ? '방송 제목을 입력해주세요'
                    : '방송 제목은 50자 이하로 입력해주세요'}
                </p>
              )}
            </div>
            <Button type="submit" className="h-10 shrink-0">
              저장
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex flex-row justify-between p-4 h-20">
          <div className="text-text-default text-display-bold24">{currentTitle}</div>
          <Button className="bg-transparent border border-border-default text-text-strong" onClick={handleEditTitle}>
            수정
          </Button>
        </div>
      )}
    </>
  );
}

export default BroadcastTitle;
