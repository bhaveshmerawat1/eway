"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface User {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  onLoginSuccess: (cb: () => void) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginCallbacks, setLoginCallbacks] = useState<(() => void)[]>([]); 

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  async function refreshUser() {
    setLoading(true)
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user || null);
      setLoading(false)
    } catch {
      setLoading(false)
      setUser(null);
    }
  }

  async function signup(email: string, password: string) {
    setLoading(true)
    try {
      await api.post("/auth/signup", { email, password });
      await refreshUser();
      loginCallbacks.forEach(cb => cb()); // trigger reloads
    } catch (err: any) {
      setLoading(false)
      console.error("Signup failed", err.response?.data || err.message);
      throw err;
    }
  }

  async function login(email: string, password: string) {
    setLoading(true)
    try {
      await api.post("/auth/login", { email, password });
      await refreshUser();
      loginCallbacks.forEach(cb => cb()); // trigger reloads
    } catch (err: any) {
      setLoading(false)
      console.error("Login failed", err.response?.data || err.message);
      throw err;
    }
  }

  async function logout() {
    setLoading(true)
    try {
      await api.post("/auth/logout");
      setUser(null);
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      console.error("Logout failed", err.response?.data || err.message);
    }
  }

  const onLoginSuccess = useCallback((cb: () => void) => {
    setLoginCallbacks(prev => [...prev, cb]);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signup,
        login,
        logout,
        refreshUser,
        onLoginSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
