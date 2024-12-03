import FieldFilter from './FieldFilter';
import LiveCard from './LiveCard';
import { LivePreviewInfo } from '@/types/homeTypes';
import { useEffect, useState } from 'react';
import axiosInstance from '@services/axios';
import Search from './Search';
import { Field } from '@/types/liveTypes';
import { useIntersect } from '@/hooks/useIntersect';

const LIMIT = 12;

function LiveList() {
  const [liveList, setLiveList] = useState<LivePreviewInfo[]>([]);
  const [hasNext, setHasNext] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [field, setField] = useState<Field>('');
  const ref = useIntersect({
    onIntersect: (entry, observer) => {
      observer.unobserve(entry.target);
      if (hasNext && cursor) getLiveList();
    },
    options: { threshold: 0.3 },
  });

  const getLiveList = () => {
    axiosInstance.get('/v1/broadcasts', { params: { field, cursor, limit: LIMIT } }).then(response => {
      if (response.data.success) {
        const { broadcasts, nextCursor } = response.data.data;
        setLiveList(prev => [...prev, ...broadcasts]);
        setCursor(nextCursor);
        if (!nextCursor) setHasNext(false);
      }
    });
  };

  const hanldeFilterField = (field: Field) => {
    axiosInstance.get('/v1/broadcasts', { params: { field, cursor: null, limit: LIMIT } }).then(response => {
      if (response.data.success) {
        const { broadcasts, nextCursor } = response.data.data;
        setLiveList(broadcasts);
        setCursor(nextCursor);
        setHasNext(nextCursor ? true : false);
      }
    });
  };

  const handleSearch = (keyword: string) => {
    setField('');
    setCursor(null);
    axiosInstance.get('/v1/broadcasts/search', { params: { keyword: keyword.trim() } }).then(response => {
      if (response.data.success) {
        setLiveList(response.data.data);
      }
    });
  };

  useEffect(() => {
    getLiveList();
  }, []);

  return (
    <div className="flex flex-col w-full flex-1 p-10 justify-start">
      <div className="h-14 w-full flex justify-between items-center my-5 px-5">
        <FieldFilter onClickFilterButton={hanldeFilterField} />
        <Search onSearch={handleSearch} />
      </div>
      <div className="flex flex-col w-full h-full items-center">
        <div className="grid grid-cols-1 min-[690px]:grid-cols-2 min-[1040px]:grid-cols-3 min-[1380px]:grid-cols-4 min-[1720px]:grid-cols-5 gap-x-[clamp(40px,2vw,60px)] gap-y-12 auto-rows-min p-15 w-[95%] max-w-[1920px] align-items-start">
          {liveList ? (
            liveList.map(data => {
              const { broadcastId, broadcastTitle, camperId, profileImage, thumbnail } = data;
              return (
                <div key={broadcastId} className="flex justify-center">
                  <LiveCard
                    liveId={broadcastId}
                    title={broadcastTitle}
                    userId={camperId}
                    profileUrl={profileImage}
                    thumbnailUrl={thumbnail}
                  />
                </div>
              );
            })
          ) : (
            <div>방송 정보가 없습니다.</div>
          )}
        </div>
        <div ref={ref} className="h-1"></div>
      </div>
    </div>
  );
}

export default LiveList;
