"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Simple auth context for demo purposes
// In production, you would use BetterAuth or NextAuth

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo admin credentials (hardcoded for exam demo)
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Check localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Login function
  const login = (email: string, password: string): boolean => {
    // Check hardcoded credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const newUser = { name: "Admin", email: ADMIN_EMAIL };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

