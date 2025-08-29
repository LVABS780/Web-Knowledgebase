"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { JwtPayload, UserType } from "@/types";

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserType | null;
  token: string | null;
  login: (token: string, user: UserType) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    router.replace("/login");
  };

  const login = (newToken: string, userData: UserType) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);

    try {
      const { exp } = jwtDecode<JwtPayload>(newToken);
      if (exp && exp * 1000 < Date.now()) logout();
    } catch (err) {
      console.log(err);
      logout();
    }

    router.replace("/dashboard");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
