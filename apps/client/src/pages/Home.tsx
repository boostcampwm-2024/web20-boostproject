import LiveList from '@/components/LiveList';
import LoadingCharacter from '@components/common/LoadingCharacter';
import ErrorCharacter from '@components/common/ErrorCharacter';
import { useAPI } from '@/hooks/useAPI';
import { LivePreviewInfo } from '@/types/homeTypes';

export default function Home() {
  const { data: liveList, isLoading, error } = useAPI<LivePreviewInfo[]>({ url: '/v1/broadcasts' });

  return (
    <div className="flex justify-center w-full h-[calc(100vh-88px)]">
      {error ? (
        <div className="flex justify-center items-center flex-1">
          <ErrorCharacter message={error.message} />
        </div>
      ) : isLoading ? (
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
