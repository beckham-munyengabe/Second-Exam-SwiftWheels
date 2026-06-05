import { createContext, useContext, useEffect, useState } from "react";
const Ctx = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    setLoading(false);
  }, []);
  const login = (token, u) => {
    localStorage.setItem("token", token); localStorage.setItem("user", JSON.stringify(u)); setUser(u);
  };
  const logout = () => { localStorage.clear(); setUser(null); };
  return <Ctx.Provider value={{ user, login, logout, loading }}>{children}</Ctx.Provider>;
};
export const useAuth = () => useContext(Ctx);
