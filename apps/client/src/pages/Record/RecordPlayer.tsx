import LoadingCharacter from '@/components/LoadingCharacter';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

interface RecordPlayerProps {
  video: string;
}

function RecordPlayer(props: RecordPlayerProps) {
  const [isSelectedVideo, setIsSelectedVideo] = useState(false);

  useEffect(() => {
    if (props.video) {
      setIsSelectedVideo(true);
    }
  }, [props.video]);

  return (
    <div className="h-4/5 w-full">
      {isSelectedVideo ? (
        <div className="h-full w-full">
          <ReactPlayer
            url={props.video}
            playing
            controls
            width="100%"
            height="100%"
            fallback={
              <div className="flex justify-center items-center h-full w-full">
                <LoadingCharacter size={400} />
              </div>
            }
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-full w-full">오른쪽 목록에서 비디오를 선택해주세요</div>
      )}
    </div>
  );
}

export default RecordPlayer;
