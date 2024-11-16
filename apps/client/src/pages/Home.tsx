import LiveList from '@/components/LiveList';

const liveInfos = [
  {
    broadcastId: 'cbf4b8de0ce38a7c8c8c37e4eda54889',
    broadcastTitle: '방송 제목 1',
    thumbnail: '/images/zoom_membership_bg.png',
    camperId: 'J001',
    profileImage: '/images/duck.png',
    field: 'WEB',
  },
  {
    broadcastId: 'cbf4b8de0ce38a7c8c8c37e4eda54889',
    broadcastTitle: '방송 제목 22',
    thumbnail: '/images/zoom_membership_bg.png',
    camperId: 'J225',
    profileImage: '/images/duck.png',
    field: 'WEB',
  },
  {
    broadcastId: 'cbf4b8de0ce38a7c8c8c37e4eda54889',
    broadcastTitle: '방송 제목 333',
    thumbnail: '/images/zoom_membership_bg.png',
    camperId: 'J389',
    profileImage: '/images/duck.png',
    field: 'AND',
  },
  {
    broadcastId: 'cbf4b8de0ce38a7c8c8c37e4eda54889',
    broadcastTitle: '방송 제목 4444',
    thumbnail: '/images/zoom_membership_bg.png',
    camperId: 'S486',
    profileImage: '/images/duck.png',
    field: 'IOS',
  },
  {
    broadcastId: 'cbf4b8de0ce38a7c8c8c37e4eda54889',
    broadcastTitle: '방송 제목 55555',
    thumbnail: '/images/zoom_membership_bg.png',
    camperId: 'J023',
    profileImage: '/images/duck.png',
    field: 'WEB',
  },
  {
    broadcastId: 'cbf4b8de0ce38a7c8c8c37e4eda54889',
    broadcastTitle: '방송 제목 666666',
    thumbnail: '/images/zoom_membership_bg.png',
    camperId: 'J126',
    profileImage: '/images/duck.png',
    field: 'WEB',
  },
  {
    broadcastId: 'cbf4b8de0ce38a7c8c8c37e4eda54889',
    broadcastTitle: '방송 제목 7777777',
    thumbnail: '/images/zoom_membership_bg.png',
    camperId: 'J219',
    profileImage: '/images/duck.png',
    field: 'WEB',
  },
  {
    broadcastId: 'cbf4b8de0ce38a7c8c8c37e4eda54889',
    broadcastTitle: '방송 제목 88888888',
    thumbnail: '/images/zoom_membership_bg.png',
    camperId: 'J273',
    profileImage: '/images/duck.png',
    field: 'IOS',
  },
  {
    broadcastId: 'cbf4b8de0ce38a7c8c8c37e4eda54889',
    broadcastTitle: '방송 제목 999999999',
    thumbnail: '/images/zoom_membership_bg.png',
    camperId: 'K101',
    profileImage: '/images/duck.png',
    field: 'AND',
  },
  {
    broadcastId: 'cbf4b8de0ce38a7c8c8c37e4eda54889',
    broadcastTitle: '방송 제목 테스트 123456789',
    thumbnail: '/images/zoom_membership_bg.png',
    camperId: 'S202',
    profileImage: '/images/duck.png',
    field: 'IOS',
  },
  {
    broadcastId: 'cbf4b8de0ce38a7c8c8c37e4eda54889',
    broadcastTitle: '방송 제목 테스트 123456789123456789',
    thumbnail: '/images/zoom_membership_bg.png',
    camperId: 'J299',
    profileImage: '/images/duck.png',
    field: 'WEB',
  },
];

export default function Home() {
  return (
    <div className="flex justify-center w-full">
      <LiveList liveInfos={liveInfos} />
    </div>
  );
}
