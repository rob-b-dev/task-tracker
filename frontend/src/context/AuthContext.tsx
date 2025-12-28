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
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount by calling /me endpoint
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/me", {
          credentials: "include", // Include cookies in request
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Auth check failed:", error);
        // Don't clear user on network errors, only on explicit auth failures
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Login function
   * Authenticates user and receives user data (token stored in HTTP-only cookie)
   */
  const login = async (credentials: LoginRequest) => {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies in request
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data: AuthResponse = await response.json();
    setUser(data.user);
  };

  /**
   * Register function
   * Creates new user account and automatically logs them in (token stored in HTTP-only cookie)
   */
  const register = async (credentials: RegisterRequest) => {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies in request
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    const data: AuthResponse = await response.json();
    setUser(data.user);
  };

  /**
   * Logout function
   * Clears user state (cookie cleared by setting maxAge to 0)
   */
  const logout = () => {
    setUser(null);
    // Clear the cookie by making a request or setting it to expire
    fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(console.error);
  };

  /**
   * Delete account function
   * Permanently deletes user account and all associated data
   */
  const deleteAccount = async () => {
    const response = await fetch("http://localhost:3000/api/auth/me", {
      method: "DELETE",
      credentials: "include", // Include cookies in request
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
        isAuthenticated: !!user,
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
