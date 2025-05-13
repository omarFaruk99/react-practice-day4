import React, { createContext, ReactNode, useContext, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
  isAdmin: () => boolean;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Static admin user data
const ADMIN_USER: User = {
  id: 1,
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
};

// Initialize users in localStorage if not exists
const initializeUsers = () => {
  const users = localStorage.getItem("users");
  if (!users) {
    const initialUsers = [ADMIN_USER];
    localStorage.setItem("users", JSON.stringify(initialUsers));

    // Store admin password separately
    localStorage.setItem("adminPassword", btoa("Admin123"));
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize users when the provider mounts
  React.useEffect(() => {
    initializeUsers();
  }, []);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const isAdmin = () => {
    return currentUser?.role === "admin";
  };

  const getAllUsers = () => {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, logout, isAdmin, getAllUsers }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
