import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserData } from '.';
import { useForm } from 'react-hook-form';
import { Field } from '@/types/liveTypes';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface EditUserInfoProps {
  userData: UserData | undefined;
  toggleEditing: () => void;
}

interface FormInput {
  camperId: string | undefined;
  name: string | undefined;
  type: Field | undefined;
  email: string | undefined;
  github: string | undefined;
  blog: string | undefined;
  linkedIn: string | undefined;
}

function EditUserInfo({ userData, toggleEditing }: EditUserInfoProps) {
  const [selectedField, setSelectedField] = useState<Field | undefined>(userData?.field);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      camperId: userData?.camperId,
      name: userData?.name,
      type: userData?.field,
      email: userData?.contacts.email,
      github: userData?.contacts.github,
      blog: userData?.contacts.blog,
      linkedIn: userData?.contacts.linkedIn,
    },
  });

  const handleSelectField = (field: Field) => {
    setSelectedField(selectedField === field ? '' : field);
  };

  const handlePatchUserInfo = (data: FormInput) => {
    const formData = {
      name: data.name,
      camperId: data.camperId,
      type: selectedField,
      contacts: {
        email: data.email ? data.email : '',
        github: data.github ? data.github : '',
        blog: data.blog ? data.blog : '',
        linkedin: data.linkedIn ? data.linkedIn : '',
      },
    };
    // TODO: 수정 요청
    alert(formData);
    toggleEditing();
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-10">
      <Avatar className="w-64 h-64">
        <AvatarImage src={userData?.profileImage} />
        <AvatarFallback>MY</AvatarFallback>
      </Avatar>
      <form onSubmit={handleSubmit(handlePatchUserInfo)} className="flex flex-col w-1/2 gap-5">
        {(errors.camperId || errors.name) && (
          <p className="flex justify-end text-text-danger text-display-medium12">
            {errors.camperId ? errors.camperId.message : errors.name ? errors.name.message : '분야를 선택해주세요'}
          </p>
        )}
        {/* ID */}
        <div className="flex flex-row justify-center items-center">
          <label className="w-32 text-text-strong text-display-bold24">ID</label>
          <input
            {...register('camperId', {
              required: 'ID를 입력해주세요',
            })}
            className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
          />
        </div>
        {/* 이름 */}
        <div className="flex flex-row justify-center items-center">
          <label className="w-32 text-text-strong text-display-bold24">이름</label>
          <input
            {...register('name', {
              required: '이름을 입력해주세요',
            })}
            className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
          />
        </div>
        {/* TODO: 입력 검증 */}
        {/* email */}
        <div className="flex flex-row justify-center items-center">
          <label className="w-32 text-text-strong text-display-bold24">Email</label>
          <input
            {...register('email')}
            className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
          />
        </div>
        {/* github */}
        <div className="flex flex-row justify-center items-center">
          <label className="w-32 text-text-strong text-display-bold24">Github</label>
          <input
            {...register('github')}
            className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
          />
        </div>
        {/* blog */}
        <div className="flex flex-row justify-center items-center">
          <label className="w-32 text-text-strong text-display-bold24">Blog</label>
          <input
            {...register('blog')}
            className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
          />
        </div>
        {/* linkedIn */}
        <div className="flex flex-row justify-center items-center">
          <label className="w-32 text-text-strong text-display-bold24">LinkedIn</label>
          <input
            {...register('linkedIn')}
            className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
          />
        </div>
        {/* 분야 */}
        <div className="flex flex-row justify-start items-center">
          <label className="w-32 text-text-strong text-display-bold24">분야</label>
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => handleSelectField('WEB')}
              className={`${selectedField === 'WEB' && 'bg-surface-brand-default hover:bg-surface-brand-alt'}`}
            >
              WEB
            </Button>
            <Button
              type="button"
              onClick={() => handleSelectField('AND')}
              className={`${selectedField === 'AND' && 'bg-surface-brand-default hover:bg-surface-brand-alt'}`}
            >
              AND
            </Button>
            <Button
              type="button"
              onClick={() => handleSelectField('IOS')}
              className={`${selectedField === 'IOS' && 'bg-surface-brand-default hover:bg-surface-brand-alt'}`}
            >
              IOS
            </Button>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="h-10 shrink-0">
            저장
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditUserInfo;
