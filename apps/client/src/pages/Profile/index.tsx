import { useEffect, useState } from 'react';
import Attendance from './Attendance';
import UserInfo from './UserInfo';
import EditUserInfo from './EditUserInfo';
import axiosInstance from '@/services/axios';
import { Field } from '@/types/liveTypes';

export interface UserData {
  id: number;
  camperId: string;
  name: string;
  field: Field;
  contacts: Contacts;
  profileImage: string;
}

export interface Contacts {
  email: string;
  github: string;
  blog: string;
  linkedIn: string;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axiosInstance
      .get('/v1/members/info')
      .then(response => {
        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          setError(new Error(response.data.message));
          console.error('유저 정보 조회 실패:', response.data.status);
        }
      })
      .catch(error => setError(error instanceof Error ? error : new Error(error)))
      .finally(() => setIsLoading(false));
  }, [isEditing]);

  const toggleEditing = () => {
    setIsEditing(prev => !prev);
  };

  return (
    <div className="flex flex-col w-full h-full gap-10">
      {isEditing ? (
        <EditUserInfo toggleEditing={toggleEditing} userData={userData} />
      ) : (
        <>
          <UserInfo toggleEditing={toggleEditing} userData={userData} isLoading={isLoading} error={error} />
          <Attendance />
        </>
      )}
    </div>
  );
}
