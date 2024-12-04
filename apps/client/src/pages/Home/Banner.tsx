import MoveCharacter from '@/components/Icons/MoveCharacter';
import Bookmark from './Bookmark';

function Banner() {
  return (
    <div className="flex w-full h-96 bg-gradient-to-r from-surface-alt to-transparent">
      <div className="flex flex-row justify-between w-full h-96 p-5">
        <div className="font-bold text-4xl text-text-strong flex flex-row items-center ml-16 gap-12">
          <MoveCharacter />
          <div className="flex flex-col gap-3 animate-fade-in">
            <p>출석부 관리부터, 소통까지!</p>
            <p>
              부담 없이 함께하는 <span className="text-text-point">네부캠 전용</span> 온라인 캠퍼스
            </p>
          </div>
        </div>
        <Bookmark />
      </div>
    </div>
  );
}

export default Banner;
