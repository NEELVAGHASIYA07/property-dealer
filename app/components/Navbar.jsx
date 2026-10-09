"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  Heart,
  CalendarDays,
  SlidersHorizontal,
  Building2,
  Users,
  Layers,
  ExternalLink,
  Menu,
  X,
  Home,
  Key,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const syncUserCookie = (u) => {
  if (typeof document !== "undefined") {
    if (u) {
      document.cookie = `fieldhouse_user=${encodeURIComponent(JSON.stringify(u))}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      document.cookie = "fieldhouse_user=; path=/; max-age=0; SameSite=Lax";
    }
  }
};

export default function Navbar({ initialUser = null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { openAuthModal } = useAuth();

  const [user, setUser] = useState(() => {
    if (initialUser) return initialUser;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("fieldhouse_user");
        if (saved) return JSON.parse(saved);
      } catch (e) { }
    }
    return null;
  });

  const [isDealer, setIsDealer] = useState(() => {
    const init = initialUser || (typeof window !== "undefined" ? (() => {
      try {
        const s = localStorage.getItem("fieldhouse_user");
        return s ? JSON.parse(s) : null;
      } catch (e) { return null; }
    })() : null);

    return Boolean(
      init?.role === "admin" ||
      init?.isDealer === true ||
      (init?.email && (init.email.toLowerCase().includes("admin") || init.email.toLowerCase().includes("dealer") || init.email.toLowerCase() === "admin@fieldhouse.re"))
    );
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminTab, setAdminTab] = useState("properties");
  const dropdownRef = useRef(null);

  const isAdminRoute = pathname?.startsWith("/admin");

  // Sync user state from localStorage and cookie
  const loadUser = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fieldhouse_user");
      if (saved) {
        try {
          const u = JSON.parse(saved);
          setUser(u);
          syncUserCookie(u);
          const hasAdmin =
            u?.role === "admin" ||
            u?.isDealer === true ||
            (u?.email &&
              (u.email.toLowerCase().includes("admin") ||
                u.email.toLowerCase().includes("dealer") ||
                u.email.toLowerCase() === "admin@fieldhouse.re"));
          setIsDealer(Boolean(hasAdmin));
          return;
        } catch (e) {
          console.warn("Error parsing user session in navbar:", e);
        }
      }
      setUser(null);
      setIsDealer(false);
      syncUserCookie(null);
    }
  };

  useEffect(() => {
    loadUser();

    // Listen for storage events (login / logout across tabs / components)
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, [pathname]);

  // Close mobile menu and dropdown on page route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Listen for admin tab active broadcasts from the admin page
  useEffect(() => {
    const handleTabActive = (e) => {
      if (e.detail) setAdminTab(e.detail);
    };
    window.addEventListener("fieldhouse_admin_tab_active", handleTabActive);
    return () => window.removeEventListener("fieldhouse_admin_tab_active", handleTabActive);
  }, []);

  // Sync admin tab on mount from URL
  useEffect(() => {
    if (typeof window !== "undefined" && isAdminRoute) {
      const p = new URLSearchParams(window.location.search);
      const t = p.get("tab");
      if (t) setAdminTab(t);
    }
  }, [isAdminRoute]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("fieldhouse_user");
      syncUserCookie(null);
      window.dispatchEvent(new Event("storage"));
    }
    setUser(null);
    setIsDealer(false);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/login");
  };

  const isCurrent = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // Remove consumer navbar completely on admin route as requested
  if (isAdminRoute) {
    return null;
  }

  // =========================================================================
  // PUBLIC CONSUMER NAVBAR (Home, Buy, Rent, Short-term, Journal)
  // =========================================================================
  return (
    <nav className="topbar">
      {/* Brand Logo */}
      <Link className="brand" href="/" onClick={() => setIsMobileMenuOpen(false)}>
        <span className="brand-mark">F</span>
        <span className="brand-name">FIELDHOUSE</span>
      </Link>

      {/* Main Navigation Links (Desktop: >= 1024px; Tablet: >= 768px) */}
      <div className="nav-links">
        <Link className={isCurrent("/") ? "current" : ""} href="/">
          Home
        </Link>
        <Link className={isCurrent("/buy") ? "current" : ""} href="/buy">
          Buy
        </Link>
        <Link className={isCurrent("/rent") ? "current" : ""} href="/rent">
          Rent
        </Link>
        <Link className={isCurrent("/short-term") ? "current" : ""} href="/short-term">
          Short-term
        </Link>
        <Link className={isCurrent("/blog") ? "current" : ""} href="/blog">
          Journal
        </Link>
      </div>

      {/* Right Corner: Clean Account Button & Hamburger */}
      <div className="nav-actions-wrap" suppressHydrationWarning>
        {user ? (
          <div className="account-dropdown-wrap" ref={dropdownRef} suppressHydrationWarning>
            <button
              type="button"
              className={`account-button${isCurrent("/profile") || isCurrent("/login") || isCurrent("/admin") ? " active" : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              id="nav-my-account"
              aria-label="My account"
              aria-expanded={isDropdownOpen}
              suppressHydrationWarning
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: isDealer ? "#ee705b" : "#1d1e1a",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "800",
                  flexShrink: 0,
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="account-btn-label">{user.name ? user.name.split(" ")[0] : "Account"}</span>
              <ChevronDown
                size={13}
                style={{
                  transform: isDropdownOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {isDropdownOpen && (
              <div className="account-dropdown-menu">
                {/* Header with Avatar & Details */}
                <div className="account-dropdown-header">
                  <div className={`account-dropdown-avatar ${isDealer ? "dealer" : ""}`}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="account-dropdown-meta">
                    <div className="account-dropdown-name">{user?.name || "Account User"}</div>
                    <div className="account-dropdown-email">{user?.email}</div>
                    <span className={`account-dropdown-role-badge ${isDealer ? "admin" : "client"}`}>
                      <ShieldCheck size={11} />
                      <span>{isDealer ? "Verified Dealer" : "Verified Client"}</span>
                    </span>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="account-dropdown-links">
                  {isDealer && (
                    <Link
                      href="/admin"
                      className="account-dropdown-item featured"
                      onClick={() => setIsDropdownOpen(false)}
                      style={{
                        background: "rgba(238, 112, 91, 0.08)",
                        color: "#ee705b",
                        fontWeight: "700",
                      }}
                    >
                      <LayoutDashboard size={15} />
                      <span>Admin & Dealer Console</span>
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    className="account-dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User size={15} />
                    <span>My Account Profile</span>
                  </Link>

                  <Link
                    href="/saved-homes"
                    className="account-dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Heart size={15} />
                    <span>Saved Homes</span>
                  </Link>

                  <Link
                    href="/inquiries"
                    className="account-dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <CalendarDays size={15} />
                    <span>My Inquiries & Tours</span>
                  </Link>

                  <Link
                    href="/preferences"
                    className="account-dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <SlidersHorizontal size={15} />
                    <span>Search Alerts & Preferences</span>
                  </Link>
                </div>

                {/* Sign Out Button */}
                <button
                  type="button"
                  className="account-dropdown-logout-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="account-button"
            onClick={() => openAuthModal({
              title: "Welcome to Fieldhouse",
              subtitle: "Sign in or create an account to access exclusive Gujarat luxury listings."
            })}
            id="nav-my-account"
            aria-label="My account"
          >
            <User size={15} strokeWidth={2.2} />
            <span className="account-btn-label">My account</span>
          </button>
        )}

        {/* Responsive Mobile Menu Toggle Button */}
        <button
          type="button"
          className="mobile-nav-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          id="nav-mobile-hamburger"
        >
          {isMobileMenuOpen ? <X size={20} strokeWidth={2.2} /> : <Menu size={20} strokeWidth={2.2} />}
        </button>
      </div>

      {/* Mobile Navigation Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Mobile Navigation Drawer */}
      <div
        className={`mobile-nav-drawer ${isMobileMenuOpen ? "open" : ""}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mobile-nav-header">
          <Link className="brand" href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="brand-mark">F</span>
            <span className="brand-name">FIELDHOUSE</span>
          </Link>
          <button
            type="button"
            className="mobile-nav-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mobile-nav-body">
          <div className="mobile-nav-section-title">Navigation</div>
          <div className="mobile-nav-links">
            <Link
              className={`mobile-nav-link ${isCurrent("/") ? "active" : ""}`}
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={18} />
              <span>Home</span>
              {isCurrent("/") && <span className="mobile-nav-active-dot" />}
            </Link>
            <Link
              className={`mobile-nav-link ${isCurrent("/buy") ? "active" : ""}`}
              href="/buy"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Building2 size={18} />
              <span>Buy</span>
              {isCurrent("/buy") && <span className="mobile-nav-active-dot" />}
            </Link>
            <Link
              className={`mobile-nav-link ${isCurrent("/rent") ? "active" : ""}`}
              href="/rent"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Key size={18} />
              <span>Rent</span>
              {isCurrent("/rent") && <span className="mobile-nav-active-dot" />}
            </Link>
            <Link
              className={`mobile-nav-link ${isCurrent("/short-term") ? "active" : ""}`}
              href="/short-term"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Sparkles size={18} />
              <span>Short-term</span>
              {isCurrent("/short-term") && <span className="mobile-nav-active-dot" />}
            </Link>
            <Link
              className={`mobile-nav-link ${isCurrent("/blog") ? "active" : ""}`}
              href="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen size={18} />
              <span>Journal</span>
              {isCurrent("/blog") && <span className="mobile-nav-active-dot" />}
            </Link>
          </div>

          <div className="mobile-nav-divider" />

          <div className="mobile-nav-section-title">Account & Services</div>
          {user ? (
            <div className="mobile-nav-user-section">
              <div className="mobile-nav-user-badge">
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: isDealer ? "#ee705b" : "#1d1e1a",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "800",
                    flexShrink: 0,
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="mobile-nav-user-info">
                  <div className="mobile-nav-user-name">{user.name || "Account User"}</div>
                  <div className="mobile-nav-user-email">{user.email}</div>
                  <span className={`mobile-nav-role-badge ${isDealer ? "admin" : "client"}`}>
                    <ShieldCheck size={11} />
                    <span>{isDealer ? "Verified Dealer" : "Verified Client"}</span>
                  </span>
                </div>
              </div>

              <div className="mobile-nav-user-links">
                {isDealer && (
                  <Link
                    href="/admin"
                    className="mobile-nav-sublink featured"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    <span>Admin & Dealer Console</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="mobile-nav-sublink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={16} />
                  <span>My Account Profile</span>
                </Link>
                <Link
                  href="/saved-homes"
                  className="mobile-nav-sublink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart size={16} />
                  <span>Saved Homes</span>
                </Link>
                <Link
                  href="/inquiries"
                  className="mobile-nav-sublink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CalendarDays size={16} />
                  <span>My Inquiries & Tours</span>
                </Link>
                <Link
                  href="/preferences"
                  className="mobile-nav-sublink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <SlidersHorizontal size={16} />
                  <span>Search Alerts</span>
                </Link>
                <button
                  type="button"
                  className="mobile-nav-logout-btn"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mobile-nav-guest-section">
              <button
                type="button"
                className="mobile-nav-login-btn"
                style={{ width: "100%", border: "none", cursor: "pointer" }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal({
                    title: "Welcome to Fieldhouse",
                    subtitle: "Sign in or create an account to access exclusive Gujarat luxury listings."
                  });
                }}
              >
                <User size={16} />
                <span>Sign In / My Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
