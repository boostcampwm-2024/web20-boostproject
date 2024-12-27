import { Outlet } from 'react-router-dom';
import Header from '@components/Header';
import './App.css';
import { AuthProvider } from '@contexts/AuthContext';
import { Toaster } from '@components/ui/toaster';
import FloatingButton from '@components/FloatingButton';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Header />
        <main>
          <Outlet />
        </main>
        <Toaster />
        <FloatingButton />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
