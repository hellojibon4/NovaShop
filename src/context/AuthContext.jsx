import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  onAuthChange
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    // Initial check and listener subscription
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  };

  const register = async (email, password, userName, phone) => {
    const res = await registerUser(email, password, userName, phone);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    const res = await logoutUser();
    if (res.success) {
      setCurrentUser(null);
    }
    return res;
  };

  const updateUser = async (data) => {
    if (!currentUser) return { success: false, error: 'Not logged in' };
    const res = await updateUserProfile(currentUser.uid, data);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    setAuthModalTab
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
