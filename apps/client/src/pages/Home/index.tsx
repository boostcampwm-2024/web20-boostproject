import LiveList from '@pages/Home/LiveList';
import Banner from './Banner';
import Footer from '@components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col justify-center w-full h-full">
      <Banner />
      <LiveList />
      <Footer />
    </div>
  );
}
