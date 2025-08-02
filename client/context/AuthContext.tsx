"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  authAPI,
} from "@/lib/api";
import { sessionUtils, SessionData } from "@/lib/session";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper functions for session management
  const saveSession = (token: string, user: User) => {
    sessionUtils.saveSession(token, user);
  };

  const loadSession = (): SessionData | null => {
    return sessionUtils.loadSession();
  };

  const clearSession = () => {
    sessionUtils.clearSession();
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = loadSession();
        if (session) {
          // Set user immediately from session for better UX
          setUser(session.user);

          // Verify session is still valid by calling the server
          try {
            const currentUser = await authAPI.getCurrentUser();
            // Update session with fresh user data
            saveSession(session.token, currentUser);
            setUser(currentUser);
          } catch (error) {
            console.error("Session validation failed:", error);
            // If session validation fails, try to refresh the token
            try {
              const response = await authAPI.refreshToken();
              saveSession(response.token, response.user);
              setUser(response.user);
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              clearSession();
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        clearSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response: AuthResponse = await authAPI.login(data);
      saveSession(response.token, response.user);
      setUser(response.user);
    } catch (error) {
      console.error("Login failed:", error);
      // Re-throw the error with the proper message
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Login failed");
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response: AuthResponse = await authAPI.register(data);
      saveSession(response.token, response.user);
      setUser(response.user);
    } catch (error) {
      console.error("Registration failed:", error);
      // Re-throw the error with the proper message
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Registration failed");
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      clearSession();
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
