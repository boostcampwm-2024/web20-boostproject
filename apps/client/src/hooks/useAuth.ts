import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('accessToken') ? true : false);
  const navigate = useNavigate();

  const requestLogIn = (provider: 'github' | 'google') => {
    window.location.href = `${import.meta.env.VITE_API_SERVER_URL}/v1/auth/signin/${provider}`;
  };

  const setLogIn = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    setIsLoggedIn(true);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);

  return { isLoggedIn, requestLogIn, setLogIn, logout };
};
