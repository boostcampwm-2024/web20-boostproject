import LiveCard from './LiveCard';

interface LiveInfo {
  broadcastId: string;
  broadcastTitle: string;
  thumbnail: string;
  camperId: string;
  profileImage: string;
  field: string;
}

function LiveList({ liveInfos }: { liveInfos: LiveInfo[] }) {
  return (
    <div className="grid grid-cols-1 min-[690px]:grid-cols-2 min-[1040px]:grid-cols-3 min-[1380px]:grid-cols-4 min-[1720px]:grid-cols-5 gap-[clamp(40px,2vw,60px)] p-15 w-[95%] max-w-[1920px] place-items-center">
      {liveInfos.map(liveInfo => (
        <LiveCard
          key={liveInfo.broadcastId}
          title={liveInfo.broadcastTitle}
          userId={liveInfo.camperId}
          profileUrl={liveInfo.profileImage}
          thumbnailUrl={liveInfo.thumbnail}
        />
      ))}
    </div>
  );
}

export default LiveList;