import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthValue = {
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);

  const value = useMemo<AuthValue>(
    () => ({
      signedIn,
      signIn: () => setSignedIn(true),
      signOut: () => setSignedIn(false),
    }),
    [signedIn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
}
