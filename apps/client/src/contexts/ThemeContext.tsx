import { createContext, useState } from 'react';

type Theme = 'light' | 'dark' | null;

interface ThemeContextInterface {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const currentTheme = localStorage.getItem('theme') ?? null;

export const ThemeContext = createContext<ThemeContextInterface>({
  theme: currentTheme as Theme,
  setTheme: () => null,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) ?? null);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
