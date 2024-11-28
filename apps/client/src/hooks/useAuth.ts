import { AuthContext } from '@contexts/AuthContext';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);

  const requestLogIn = (provider: 'github' | 'google') => {
    window.location.href = `${import.meta.env.VITE_API_SERVER_URL}/v1/auth/signin/${provider}`;
  };

  const setLogIn = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
  }, []);

  return { requestLogIn, setLogIn, logout };
};
