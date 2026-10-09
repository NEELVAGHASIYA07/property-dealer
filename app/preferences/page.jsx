"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  MapPin,
  Building2,
  Bell,
  ArrowLeft,
  CheckCircle2,
  Mail,
  Smartphone,
} from "lucide-react";
import "@/app/profile/profile.css";
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

export default function PreferencesPage() {
  const { user, openAuthModal } = useAuth();
  const [prefCity, setPrefCity] = useState("Surat");
  const [prefType, setPrefType] = useState("All");
  const [prefBudget, setPrefBudget] = useState("1 Cr – 2.5 Cr");
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    if (user?.city) {
      setPrefCity(user.city);
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg("Search alerts and home preferences saved successfully!");
    setTimeout(() => setSavedMsg(""), 3500);
  };

  if (!user) {
    return (
      <main className="profile-page-shell">
        <div className="profile-container" style={{ maxWidth: "520px", textAlign: "center", margin: "40px auto" }}>
          <div className="profile-hero-card" style={{ flexDirection: "column", padding: "48px 30px" }}>
            <div className="profile-avatar-large" style={{ margin: "0 auto 16px", background: "#fef3c7", color: "#b45309" }}>
              <SlidersHorizontal size={28} />
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 8px" }}>
              Sign in to manage Preferences
            </h1>
            <p style={{ color: "#77766f", fontSize: "14px", margin: "0 0 24px" }}>
              Configure custom search filters, price drop alerts, and instant WhatsApp notifications for new luxury listings.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => openAuthModal({
                  title: "Sign in to set Search Alerts",
                  subtitle: "Customize your dream home criteria and notification alerts."
                })}
                className="profile-dealer-btn"
                style={{ padding: "10px 24px", cursor: "pointer", border: "none" }}
              >
                Sign In / Sign Up
              </button>
              <Link
                href="/buy"
                className="profile-btn-outline"
                style={{ padding: "10px 20px" }}
              >
                Explore Properties
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page-shell">
      <div className="profile-container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "20px" }}>
          <Link
            href="/profile"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#77766f",
              textDecoration: "none",
              fontSize: "13.5px",
              fontWeight: "600",
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to My Profile</span>
          </Link>
        </div>

        {/* Page Header */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid rgba(29, 30, 26, 0.08)",
            borderRadius: "18px",
            padding: "26px 30px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "#fef3c7",
                  color: "#b45309",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SlidersHorizontal size={22} />
              </div>
              <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1d1e1a", margin: 0 }}>
                Search Alerts & Preferences
              </h1>
            </div>
            <p style={{ margin: "6px 0 0", color: "#77766f", fontSize: "14px" }}>
              Set your target criteria across Gujarat to receive instant alerts when matching homes arrive on the market.
            </p>
          </div>
        </div>

        {savedMsg && (
          <div
            style={{
              background: "#dcfce7",
              color: "#15803d",
              padding: "12px 18px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "700",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #86efac",
            }}
          >
            <CheckCircle2 size={18} />
            <span>{savedMsg}</span>
          </div>
        )}

        {/* Preferences Form Grid */}
        <form onSubmit={handleSave}>
          <div className="preferences-grid" style={{ marginBottom: "24px" }}>
            <div className="pref-box">
              <label className="pref-label">
                <MapPin size={16} color="#ee705b" />
                <span>Preferred Gujarat City</span>
              </label>
              <select
                className="pref-select"
                value={prefCity}
                onChange={(e) => setPrefCity(e.target.value)}
              >
                {GUJARAT_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="pref-box">
              <label className="pref-label">
                <Building2 size={16} color="#ee705b" />
                <span>Preferred Property Type</span>
              </label>
              <select
                className="pref-select"
                value={prefType}
                onChange={(e) => setPrefType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Villa">Luxury Villa</option>
                <option value="Apartment">Apartment / Flat</option>
                <option value="Penthouse">Sky Penthouse</option>
                <option value="Bungalow">Independent Bungalow</option>
              </select>
            </div>

            <div className="pref-box">
              <label className="pref-label">
                <SlidersHorizontal size={16} color="#ee705b" />
                <span>Target Budget Range</span>
              </label>
              <select
                className="pref-select"
                value={prefBudget}
                onChange={(e) => setPrefBudget(e.target.value)}
              >
                <option value="Under 50 Lakh">Under ₹50 Lakh</option>
                <option value="50 Lakh – 1 Cr">₹50 Lakh – ₹1 Crore</option>
                <option value="1 Cr – 2.5 Cr">₹1 Crore – ₹2.5 Crore</option>
                <option value="2.5 Cr – 5 Cr">₹2.5 Crore – ₹5 Crore</option>
                <option value="5 Cr+">₹5 Crore+</option>
              </select>
            </div>

            {/* Instant Alerts Card */}
            <div className="pref-box" style={{ gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f2eee6" }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Bell size={16} color="#ee705b" />
                    <span>Instant Email Notifications for New Properties</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#77766f", marginTop: "3px" }}>
                    Get alerted the moment a villa or flat matching your criteria is listed by a verified dealer.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  style={{
                    background: alertsEnabled ? "#dcfce7" : "#f3f4f6",
                    color: alertsEnabled ? "#15803d" : "#6b7280",
                    border: `1px solid ${alertsEnabled ? "#86efac" : "#d1d5db"}`,
                    padding: "6px 16px",
                    borderRadius: "9999px",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  {alertsEnabled ? "Enabled ✓" : "Disabled"}
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Smartphone size={16} color="#16a34a" />
                    <span>WhatsApp Tour Reminders & Price Drops</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#77766f", marginTop: "3px" }}>
                    Direct WhatsApp notifications for tour schedules, site visit updates, and dealer responses.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setWhatsappAlerts(!whatsappAlerts)}
                  style={{
                    background: whatsappAlerts ? "#dcfce7" : "#f3f4f6",
                    color: whatsappAlerts ? "#15803d" : "#6b7280",
                    border: `1px solid ${whatsappAlerts ? "#86efac" : "#d1d5db"}`,
                    padding: "6px 16px",
                    borderRadius: "9999px",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  {whatsappAlerts ? "Enabled ✓" : "Disabled"}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="profile-dealer-btn"
            style={{ border: "none", cursor: "pointer", fontSize: "14px", padding: "12px 28px" }}
          >
            Save Alerts & Preferences
          </button>
        </form>
      </div>
    </main>
  );
}
