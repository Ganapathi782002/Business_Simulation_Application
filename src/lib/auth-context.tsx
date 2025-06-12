"use client";

import { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/me');
        
        if (response.ok) {
          const data: { user: User } = await response.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user session", err);
        setError("Could not fetch user session.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed.', error);
    } finally {
      window.location.href = '/';
    }
  };
  
  const value = {
    user,
    loading,
    error,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}