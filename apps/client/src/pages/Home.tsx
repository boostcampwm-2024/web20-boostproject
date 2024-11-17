import { LiveInfo } from '@/types/liveTypes';
import LiveList from '@/components/LiveList';
import axios from 'axios';
import { useEffect, useState } from 'react';
import LoadingCharacter from '@components/common/LoadingCharacter';
import ErrorCharacter from '@components/common/ErrorCharacter';

const baseUrl = import.meta.env.VITE_API_SERVER_URL;

const getLiveList = async (field?: 'WEB' | 'AND' | 'IOS'): Promise<LiveInfo[]> => {
  const response = await axios.get(`${baseUrl}/v1/broadcast/list`, {
    headers: { 'Content-Type': 'application/json' },
    params: {
      field: field,
    },
  });
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export default function Home() {
  const [liveList, setLiveList] = useState<LiveInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLiveList();
        setLiveList(data);
      } catch (err) {
        console.error('Failed to fetch live data: ', err);
        setError('방송 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center w-full h-[calc(100vh-88px)]">
      {error ? (
        <div className="flex justify-center items-center flex-1">
          <ErrorCharacter message={error} />
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center flex-1">
          <LoadingCharacter />
        </div>
      ) : (
        <LiveList liveList={liveList} />
      )}
    </div>
  );
}
