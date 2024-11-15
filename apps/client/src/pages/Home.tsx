import LiveCard from '@/components/LiveCard';

export default function Home() {
  const liveInfos = [
    {
      id: 1,
      title: '방송 제목1',
      userId: 'J999',
      profileUrl: '/images/duck.png',
      thumbnailUrl: '/images/zoom_membership_bg.png',
    },
    { id: 2, title: '방송 제목2222222222222222222222', userId: 'K888', profileUrl: '', thumbnailUrl: '' },
    { id: 3, title: '방송 제목3', userId: 'S777', profileUrl: '', thumbnailUrl: '' },
    { id: 4, title: '방송 제목4', userId: 'J666', profileUrl: '', thumbnailUrl: '' },
    { id: 5, title: '방송 제목5555555555555', userId: 'J555', profileUrl: '', thumbnailUrl: '' },
    { id: 6, title: '방송 제목6', userId: 'J444', profileUrl: '', thumbnailUrl: '' },
    { id: 7, title: '방송 제목7', userId: 'J333', profileUrl: '', thumbnailUrl: '' },
    { id: 8, title: '방송 제목8', userId: 'J222', profileUrl: '', thumbnailUrl: '' },
    { id: 9, title: '방송 제목9', userId: 'J111', profileUrl: '', thumbnailUrl: '' },
  ];
  return (
    <div className="flex flex-wrap p-8 gap-10">
      {liveInfos.map(liveInfo => (
        <LiveCard
          key={liveInfo.id}
          title={liveInfo.title}
          userId={liveInfo.userId}
          profileUrl={liveInfo.profileUrl}
          thumbnailUrl={liveInfo.thumbnailUrl}
        />
      ))}
    </div>
  );
}
