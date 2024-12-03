import LiveList from '@pages/Home/LiveList';
import Banner from './Banner';
import Footer from '@components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col justify-between w-full min-h-[calc(100vh-74px)]">
      <div>
        <Banner />
        <LiveList />
      </div>
      <Footer />
    </div>
  );
}
