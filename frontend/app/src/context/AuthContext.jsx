import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = (u, t) => { setUser(u); setToken(t); };
  const logout = () => { setUser(null); setToken(null); };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
