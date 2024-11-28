import { Outlet } from 'react-router-dom';
import Header from '@components/Header';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Header />
      <main className="h-full">
        <Outlet />
      </main>
    </AuthProvider>
  );
}

export default App;
