import { LivePreviewInfo } from '@/types/homeTypes';
import LiveCard from './LiveCard';

function LiveList({ liveList }: { liveList: LivePreviewInfo[] }) {
  return (
    <div className="grid grid-cols-1 min-[690px]:grid-cols-2 min-[1040px]:grid-cols-3 min-[1380px]:grid-cols-4 min-[1720px]:grid-cols-5 gap-[clamp(40px,2vw,60px)] p-15 w-[95%] max-w-[1920px] place-items-center">
      {liveList &&
        liveList.map(livePreviewInfo => {
          const { broadcastId, broadcastTitle, camperId, profileImage, thumbnail } = livePreviewInfo;
          return (
            <LiveCard
              key={broadcastId}
              liveId={broadcastId}
              title={broadcastTitle}
              userId={camperId}
              profileUrl={profileImage}
              thumbnailUrl={thumbnail}
            />
          );
        })}
    </div>
  );
}

export default LiveList;
