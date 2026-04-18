import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoding] = useState(false);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoding }}>
      {children}
    </AuthContext.Provider>
  );
};
