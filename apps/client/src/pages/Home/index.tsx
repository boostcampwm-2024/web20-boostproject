import LiveList from '@pages/Home/LiveList';
import Banner from './Banner';

export default function Home() {
  return (
    <div className="flex flex-col justify-start w-full min-h-[calc(100vh-74px)]">
      <Banner />
      <LiveList />
    </div>
  );
}
