"use client";

import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";

export default function Providers({ children, initialUser = null }) {
  return (
    <AuthProvider initialUser={initialUser}>
      {children}
      <AuthModal />
    </AuthProvider>
  );
}
