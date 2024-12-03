import { Outlet } from 'react-router-dom';
import Header from '@components/Header';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
