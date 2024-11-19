import LiveList from '@/components/LiveList';
import LoadingCharacter from '@components/common/LoadingCharacter';
import ErrorCharacter from '@components/common/ErrorCharacter';
import { useAPI } from '@/hooks/useAPI';

export default function Home() {
  const { data: liveList, isLoading, error } = useAPI({ url: '/v1/broadcasts' });

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
      ) : (
        <LiveList liveList={liveList} />
      )}
    </div>
  );
}
