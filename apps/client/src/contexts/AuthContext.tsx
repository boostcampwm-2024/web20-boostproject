import React, { createContext, useState } from 'react';

interface AuthContextInterface {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialState = {
  isLoggedIn: !!localStorage.getItem('accessToken'),
  setIsLoggedIn: () => {},
};

export const AuthContext = createContext<AuthContextInterface>(initialState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('accessToken'));
  return <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</AuthContext.Provider>;
}
