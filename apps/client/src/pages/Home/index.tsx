import LiveList from '@pages/Home/LiveList';
import LoadingCharacter from '@components/LoadingCharacter';
import ErrorCharacter from '@components/ErrorCharacter';
import { useAPI } from '@hooks/useAPI';
import { LivePreviewListInfo } from '@/types/homeTypes';
import { useEffect, useState } from 'react';
import Banner from './Banner';

export default function Home() {
  const { data: liveListInfo, isLoading, error } = useAPI<LivePreviewListInfo>({ url: '/v1/broadcasts' });
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, 250);

    return () => clearTimeout(timer);
  });

  return (
    <div className="flex justify-center w-full h-full">
      {error ? (
        <div className="flex justify-center items-center flex-1">
          <ErrorCharacter message={error.message} />
        </div>
      ) : isLoading && showLoading ? (
        <div className="flex justify-center items-center flex-1">
          <LoadingCharacter />
        </div>
      ) : (
        <div className="flex flex-col h-full w-full gap-5">
          <Banner />
          {liveListInfo?.broadcasts && liveListInfo.broadcasts.length > 0 ? (
            <LiveList liveList={liveListInfo.broadcasts} />
          ) : (
            <div className="w-full h-full flex justify-center items-center">방송 중인 캠퍼가 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
}
