import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "email" | "google" | "apple";
  createdAt: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  login: (profile: Omit<UserProfile, "id" | "createdAt">) => Promise<void>;
  logout: () => Promise<void>;
}

const AUTH_KEY = "@ecolife_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(AUTH_KEY);
        if (raw) setUser(JSON.parse(raw));
      } catch (_) {}
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (profile: Omit<UserProfile, "id" | "createdAt">) => {
    const fullProfile: UserProfile = {
      ...profile,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setUser(fullProfile);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(fullProfile));
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
