import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUsers, getSession, setSession, clearSession } from '../services/localStorageService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getSession()?.user || null);
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    if (session?.user) {
      setCurrentUser(session.user);
    }
  }, []);

  const login = (email, password) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password); // Simplified auth
    if (user) {
      const { password, ...userWithoutPassword } = user; // Don't store password in session
      setCurrentUser(userWithoutPassword);
      setSession({ user: userWithoutPassword, token: `simulated-token-${user.id}` }); // Simulate token
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    clearSession();
    navigate('/login');
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};