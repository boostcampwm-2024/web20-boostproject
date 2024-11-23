import LiveCard from './LiveCard';
import { LivePreviewInfo } from '@/types/homeTypes';

function LiveList({ liveList }: { liveList: LivePreviewInfo[] }) {
  return (
    <div className="grid grid-cols-1 min-[690px]:grid-cols-2 min-[1040px]:grid-cols-3 min-[1380px]:grid-cols-4 min-[1720px]:grid-cols-5 gap-x-[clamp(40px,2vw,60px)] gap-y-12 auto-rows-min p-15 w-[95%] max-w-[1920px] align-items-start">
      {liveList &&
        liveList.map(livePreviewInfo => {
          const { broadcastId, broadcastTitle, camperId, profileImage, thumbnail } = livePreviewInfo;
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
        })}
    </div>
  );
}

export default LiveList;
