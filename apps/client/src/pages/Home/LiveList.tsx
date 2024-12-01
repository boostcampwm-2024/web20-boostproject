import FieldFilter from './FieldFilter';
import LiveCard from './LiveCard';
import { LivePreviewInfo } from '@/types/homeTypes';
import { useState } from 'react';
import axiosInstance from '@services/axios';
import Search from './Search';
import { Field } from '@/types/liveTypes';

function LiveList() {
  const [liveList, setLiveList] = useState<LivePreviewInfo[]>([]);

  const handleFilterField = (field: Field) => {
    axiosInstance.get('/v1/broadcasts', { params: { field: field } }).then(response => {
      if (response.data.success) {
        setLiveList(response.data.data.broadcasts);
      }
    });
  };

  const handleSearch = (keyword: string) => {
    axiosInstance.get('v1/broadcasts/search', { params: { keyword: keyword.trim() } }).then(response => {
      if (response.data.success) {
        setLiveList(response.data.data);
      }
    });
  };

  return (
    <div className="flex flex-col w-full h-full p-10">
      <div className="h-14 w-full flex justify-between items-center my-5 px-5">
        <FieldFilter onClickFieldButton={handleFilterField} />
        <Search onSearch={handleSearch} />
      </div>
      <div className="grid grid-cols-1 min-[690px]:grid-cols-2 min-[1040px]:grid-cols-3 min-[1380px]:grid-cols-4 min-[1720px]:grid-cols-5 gap-x-[clamp(40px,2vw,60px)] gap-y-12 auto-rows-min p-15 w-[95%] max-w-[1920px] align-items-start">
        {liveList ? (
          liveList.map(data => {
            const { broadcastId, broadcastTitle, camperId, profileImage, thumbnail } = data;
            console.log(data);
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
    </div>
  );
}

export default LiveList;
