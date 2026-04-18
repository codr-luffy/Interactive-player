import { login, register, getMe, logout } from "../services/auth.api.js";
import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { useEffect } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoding } = context;

  async function handleRegister({ username, email, password }) {
    setLoding(true);
    const data = await register({ username, email, password });
    setUser(data.user);
    setLoding(false);
  }

  async function handleLogin({ username, email, password }) {
    setLoding(true);
    const data = await login({ username, email, password });
    setUser(data.user);
    setLoding(false);
  }

  async function handleGetMe() {
    setLoding(true);
    const data = await getMe();
    setUser(data.user);
    setLoding(false);
  }

  async function handleLogout() {
    setLoding(true);
    const data = await logout();
    setUser(null);
    setLoding(false);
  }

  useEffect(() => {
    handleGetMe();
  }, []);

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
  };
};
