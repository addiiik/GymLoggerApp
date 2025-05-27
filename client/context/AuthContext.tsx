import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useSessionStore } from '@/stores/useSessionStore';
import { useUserStore } from '@/stores/useUserStore';
import { API_URL } from "@/constants/Api";

type AuthContextType = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    const loadTokenAndUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');

        if (storedToken) {
          const decoded: any = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;

          if (decoded.exp && decoded.exp > currentTime) {
            setToken(storedToken);
            
            const response = await fetch(`${API_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });

            if (!response.ok) throw new Error('Failed to fetch user');
            
            const userData = await response.json();
            setUser(userData);

            const sessionRes = await fetch(`${API_URL}/fetch/sessions`, {
              headers: { Authorization: `Bearer ${storedToken}` },
            });

            const sessionData = await sessionRes.json();
            if (!sessionRes.ok) throw new Error(sessionData.message || 'Failed to fetch sessions');
            useSessionStore.getState().setSessions(sessionData);
            
          } else {
            await logout();
          }
        }
      } catch (error) {
        await logout();
      }
    };

    loadTokenAndUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    await AsyncStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);

    const sessionRes = await fetch(`${API_URL}/fetch/sessions`, {
      headers: { Authorization: `Bearer ${data.token}` },
    });

    const sessionData = await sessionRes.json();
    if (!sessionRes.ok) throw new Error(sessionData.message || 'Failed to fetch sessions');
    useSessionStore.getState().setSessions(sessionData);
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    
    await login(email, password);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    clearUser();
    useSessionStore.getState().clearSessions();
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};