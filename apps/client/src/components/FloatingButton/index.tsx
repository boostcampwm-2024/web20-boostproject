import { Button } from '@components/ui/button';
import { ThemeIcon } from '@components/Icons';
import { useLayoutEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function FloatingButton() {
  const [theme, setTheme] = useState<Theme>('dark');

  useLayoutEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
      setTheme('light');
    }
  }, []);

  const hanldeClick = () => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
      document.querySelector('html')?.removeAttribute('data-theme');
    } else {
      setTheme('light');
      localStorage.setItem('theme', 'light');
      document.querySelector('html')?.setAttribute('data-theme', 'light');
    }
  };

  return (
    <div className="fixed bottom-3 right-5">
      <Button
        onClick={hanldeClick}
        className="h-10 w-10 rounded rounded-circle p-0 bg-surface-brand-default hover:bg-surface-brand-alt"
      >
        <ThemeIcon size={48} />
      </Button>
    </div>
  );
}

export default FloatingButton;
