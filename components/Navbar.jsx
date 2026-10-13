"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
import { useAuth } from "@/context/AuthContext";

const syncUserCookie = (u) => {
  if (typeof document !== "undefined") {
    if (u) {
      document.cookie = `fieldhouse_user=${encodeURIComponent(JSON.stringify(u))}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      document.cookie = "fieldhouse_user=; path=/; max-age=0; SameSite=Lax";
    }
  }
};

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Buy", href: "/buy" },
  { label: "Rent", href: "/rent" },
  { label: "Short-term", href: "/short-term" },
  { label: "Journal", href: "/blog" },
];

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
      } catch (e) {}
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
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navCapsuleRef = useRef(null);
  const itemRefs = useRef({});

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const isAdminRoute = pathname?.startsWith("/admin");

  // Determine current active navigation item
  const currentItem = useMemo(() => {
    if (!pathname) return NAV_ITEMS[0];
    if (pathname === "/") return NAV_ITEMS[0];
    return NAV_ITEMS.slice(1).find((item) => pathname.startsWith(item.href)) || null;
  }, [pathname]);

  // Measure and align sliding indicator pill
  const updateIndicator = useCallback(() => {
    if (!currentItem || !navCapsuleRef.current) {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const targetEl = itemRefs.current[currentItem.href];
    const containerEl = navCapsuleRef.current;
    if (targetEl && containerEl) {
      const containerRect = containerEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      setIndicatorStyle({
        left: targetRect.left - containerRect.left,
        width: targetRect.width,
        opacity: 1,
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [currentItem]);

  useEffect(() => {
    updateIndicator();
    const raf = requestAnimationFrame(updateIndicator);
    const timer = setTimeout(updateIndicator, 60);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [updateIndicator]);

  useEffect(() => {
    const handleResize = () => updateIndicator();
    window.addEventListener("resize", handleResize);
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateIndicator);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, [updateIndicator]);

  // Track window scroll for subtle elevation and backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync user state from localStorage and cookie
  const loadUser = useCallback(() => {
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
  }, []);

  useEffect(() => {
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, [pathname, loadUser]);

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
    return pathname?.startsWith(path);
  };

  // Remove consumer navbar completely on admin route
  if (isAdminRoute) {
    return null;
  }

  return (
    <nav className={`topbar${isScrolled ? " scrolled" : ""}`}>
      {/* ── LEFT COLUMN: Brand Logo ────────────────────────── */}
      <div className="nav-brand-col">
        <Link className="brand" href="/" onClick={() => setIsMobileMenuOpen(false)}>
          <span className="brand-mark">F</span>
          <span className="brand-name">FIELDHOUSE</span>
        </Link>
      </div>

      {/* ── CENTER COLUMN: Premium Luxury Capsule Navigation ── */}
      <div className="nav-capsule-col">
        <div className="nav-capsule" ref={navCapsuleRef} role="navigation" aria-label="Main navigation">
          {/* Animated Sliding Pill Indicator */}
          <span
            className="nav-capsule-indicator"
            style={{
              transform: `translateX(${indicatorStyle.left}px)`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity,
            }}
            aria-hidden="true"
          />

          {NAV_ITEMS.map(({ label, href }) => {
            const active = currentItem?.href === href;
            return (
              <Link
                key={href}
                ref={(el) => {
                  if (el) itemRefs.current[href] = el;
                }}
                href={href}
                className={`nav-capsule-link${active ? " current" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT COLUMN: Luxury Profile Capsule & Mobile Toggle ── */}
      <div className="nav-actions-col">
        <div className="nav-actions-wrap" suppressHydrationWarning>
          {user ? (
            <div className="account-dropdown-wrap" ref={dropdownRef} suppressHydrationWarning>
              <button
                type="button"
                className={`account-button${isDropdownOpen ? " is-open" : ""}${isCurrent("/profile") || isCurrent("/login") || isCurrent("/admin") ? " active" : ""}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                id="nav-my-account"
                aria-label="My account"
                aria-expanded={isDropdownOpen}
                suppressHydrationWarning
              >
                <div className={`account-btn-avatar ${isDealer ? "dealer" : ""}`}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="account-btn-label">
                  {user.name ? user.name.split(" ")[0].toUpperCase() : "ACCOUNT"}
                </span>
                <ChevronDown
                  size={13}
                  className={`account-btn-chevron${isDropdownOpen ? " rotated" : ""}`}
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
              className="account-button unauth"
              onClick={() => openAuthModal({
                title: "Welcome to Fieldhouse",
                subtitle: "Sign in or create an account to access exclusive Gujarat luxury listings."
              })}
              id="nav-my-account"
              aria-label="My account"
            >
              <div className="account-btn-avatar">
                <User size={13} strokeWidth={2.4} style={{ color: "#ee705b" }} />
              </div>
              <span className="account-btn-label">SIGN IN</span>
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
                    background: isDealer ? "#ee705b" : "#24231F",
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
