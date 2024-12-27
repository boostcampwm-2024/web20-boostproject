import { ThemeContext } from '@/contexts/ThemeContext';
import { useContext, useLayoutEffect } from 'react';

export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  useLayoutEffect(() => {
    if (theme === 'dark') {
      localStorage.setItem('theme', 'dark');
      document.querySelector('html')?.removeAttribute('data-theme');
    } else {
      localStorage.setItem('theme', 'light');
      document.querySelector('html')?.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  const convertTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return { theme, convertTheme };
};
