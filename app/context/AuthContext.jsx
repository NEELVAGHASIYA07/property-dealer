"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(() => {
    if (initialUser) return initialUser;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("fieldhouse_user");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn("Could not parse initial user session:", e);
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({
    title: "Sign in to continue",
    subtitle: "Access verified properties, direct dealer inquiries, and saved favorites.",
    onSuccess: null,
    initialMode: "login", // 'login' | 'signup'
  });

  // Sync user state with localStorage and cookie
  const syncUserSession = useCallback((userData) => {
    if (typeof window !== "undefined") {
      if (userData) {
        localStorage.setItem("fieldhouse_user", JSON.stringify(userData));
        document.cookie = `fieldhouse_user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=31536000; SameSite=Lax`;
      } else {
        localStorage.removeItem("fieldhouse_user");
        document.cookie = "fieldhouse_user=; path=/; max-age=0; SameSite=Lax";
      }
      window.dispatchEvent(new Event("storage"));
    }
    setUser(userData);
  }, []);

  // Sync when storage event fires (e.g. login from another tab or legacy login page)
  useEffect(() => {
    const handleStorage = () => {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("fieldhouse_user");
          setUser(saved ? JSON.parse(saved) : null);
        } catch (e) {}
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Open Auth Modal with custom title, subtitle, and callback
  const openAuthModal = useCallback(({
    title = "Sign in to continue",
    subtitle = "Access verified properties, direct dealer inquiries, and saved favorites.",
    onSuccess = null,
    initialMode = "login",
  } = {}) => {
    setAuthModalConfig({
      title,
      subtitle,
      onSuccess,
      initialMode,
    });
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Require authentication for an action:
  // If user is logged in -> runs action immediately.
  // If not -> opens AuthModal and executes action upon successful login.
  const requireAuth = useCallback((actionCallback, {
    title = "Sign in required",
    subtitle = "Please sign in or create an account to access this feature.",
    initialMode = "login",
  } = {}) => {
    if (user) {
      if (typeof actionCallback === "function") {
        actionCallback(user);
      }
      return true;
    }

    openAuthModal({
      title,
      subtitle,
      initialMode,
      onSuccess: () => {
        if (typeof actionCallback === "function") {
          // Pass the updated user from localStorage
          try {
            const raw = localStorage.getItem("fieldhouse_user");
            const freshUser = raw ? JSON.parse(raw) : null;
            actionCallback(freshUser);
          } catch (e) {
            actionCallback();
          }
        }
      },
    });
    return false;
  }, [user, openAuthModal]);

  // Login handler
  const login = useCallback((userData) => {
    syncUserSession(userData);
    setIsAuthModalOpen(false);
    if (typeof authModalConfig.onSuccess === "function") {
      setTimeout(() => {
        try {
          authModalConfig.onSuccess(userData);
        } catch (err) {
          console.warn("Error running auth modal success callback:", err);
        }
      }, 100);
    }
  }, [syncUserSession, authModalConfig]);

  // Logout handler
  const logout = useCallback(() => {
    syncUserSession(null);
  }, [syncUserSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        isAuthModalOpen,
        authModalConfig,
        openAuthModal,
        closeAuthModal,
        requireAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
