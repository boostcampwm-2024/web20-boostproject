import { useNavigate } from 'react-router-dom';

interface LiveCardProps {
  liveId: string;
  title: string;
  userId: string;
  profileUrl?: string;
  thumbnailUrl: string;
}

const LiveCard = ({ liveId, title, userId, profileUrl, thumbnailUrl }: LiveCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/live/${liveId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-[300px] h-[225px] relative overflow-hidden group cursor-pointer rounded-xl transition-all duration-300 ease-in-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-[1.02] bg-surface-alt"
    >
      {/* 썸네일 */}
      <div className="w-full aspect-video rounded-xl bg-[#161817]">
        {thumbnailUrl && <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover " />}
      </div>

      {/* LIVE 뱃지 */}
      <div className="absolute top-3 left-3 bg-surface-danger text-text-strong text-display-medium12 px-2 py-0.5 rounded-sm flex items-center">
        <div className="w-2 h-2 rounded-circle bg-white mr-1 animate-pulse" />
        LIVE
      </div>

      {/* 방송 정보 */}
      <div className="absolute bottom-0 w-full h-14 p-2 flex items-center gap-2">
        <div className="w-10 h-10 rounded-circle bg-surface-alt border border-border-default flex-shrink-0 overflow-hidden">
          {profileUrl && <img src={profileUrl} alt={userId} className="w-full h-full object-cover" />}
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="text-text-strong font-medium text-display-medium16 truncate">{title}</h3>
          <p className="text-text-default text-display-medium12 truncate">{userId}</p>
        </div>
      </div>
    </div>
  );
};

export default LiveCard;
