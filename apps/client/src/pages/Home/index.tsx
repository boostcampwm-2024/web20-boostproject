import LiveList from '@pages/Home/LiveList';
import LoadingCharacter from '@components/LoadingCharacter';
import ErrorCharacter from '@components/ErrorCharacter';
import { useAPI } from '@hooks/useAPI';
import { LivePreviewInfo } from '@/types/homeTypes';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: liveList, isLoading, error } = useAPI<LivePreviewInfo[]>({ url: '/v1/broadcasts' });
  const [fakeLoading, setFakeLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="flex justify-center w-full h-full">
      {error ? (
        <div className="flex justify-center items-center flex-1">
          <ErrorCharacter message={error.message} />
        </div>
      ) : isLoading || fakeLoading ? (
        <div className="flex justify-center items-center flex-1">
          <LoadingCharacter />
        </div>
      ) : liveList ? (
        <LiveList liveList={liveList} />
      ) : (
        <div>방송 중인 캠퍼가 없습니다.</div>
      )}
    </div>
  );
}
