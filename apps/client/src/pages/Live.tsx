import LivePlayer from '@components/LivePlayer';

export default function Live() {
  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col basis-3/4 gap-4 w-3/4 h-full px-3">
        <LivePlayer />
        <div className="bg-surface-alt flex-grow">방송자 정보 컴포넌트</div>
      </div>
      <div className="bg-surface-alt basis-1/4 h-0">채팅</div>
    </div>
  );
}
