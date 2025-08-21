"use client";

import type { ReactNode } from "react";
import { createContext, useState, useMemo } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    // In a real app, this would involve a call to an authentication service
    setUser({ name: "Demo User", email: "user@example.com" });
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
