import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

const login = async (email, password) => {
  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    const userData = res.data.data;

    setUser(userData);

    toast.success("Login successful");

    return {
      success: true,
      user: userData, 
    };
  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
    return false;
  }
};

 
  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const userData = res.data.data;

      setUser(userData);

      toast.success("Account created");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Register failed");
      return false;
    }
  };


  const logout = async () => {
    try {
      await api.post("/auth/logout");

      setUser(null);

      toast.success("Logged out");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);