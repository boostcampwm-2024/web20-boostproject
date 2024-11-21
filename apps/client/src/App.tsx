import { Outlet } from 'react-router-dom';
import Header from '@components/common/Header';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <main className="h-full">
        <Outlet />
      </main>
    </>
  );
}

export default App;
