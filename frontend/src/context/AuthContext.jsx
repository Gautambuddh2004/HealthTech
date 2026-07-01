import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const ADMIN_EMAILS = [
  "guptagautambuddh@gmail.com"
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // ✅ Sirf ek baar
  const login = (userData, newToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', newToken);
    setUser(userData);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const isAdmin = user ? ADMIN_EMAILS.includes(user.email) : false;

  return (
    // ✅ isAdmin bhi pass kiya
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};