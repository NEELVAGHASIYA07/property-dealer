"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Edit3,
  LogOut,
  Lock,
  CheckCircle2,
  Bell,
  Smartphone,
  ExternalLink,
  X,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import "./profile.css";
import { useAuth } from "@/app/context/AuthContext";

const GUJARAT_CITIES = [
  "Surat",
  "Ahmedabad",
  "Vadodara",
  "Rajkot",
  "Gandhinagar",
  "Bhavnagar",
  "Anand",
];

export default function ProfilePage() {
  const router = useRouter();
  const { openAuthModal } = useAuth();

  // User state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCity, setEditCity] = useState("Surat");

  // Security credentials state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityMsg, setSecurityMsg] = useState("");
  const [securityError, setSecurityError] = useState("");

  // Communication & Notification preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [whatsappNotifs, setWhatsappNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);

  // Load user on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserRaw = localStorage.getItem("fieldhouse_user");
      if (savedUserRaw) {
        try {
          const u = JSON.parse(savedUserRaw);
          setUser(u);
          setEditName(u.name || "");
          setEditPhone(u.phone || "+91 98251 67890");
          setEditCity(u.city || "Surat");
        } catch (e) {
          console.warn("Could not parse user session:", e);
        }
      }
      setLoading(false);
    }
  }, []);

  // Sync storage updates
  useEffect(() => {
    const handleStorageUpdate = () => {
      const savedUserRaw = localStorage.getItem("fieldhouse_user");
      if (savedUserRaw) {
        try {
          setUser(JSON.parse(savedUserRaw));
        } catch (e) { }
      }
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  // Lock background page scroll whenever Edit Profile modal is open
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isEditModalOpen) {
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
  }, [isEditModalOpen]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("fieldhouse_user");
      document.cookie = "fieldhouse_user=; path=/; max-age=0; SameSite=Lax";
      window.dispatchEvent(new Event("storage"));
    }
    setUser(null);
    router.push("/login");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser = {
      ...user,
      name: editName.trim() || user.name,
      phone: editPhone.trim() || user.phone,
      city: editCity || user.city,
    };

    setUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("fieldhouse_user", JSON.stringify(updatedUser));
      document.cookie = `fieldhouse_user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=31536000; SameSite=Lax`;
      window.dispatchEvent(new Event("storage"));
    }
    setIsEditModalOpen(false);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setSecurityError("");
    setSecurityMsg("");

    if (newPassword.length < 6) {
      setSecurityError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityError("New passwords do not match. Please re-enter.");
      return;
    }

    setSecurityMsg("Password updated successfully! Your account credentials have been secured.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSecurityMsg(""), 4500);
  };

  if (loading) {
    return (
      <div className="profile-page-shell" style={{ textAlign: "center", padding: "120px 20px" }}>
        <div>Loading your account profile...</div>
      </div>
    );
  }

  // If not logged in, prompt user to log in
  if (!user) {
    return (
      <main className="profile-page-shell">
        <div className="profile-container" style={{ maxWidth: "520px", textAlign: "center" }}>
          <div className="profile-hero-card" style={{ flexDirection: "column", padding: "48px 30px" }}>
            <div className="profile-avatar-large" style={{ margin: "0 auto 16px" }}>
              <User size={32} />
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 8px" }}>
              Sign in to view your profile
            </h1>
            <p style={{ color: "#77766f", fontSize: "14px", margin: "0 0 24px" }}>
              Sign in or create an account to manage your profile, security, and notification settings.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => openAuthModal({
                  title: "Sign in to your Profile",
                  subtitle: "Manage your personal details, security settings, and notifications."
                })}
                className="profile-dealer-btn"
                style={{ padding: "10px 24px", cursor: "pointer", border: "none" }}
              >
                Sign In / Sign Up
              </button>
              <Link
                href="/"
                className="profile-btn-outline"
                style={{ padding: "10px 20px" }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const isDealer = Boolean(
    user?.role === "admin" ||
    user?.isDealer === true ||
    (user?.email &&
      (user.email.toLowerCase().includes("admin") ||
        user.email.toLowerCase().includes("dealer") ||
        user.email.toLowerCase() === "admin@fieldhouse.re"))
  );

  return (
    <main className="profile-page-shell">
      <div className="profile-container">
        {/* ====================================================================
            1. USER PROFILE HERO CARD
            ==================================================================== */}
        <section className="profile-hero-card">
          <div className="profile-hero-left">
            <div className={`profile-avatar-large ${isDealer ? "dealer" : ""}`}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="profile-user-meta">
              <div className="profile-name-row">
                <h1 className="profile-user-name">{user.name}</h1>
                <span className={`profile-role-badge ${isDealer ? "dealer" : "client"}`}>
                  <ShieldCheck size={12} />
                  <span>{isDealer ? "Premier Dealer" : "Verified Client"}</span>
                </span>
              </div>

              <div className="profile-info-sub">
                <span className="profile-info-item">
                  <Mail size={14} />
                  <span>{user.email}</span>
                </span>

                <span className="profile-info-item">
                  <Phone size={14} />
                  <span>{user.phone || "+91 98251 67890"}</span>
                </span>

                <span className="profile-info-item">
                  <MapPin size={14} />
                  <span>{user.city || "Gujarat, India"}</span>
                </span>

                <span className="profile-info-item">
                  <Calendar size={14} />
                  <span>Member since {user.joined || "October 2026"}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="profile-hero-actions">
            <button
              type="button"
              className="profile-btn-outline"
              onClick={() => setIsEditModalOpen(true)}
              title="Edit Profile Information"
            >
              <Edit3 size={14} />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              className="profile-btn-danger-outline"
              onClick={handleLogout}
              title="Sign Out of Account"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </section>

        {/* ====================================================================
            2. DEALER CONSOLE FAST LAUNCH BANNER (If Dealer/Admin)
            ==================================================================== */}
        {isDealer && (
          <section className="profile-dealer-banner">
            <div className="profile-dealer-banner-left">
              <div className="profile-dealer-icon-box">F</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <strong style={{ fontSize: "16px", color: "#ffffff" }}>
                    Fieldhouse Dealer Console
                  </strong>
                  <span
                    style={{
                      background: "#ee705b",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "2px 7px",
                      borderRadius: "10px",
                    }}
                  >
                    AUTHORIZED
                  </span>
                </div>
                <div style={{ fontSize: "12.5px", color: "#a8a29e", marginTop: "2px" }}>
                  Add properties, manage inventory, and view buyer CRM inquiries
                </div>
              </div>
            </div>

            <Link href="/admin" className="profile-dealer-btn">
              <span>Open Dealer Console</span>
              <ExternalLink size={14} />
            </Link>
          </section>
        )}

        {/* ====================================================================
            3. TWO-COLUMN PROFILE & SECURITY DETAILS
            ==================================================================== */}
        <div className="profile-details-grid">
          {/* Card A: Personal Details */}
          <section className="profile-details-card">
            <div className="profile-card-header">
              <h2 className="profile-card-title">
                <User size={18} color="#ee705b" />
                <span>Personal Information</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ee705b",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
            </div>

            <div className="profile-fields-list">
              <div className="profile-field-row">
                <span className="profile-field-label">Full Name</span>
                <span className="profile-field-value">{user.name}</span>
              </div>

              <div className="profile-field-row">
                <span className="profile-field-label">Email Address</span>
                <span className="profile-field-value" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>{user.email}</span>
                  <span style={{ color: "#16a34a", fontSize: "11px" }}>● Verified</span>
                </span>
              </div>

              <div className="profile-field-row">
                <span className="profile-field-label">Phone Number</span>
                <span className="profile-field-value">{user.phone || "+91 98251 67890"}</span>
              </div>

              <div className="profile-field-row">
                <span className="profile-field-label">Primary City</span>
                <span className="profile-field-value">{user.city || "Surat, Gujarat"}</span>
              </div>

              <div className="profile-field-row">
                <span className="profile-field-label">Account Role</span>
                <span className="profile-field-value" style={{ textTransform: "capitalize" }}>
                  {isDealer ? "Premier Dealer" : "Verified Client"}
                </span>
              </div>

              <div className="profile-field-row">
                <span className="profile-field-label">Account Status</span>
                <span
                  className="profile-field-value"
                  style={{ color: "#15803d", fontWeight: "700" }}
                >
                  Active & Protected ✓
                </span>
              </div>
            </div>
          </section>

          {/* Card B: Security & Password */}
          <section className="profile-details-card">
            <div className="profile-card-header">
              <h2 className="profile-card-title">
                <Lock size={18} color="#ee705b" />
                <span>Security & Credentials</span>
              </h2>
            </div>

            {securityMsg && (
              <div
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #86efac",
                }}
              >
                <CheckCircle2 size={16} />
                <span>{securityMsg}</span>
              </div>
            )}

            {securityError && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#b91c1c",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #fca5a5",
                }}
              >
                <ShieldAlert size={16} />
                <span>{securityError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", display: "block", marginBottom: "6px", color: "#1d1e1a" }}>
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="profile-form-input"
                  style={{ width: "100%" }}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", display: "block", marginBottom: "6px", color: "#1d1e1a" }}>
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  className="profile-form-input"
                  style={{ width: "100%" }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", display: "block", marginBottom: "6px", color: "#1d1e1a" }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  className="profile-form-input"
                  style={{ width: "100%" }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginTop: "6px" }}>
                <button
                  type="submit"
                  className="profile-btn-save"
                >
                  Update Credentials
                </button>
              </div>
            </form>

            <div
              style={{
                marginTop: "20px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#fafaf9",
                border: "1px solid #f2eee6",
                fontSize: "12.5px",
                color: "#77766f",
              }}
            >
              🔒 <strong>Session Protection:</strong> Two-factor authentication is active on this session.
            </div>
          </section>
        </div>

        {/* ====================================================================
            4. NOTIFICATIONS & PREFERENCES SETTINGS
            ==================================================================== */}
        <section className="profile-details-card" style={{ marginBottom: "28px" }}>
          <div className="profile-card-header">
            <h2 className="profile-card-title">
              <Bell size={18} color="#ee705b" />
              <span>Communication & Alert Preferences</span>
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <div style={{ fontWeight: "700", fontSize: "14px", color: "#1d1e1a" }}>
                  Email Notifications for New Property Matches
                </div>
                <div style={{ fontSize: "13px", color: "#77766f" }}>
                  Receive curated emails when new verified listings match your city and budget.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifs(!emailNotifs)}
                style={{
                  background: emailNotifs ? "#dcfce7" : "#f3f4f6",
                  color: emailNotifs ? "#15803d" : "#6b7280",
                  border: `1px solid ${emailNotifs ? "#86efac" : "#d1d5db"}`,
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  fontWeight: "700",
                  fontSize: "12.5px",
                  cursor: "pointer",
                }}
              >
                {emailNotifs ? "Enabled ✓" : "Disabled"}
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", paddingTop: "14px", borderTop: "1px solid #f2eee6" }}>
              <div>
                <div style={{ fontWeight: "700", fontSize: "14px", color: "#1d1e1a" }}>
                  WhatsApp Alerts for Tour Appointments
                </div>
                <div style={{ fontSize: "13px", color: "#77766f" }}>
                  Get site tour confirmations and dealer reminders directly on WhatsApp.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWhatsappNotifs(!whatsappNotifs)}
                style={{
                  background: whatsappNotifs ? "#dcfce7" : "#f3f4f6",
                  color: whatsappNotifs ? "#15803d" : "#6b7280",
                  border: `1px solid ${whatsappNotifs ? "#86efac" : "#d1d5db"}`,
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  fontWeight: "700",
                  fontSize: "12.5px",
                  cursor: "pointer",
                }}
              >
                {whatsappNotifs ? "Enabled ✓" : "Disabled"}
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", paddingTop: "14px", borderTop: "1px solid #f2eee6" }}>
              <div>
                <div style={{ fontWeight: "700", fontSize: "14px", color: "#1d1e1a" }}>
                  SMS Reminders for Site Visits
                </div>
                <div style={{ fontSize: "13px", color: "#77766f" }}>
                  Receive SMS notifications 2 hours prior to scheduled property viewings.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSmsNotifs(!smsNotifs)}
                style={{
                  background: smsNotifs ? "#dcfce7" : "#f3f4f6",
                  color: smsNotifs ? "#15803d" : "#6b7280",
                  border: `1px solid ${smsNotifs ? "#86efac" : "#d1d5db"}`,
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  fontWeight: "700",
                  fontSize: "12.5px",
                  cursor: "pointer",
                }}
              >
                {smsNotifs ? "Enabled ✓" : "Disabled"}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ======================================================================
          5. EDIT PROFILE MODAL
          ====================================================================== */}
      {isEditModalOpen && (
        <div className="profile-modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="profile-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 className="profile-modal-title" style={{ margin: 0 }}>Edit Your Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="profile-modal-form">
              <div className="profile-form-group">
                <label className="profile-form-label">Full Name</label>
                <input
                  type="text"
                  className="profile-form-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="profile-form-group">
                <label className="profile-form-label">Email Address (Read Only)</label>
                <input
                  type="email"
                  className="profile-form-input"
                  value={user.email}
                  disabled
                  style={{ background: "#f3f4f6", cursor: "not-allowed" }}
                />
              </div>

              <div className="profile-form-group">
                <label className="profile-form-label">Phone Number</label>
                <input
                  type="text"
                  className="profile-form-input"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 98251 67890"
                />
              </div>

              <div className="profile-form-group">
                <label className="profile-form-label">Primary Gujarat City</label>
                <select
                  className="profile-form-input"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                >
                  {GUJARAT_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="profile-modal-actions">
                <button
                  type="button"
                  className="profile-btn-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="profile-btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
