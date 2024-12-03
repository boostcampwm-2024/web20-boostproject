import { useEffect, useState } from 'react';
import Attendance from './Attendance';
import UserInfo from './UserInfo';
import EditUserInfo from './EditUserInfo';
import axiosInstance from '@/services/axios';
import { Field } from '@/types/liveTypes';
import ErrorCharacter from '@/components/ErrorCharacter';
import LoadingCharacter from '@/components/LoadingCharacter';

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

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

  useEffect(() => {
    if (!userData) return;
    if (!userData.camperId || !userData.name || !userData.field) {
      if (!isEditing) setIsEditing(true);
    }
  }, [userData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowLoading(false);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, []);

  const toggleEditing = () => {
    setIsEditing(prev => !prev);
  };

  return (
    <div className="flex flex-col w-full h-full gap-10">
      {showLoading && isLoading ? (
        <div className="flex justify-center items-center">
          <LoadingCharacter size={200} />
        </div>
      ) : error || !userData ? (
        <div className="flex justify-center items-center">
          <ErrorCharacter size={200} message={`${error ? error.message : ' 유저 데이터가 없습니다.'}`} />
        </div>
      ) : isEditing ? (
        <EditUserInfo userData={userData} toggleEditing={toggleEditing} />
      ) : (
        <>
          <UserInfo userData={userData} toggleEditing={toggleEditing} />
          <Attendance />
        </>
      )}
    </div>
  );
}
