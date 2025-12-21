import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types";

/**
 * Authentication context type definition
 * Provides user authentication state and methods throughout the app
 */
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component
 * Wraps the app and provides authentication context to all child components
 * Manages user state, token, and localStorage persistence
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load authentication state from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  /**
   * Login function
   * Authenticates user and stores token/user data in state and localStorage
   */
  const login = async (credentials: LoginRequest) => {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data: AuthResponse = await response.json();
    setUser(data.user);
    setToken(data.token);
    // Persist to localStorage for session persistence
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(data.user));
  };

  /**
   * Register function
   * Creates new user account and automatically logs them in
   */
  const register = async (credentials: RegisterRequest) => {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    const data: AuthResponse = await response.json();
    setUser(data.user);
    setToken(data.token);
    // Persist to localStorage for session persistence
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(data.user));
  };

  /**
   * Logout function
   * Clears user state and removes data from localStorage
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  /**
   * Delete account function
   * Permanently deletes user account and all associated data
   */
  const deleteAccount = async () => {
    if (!token) throw new Error("Not authenticated");

    const response = await fetch("http://localhost:3000/api/auth/me", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete account");
    }

    // Log out after successful deletion
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        deleteAccount,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth hook
 * Custom hook to access authentication context
 * Must be used within AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
