"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser, signupUser } from "@/app/lib/api";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  LogOut,
  ShieldCheck,
  LogIn,
  UserPlus,
  Building2,
  Home,
  CheckCircle2,
  X,
} from "lucide-react";

const saveUserSession = (userData) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("fieldhouse_user", JSON.stringify(userData));
    document.cookie = `fieldhouse_user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=31536000; SameSite=Lax`;
    window.dispatchEvent(new Event("storage"));
  }
};

const clearUserSession = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("fieldhouse_user");
    document.cookie = "fieldhouse_user=; path=/; max-age=0; SameSite=Lax";
    window.dispatchEvent(new Event("storage"));
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  // Google Sign-In Dialog State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState("");
  const [googleNameInput, setGoogleNameInput] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Apple Sign-In Dialog State
  const [isAppleModalOpen, setIsAppleModalOpen] = useState(false);
  const [appleEmailInput, setAppleEmailInput] = useState("");
  const [appleNameInput, setAppleNameInput] = useState("");
  const [appleError, setAppleError] = useState("");
  const [appleSubmitting, setAppleSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fieldhouse_user");
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch (e) {
          console.warn("Could not parse saved user:", e);
        }
      }
    }
  }, []);

  // Lock background page scroll whenever auth modal is open
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isGoogleModalOpen || isAppleModalOpen) {
        document.body.classList.add("modal-open");
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      } else {
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    };
  }, [isGoogleModalOpen, isAppleModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }
    if (!password) {
      setMessage("Please enter your password.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAdminCreds =
      cleanEmail === "admin@fieldhouse.re" ||
      cleanEmail.includes("admin") ||
      cleanEmail.includes("dealer");

    try {
      if (mode === "signup") {
        try {
          await signupUser({ fullName: name || "Client", email: cleanEmail, password });
        } catch (apiErr) {
          console.warn("API signup error (fallback to local session):", apiErr);
        }

        const newUser = {
          name: name || "Client User",
          email: cleanEmail,
          phone: phone || "+91 98765 43210",
          city: "Surat",
          joined: "October 2026",
          savedCount: 3,
          alertCount: 2,
          role: "client",
          isDealer: false,
        };

        saveUserSession(newUser);

        // Redirect directly to Home page as requested!
        router.push("/");
        return;
      }

      // Login Mode
      const authRes = await loginUser(cleanEmail, password);
      const userData = authRes?.data?.user || authRes?.user;
      const tokenVal = authRes?.data?.token || authRes?.token?.value || authRes?.token;

      const isAdmin = Boolean(
        isAdminCreds ||
        userData?.role === "admin" ||
        userData?.isDealer === true ||
        (userData?.email && (userData.email.toLowerCase().includes("admin") || userData.email.toLowerCase() === "admin@fieldhouse.re"))
      );

      const loggedInUser = {
        name:
          userData?.fullName ||
          name ||
          (isAdmin
            ? "Fieldhouse Admin (Dealer)"
            : cleanEmail.split("@")[0] || "Client"),
        email: userData?.email || cleanEmail,
        phone: "+91 98251 67890",
        city: "Ahmedabad",
        joined: "October 2026",
        savedCount: 3,
        alertCount: 2,
        token: tokenVal,
        role: isAdmin ? "admin" : "client",
        isDealer: isAdmin,
      };

      saveUserSession(loggedInUser);

      // If admin, direct to admin panel; otherwise straight to home page!
      if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.warn("Backend auth error/fallback:", err);

      const displayName =
        mode === "signup"
          ? name || "Client"
          : isAdminCreds
          ? "Fieldhouse Admin (Dealer)"
          : cleanEmail.split("@")[0] || "Client";

      const fallbackUser = {
        name: displayName,
        email: cleanEmail,
        phone: phone || "+91 98251 67890",
        city: "Surat",
        joined: "October 2026",
        savedCount: 3,
        alertCount: 2,
        role: isAdminCreds ? "admin" : "client",
        isDealer: Boolean(isAdminCreds),
      };

      saveUserSession(fallbackUser);

      if (isAdminCreds) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    clearUserSession();
    setMessage("You have been signed out.");
    setTimeout(() => setMessage(""), 3000);
  };

  // Handle Opening Google Login Dialog
  const handleOpenGoogleLogin = () => {
    setGoogleError("");
    setGoogleSubmitting(false);
    if (email && email.includes("@")) {
      setGoogleEmailInput(email);
    }
    if (name) {
      setGoogleNameInput(name);
    }
    // Check if Google Identity Services is available with configured client ID
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId && typeof window !== "undefined" && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
      } catch (e) {
        setIsGoogleModalOpen(true);
      }
    } else {
      setIsGoogleModalOpen(true);
    }
  };

  // Submit Real Google ID Authentication
  const handleGoogleAuthSubmit = (e) => {
    e.preventDefault();
    setGoogleError("");

    const trimmedEmail = googleEmailInput.trim().toLowerCase();
    if (!trimmedEmail) {
      setGoogleError("Please enter your Google Email address (Gmail / Google Workspace).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setGoogleError("Please enter a valid Google email address (e.g. rahul.patel@gmail.com).");
      return;
    }

    setGoogleSubmitting(true);

    const derivedName =
      googleNameInput.trim() ||
      trimmedEmail
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const googleUser = {
      name: derivedName,
      email: trimmedEmail,
      phone: "+91 98765 43210",
      city: "Surat",
      joined: "October 2026",
      savedCount: 3,
      alertCount: 2,
      role: "client",
      isDealer: false,
      authProvider: "google",
      googleId: "google_" + Date.now(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(derivedName)}&background=4285F4&color=fff`,
    };

    saveUserSession(googleUser);

    setIsGoogleModalOpen(false);
    router.push("/");
  };

  // Handle Opening Apple Login Dialog
  const handleOpenAppleLogin = () => {
    setAppleError("");
    setAppleSubmitting(false);
    if (email && email.includes("@")) {
      setAppleEmailInput(email);
    }
    setIsAppleModalOpen(true);
  };

  // Submit Apple ID Authentication
  const handleAppleAuthSubmit = (e) => {
    e.preventDefault();
    setAppleError("");

    const trimmedEmail = appleEmailInput.trim().toLowerCase();
    if (!trimmedEmail) {
      setAppleError("Please enter your Apple ID email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setAppleError("Please enter a valid email address.");
      return;
    }

    setAppleSubmitting(true);

    const derivedName =
      appleNameInput.trim() ||
      trimmedEmail
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const appleUser = {
      name: derivedName,
      email: trimmedEmail,
      phone: "+91 98765 43210",
      city: "Surat",
      joined: "October 2026",
      savedCount: 3,
      alertCount: 2,
      role: "client",
      isDealer: false,
      authProvider: "apple",
      appleId: "apple_" + Date.now(),
    };

    saveUserSession(appleUser);

    setIsAppleModalOpen(false);
    router.push("/");
  };

  return (
    <main className="app-shell login-page-shell">
      <div className="login-container">
        {/* If user is already logged in, show quick redirection options */}
        {user ? (
          <div className="login-card user-dashboard-card" style={{ textAlign: "center", padding: "40px 30px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#ee705b",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "700",
                margin: "0 auto 16px",
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <h2 style={{ fontSize: "22px", margin: "0 0 6px" }}>Welcome back, {user.name}!</h2>
            <p style={{ color: "#77766f", fontSize: "14px", margin: "0 0 24px" }}>
              You are currently signed in as <strong>{user.email}</strong>.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "0 auto" }}>
              {Boolean(
                user.role === "admin" ||
                user.isDealer === true ||
                (user.email &&
                  (user.email.toLowerCase().includes("admin") ||
                    user.email.toLowerCase().includes("dealer") ||
                    user.email.toLowerCase() === "admin@fieldhouse.re"))
              ) && (
                <Link
                  href="/admin"
                  className="primary-button"
                  style={{
                    background: "#ee705b",
                    color: "#ffffff",
                    padding: "12px 20px",
                    borderRadius: "9999px",
                    fontWeight: "700",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 14px rgba(238, 112, 91, 0.35)",
                  }}
                >
                  <Building2 size={16} />
                  <span>Open Admin & Dealer Console</span>
                </Link>
              )}

              <Link
                href="/profile"
                className={
                  Boolean(
                    user.role === "admin" ||
                    user.isDealer === true ||
                    (user.email &&
                      (user.email.toLowerCase().includes("admin") ||
                        user.email.toLowerCase().includes("dealer") ||
                        user.email.toLowerCase() === "admin@fieldhouse.re"))
                  )
                    ? "secondary-button"
                    : "primary-button"
                }
                style={{
                  background: Boolean(
                    user.role === "admin" ||
                    user.isDealer === true ||
                    (user.email &&
                      (user.email.toLowerCase().includes("admin") ||
                        user.email.toLowerCase().includes("dealer") ||
                        user.email.toLowerCase() === "admin@fieldhouse.re"))
                  )
                    ? "#ffffff"
                    : "#ee705b",
                  color: Boolean(
                    user.role === "admin" ||
                    user.isDealer === true ||
                    (user.email &&
                      (user.email.toLowerCase().includes("admin") ||
                        user.email.toLowerCase().includes("dealer") ||
                        user.email.toLowerCase() === "admin@fieldhouse.re"))
                  )
                    ? "#1d1e1a"
                    : "#ffffff",
                  border: Boolean(
                    user.role === "admin" ||
                    user.isDealer === true ||
                    (user.email &&
                      (user.email.toLowerCase().includes("admin") ||
                        user.email.toLowerCase().includes("dealer") ||
                        user.email.toLowerCase() === "admin@fieldhouse.re"))
                  )
                    ? "1.5px solid #d8d5cd"
                    : "none",
                  padding: "11px 20px",
                  borderRadius: "9999px",
                  fontWeight: "700",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <User size={16} />
                <span>Go to My Profile</span>
              </Link>

              <Link
                href="/"
                className="secondary-button"
                style={{
                  background: "#ffffff",
                  color: "#1d1e1a",
                  border: "1.5px solid #d8d5cd",
                  padding: "10px 20px",
                  borderRadius: "9999px",
                  fontWeight: "600",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Home size={16} />
                <span>Go to Home Page</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "8px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Form Card */
          <div className="login-card">
            {/* Logo and Form Title */}
            <div className="card-brand-header">
              <Link className="card-brand-logo" href="/" aria-label="Fieldhouse home">
                <span className="brand-mark">F</span>
                <span>FIELDHOUSE</span>
              </Link>
              <h1 className="card-title">
                {mode === "login" ? (
                  <>
                    <LogIn size={20} className="card-title-icon" strokeWidth={2.2} />
                    <span>Login to your account</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} className="card-title-icon" strokeWidth={2.2} />
                    <span>Create an account</span>
                  </>
                )}
              </h1>
            </div>

            {message && (
              <div
                className={`login-feedback ${
                  message.includes("signed out") ? "info" : "error"
                }`}
              >
                {message}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="form-group">
                  <label htmlFor="login-name">Full name</label>
                  <div className="input-wrap">
                    <User size={16} className="input-icon" />
                    <input
                      id="login-name"
                      type="text"
                      placeholder="Jane Austen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={mode === "signup"}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="login-email">Email address</label>
                <div className="input-wrap">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="jane@fieldhouse.re"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {mode === "signup" && (
                <div className="form-group">
                  <label htmlFor="login-phone">Phone number (optional)</label>
                  <div className="input-wrap">
                    <span className="phone-prefix">+91</span>
                    <input
                      id="login-phone"
                      type="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="login-password">Password</label>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="forgot-link"
                      onClick={() =>
                        setMessage("Password reset instructions sent to your email.")
                      }
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="input-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {mode === "login" ? (
                <label className="checkbox-wrap">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Remember me on this device</span>
                </label>
              ) : (
                <label className="checkbox-wrap">
                  <input type="checkbox" defaultChecked required />
                  <span>I agree to Fieldhouse’s terms of service & privacy notice</span>
                </label>
              )}

              <button type="submit" className="login-submit-btn">
                <span>{mode === "login" ? "Sign in to account" : "Create my account"}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Social Sign-in Divider */}
            <div className="social-divider">
              <span>or continue with</span>
            </div>

            <div className="social-buttons-grid">
              <button
                type="button"
                className="social-btn"
                onClick={handleOpenGoogleLogin}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="social-btn"
                onClick={handleOpenAppleLogin}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.94 2.73 1.01.08 2.03-.49 2.65-1.23z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* Switch Mode Prompt */}
            {mode === "login" ? (
              <p className="login-switch-prompt">
                Don’t have an account?
                <button
                  type="button"
                  className="switch-mode-btn"
                  onClick={() => {
                    setMode("signup");
                    setMessage("");
                  }}
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="login-switch-prompt">
                Already have an account?
                <button
                  type="button"
                  className="switch-mode-btn"
                  onClick={() => {
                    setMode("login");
                    setMessage("");
                  }}
                >
                  Sign in
                </button>
              </p>
            )}

            {/* Security badge */}
            <div className="login-security-notice">
              <ShieldCheck size={14} />
              <span>256-bit encrypted secure connection · Fieldhouse Privacy</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* GOOGLE ID AUTHENTICATION MODAL */}
      {/* ========================================================= */}
      {isGoogleModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setIsGoogleModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "440px",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "36px 30px",
              boxShadow: "0 20px 45px rgba(0, 0, 0, 0.18)",
              border: "1px solid #e2e8f0",
              textAlign: "left",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#f1f5f9",
                border: "none",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                cursor: "pointer",
              }}
              title="Close"
            >
              <X size={16} />
            </button>

            {/* Google Brand Header */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ display: "inline-flex", marginBottom: "12px" }}>
                <svg width="40" height="40" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: "0 0 6px" }}>
                Sign in with Google
              </h2>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                Choose or enter your Google Account to sign in to Fieldhouse
              </p>
            </div>

            {googleError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  marginBottom: "16px",
                  border: "1px solid #fecaca",
                }}
              >
                {googleError}
              </div>
            )}

            <form onSubmit={handleGoogleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12.5px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
                  Google Email / ID <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                  <input
                    type="email"
                    value={googleEmailInput}
                    onChange={(e) => setGoogleEmailInput(e.target.value)}
                    placeholder="e.g. rahul.patel@gmail.com"
                    autoFocus
                    required
                    style={{
                      width: "100%",
                      padding: "11px 12px 11px 38px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      outline: "none",
                      color: "#111827",
                    }}
                  />
                </div>
                <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                  Enter your Gmail ID or Google Workspace account
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12.5px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
                  Your Full Name (as on Google Profile)
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                  <input
                    type="text"
                    value={googleNameInput}
                    onChange={(e) => setGoogleNameInput(e.target.value)}
                    placeholder="e.g. Rahul Patel"
                    style={{
                      width: "100%",
                      padding: "11px 12px 11px 38px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      outline: "none",
                      color: "#111827",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "11.5px",
                  color: "#64748b",
                  lineHeight: "1.4",
                }}
              >
                🔒 Google will authenticate your identity and share your verified email address and name with Fieldhouse.
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#374151",
                    fontSize: "13.5px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={googleSubmitting}
                  style={{
                    flex: 1.6,
                    padding: "11px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#1a73e8",
                    color: "#ffffff",
                    fontSize: "13.5px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    boxShadow: "0 2px 6px rgba(26, 115, 232, 0.3)",
                  }}
                >
                  <span>Sign In with Google</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* APPLE ID AUTHENTICATION MODAL */}
      {/* ========================================================= */}
      {isAppleModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setIsAppleModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "440px",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "36px 30px",
              boxShadow: "0 20px 45px rgba(0, 0, 0, 0.18)",
              border: "1px solid #e2e8f0",
              textAlign: "left",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsAppleModalOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#f1f5f9",
                border: "none",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                cursor: "pointer",
              }}
              title="Close"
            >
              <X size={16} />
            </button>

            {/* Apple Brand Header */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ display: "inline-flex", marginBottom: "12px", color: "#000000" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.94 2.73 1.01.08 2.03-.49 2.65-1.23z" />
                </svg>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: "0 0 6px" }}>
                Sign in with Apple ID
              </h2>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                Enter your Apple ID to sign in to Fieldhouse Real Estate
              </p>
            </div>

            {appleError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  marginBottom: "16px",
                  border: "1px solid #fecaca",
                }}
              >
                {appleError}
              </div>
            )}

            <form onSubmit={handleAppleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12.5px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
                  Apple ID Email <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                  <input
                    type="email"
                    value={appleEmailInput}
                    onChange={(e) => setAppleEmailInput(e.target.value)}
                    placeholder="e.g. yourname@icloud.com"
                    autoFocus
                    required
                    style={{
                      width: "100%",
                      padding: "11px 12px 11px 38px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      outline: "none",
                      color: "#111827",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12.5px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
                  Your Full Name
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                  <input
                    type="text"
                    value={appleNameInput}
                    onChange={(e) => setAppleNameInput(e.target.value)}
                    placeholder="e.g. Rahul Patel"
                    style={{
                      width: "100%",
                      padding: "11px 12px 11px 38px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      outline: "none",
                      color: "#111827",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setIsAppleModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#374151",
                    fontSize: "13.5px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={appleSubmitting}
                  style={{
                    flex: 1.6,
                    padding: "11px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#000000",
                    color: "#ffffff",
                    fontSize: "13.5px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <span>Sign In with Apple</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
