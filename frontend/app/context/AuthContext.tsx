"use client"; // Still keep this if using useState or useEffect

import { createContext, useContext, useEffect, useState } from 'react';
import http from '../utils/http'; // Reusable HTTP utility
import { storage } from '../utils/storage'; // Reusable localStorage utility
import { StorageKeys } from '../utils/storageKeys';
import { getUserFromToken } from '../utils/jwt';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
    position: string,
    department: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = storage.getItem(StorageKeys.TOKEN);
    console.log('token', token);
    if (token) {
      const user = getUserFromToken(token);
      setUser(user);
      setLoading(false); // Set loading to false once user is retrieved
    } else {
      if(window.location.pathname !== '/login' && window.location.pathname !== '/register'){
        window.location.href = '/login';
      }
      setLoading(false); // Set loading to false even if no token exists
    }
  }, []);

  

  const login = async (email: string, password: string) => {
    const data = await http.post('/auth/login', { email, password });
    const user = getUserFromToken(data.data.token);
    storage.setItem(StorageKeys.TOKEN, data.data.token);
    setUser(user);
    setLoading(false);
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    position: string,
    department: string
  ) => {
    // Send the registration request
    await http.post('/auth/register', {
      email,
      username,
      password,
      position,
      department,
    });
  };

  const logout = () => {
    storage.removeItem(StorageKeys.TOKEN);
    setUser(null);
    
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
