"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Heart,
  MapPin,
  Trash2,
  Search,
  ArrowLeft,
  ExternalLink,
  RotateCcw,
  X,
} from "lucide-react";
import {
  getSavedPropertiesList,
  fetchSavedPropertiesList,
  toggleSaveProperty,
} from "@/app/lib/savedHomes";
import { useAuth } from "@/app/context/AuthContext";
import "@/app/profile/profile.css";

export default function SavedHomesPage() {
  const { user, openAuthModal } = useAuth();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [undoToast, setUndoToast] = useState(null);
  const undoTimerRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    const loadHomes = async () => {
      // 1. Instant synchronous load from local cache
      const local = getSavedPropertiesList();
      if (!isCancelled) {
        setSavedProperties(local);
        if (local.length > 0) setLoading(false);
      }

      // 2. Asynchronously resolve any database properties
      try {
        const full = await fetchSavedPropertiesList();
        if (!isCancelled && full) {
          setSavedProperties(full);
        }
      } catch (e) {
        console.warn("Could not load full saved properties:", e);
      }

      if (!isCancelled) setLoading(false);
    };

    loadHomes();

    const handleSavedUpdate = () => {
      loadHomes();
    };

    window.addEventListener("storage", handleSavedUpdate);
    window.addEventListener("saved_homes_updated", handleSavedUpdate);
    return () => {
      isCancelled = true;
      window.removeEventListener("storage", handleSavedUpdate);
      window.removeEventListener("saved_homes_updated", handleSavedUpdate);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  const handleRemoveSavedProperty = (prop) => {
    if (!prop) return;

    // Find index to restore to exact position if undone
    const currentIdx = savedProperties.findIndex((p) => String(p.id) === String(prop.id));

    // Clear any previous undo countdown
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
    }

    // Instantly remove from storage and UI
    toggleSaveProperty(prop.id);
    setSavedProperties((prev) => prev.filter((p) => String(p.id) !== String(prop.id)));

    // Set floating Undo Toast with 5-second lifespan
    setUndoToast({
      property: prop,
      index: currentIdx >= 0 ? currentIdx : 0,
    });

    undoTimerRef.current = setTimeout(() => {
      setUndoToast(null);
    }, 5000);
  };

  const handleUndoRemove = () => {
    if (!undoToast) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);

    const { property, index } = undoToast;

    // Re-save property in storage
    toggleSaveProperty(property);

    // Re-insert into state list
    setSavedProperties((prev) => {
      const next = [...prev];
      const insertAt = Math.min(index, next.length);
      next.splice(insertAt, 0, property);
      return next;
    });

    setUndoToast(null);
  };

  const handleDismissUndo = () => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoToast(null);
  };

  if (!user) {
    return (
      <main className="profile-page-shell">
        <div className="profile-container" style={{ maxWidth: "520px", textAlign: "center", margin: "40px auto" }}>
          <div className="profile-hero-card" style={{ flexDirection: "column", padding: "48px 30px" }}>
            <div className="profile-avatar-large" style={{ margin: "0 auto 16px", background: "#fee2e2", color: "#ee705b" }}>
              <Heart size={30} fill="#ee705b" />
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 8px" }}>
              Sign in to view your Saved Homes
            </h1>
            <p style={{ color: "#77766f", fontSize: "14px", margin: "0 0 24px" }}>
              Bookmark and track your favorite luxury properties across Gujarat. Sign in to access your saved homes list.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => openAuthModal({
                  title: "Sign in to access Saved Homes",
                  subtitle: "View, organize, and manage your shortlisted properties."
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
                  background: "#fee2e2",
                  color: "#ee705b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Heart size={22} fill="#ee705b" />
              </div>
              <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1d1e1a", margin: 0 }}>
                Saved Homes
              </h1>
              <span
                style={{
                  background: "#fee2e2",
                  color: "#ee705b",
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "3px 10px",
                  borderRadius: "20px",
                }}
              >
                {savedProperties.length} Homes
              </span>
            </div>
            <p style={{ margin: "6px 0 0", color: "#77766f", fontSize: "14px" }}>
              Your curated list of luxury villas, apartments, and penthouses across Gujarat.
            </p>
          </div>

          <Link
            href="/buy"
            className="profile-dealer-btn"
            style={{ textDecoration: "none" }}
          >
            <Search size={15} />
            <span>Explore More Homes</span>
          </Link>
        </div>

        {/* Saved Properties Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>Loading saved homes...</div>
        ) : savedProperties.length === 0 ? (
          <div className="saved-homes-empty">
            <div className="saved-homes-empty-icon">
              <Heart size={28} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 6px" }}>
              No saved homes yet
            </h3>
            <p style={{ color: "#77766f", fontSize: "14px", margin: "0 0 20px", maxWidth: "420px", marginLeft: "auto", marginRight: "auto" }}>
              Click the heart icon on any property in Buy, Rent, or Short-Term listings to save your favorite residences here.
            </p>
            <Link
              href="/buy"
              className="profile-dealer-btn"
              style={{ textDecoration: "none", display: "inline-flex" }}
            >
              <Search size={15} />
              <span>Browse Properties for Sale</span>
            </Link>
          </div>
        ) : (
          <div className="saved-homes-grid">
            {savedProperties.map((prop) => (
              <article key={prop.id} className="saved-home-card">
                <div className="saved-home-img-wrap">
                  <img
                    src={prop.image}
                    alt={prop.name}
                    className="saved-home-img"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    className="saved-home-remove-btn"
                    onClick={() => handleRemoveSavedProperty(prop)}
                    title="Remove from saved homes"
                    aria-label="Remove property"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="saved-home-body">
                  <div className="saved-home-price">{prop.priceLabel}</div>
                  <h4 className="saved-home-title">{prop.name}</h4>
                  <div className="saved-home-location">
                    <MapPin size={14} color="#ee705b" />
                    <span>{prop.area}, {prop.city}</span>
                  </div>

                  <div className="saved-home-specs">
                    <span>{prop.bedrooms} BHK</span>
                    <span>•</span>
                    <span>{prop.bathrooms} Baths</span>
                    <span>•</span>
                    <span>{prop.size} sq.ft</span>
                  </div>

                  <div className="saved-home-actions">
                    <Link
                      href={`/property/${prop.id}`}
                      className="saved-home-view-btn"
                    >
                      View Full Details ↗
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Floating Undo Toast Notification */}
        {undoToast && (
          <div className="saved-homes-undo-toast" role="alert">
            <div className="undo-toast-progress-bar" />
            <span className="undo-toast-text">
              Removed &ldquo;{undoToast.property.name}&rdquo; from Saved Homes
            </span>
            <button
              type="button"
              className="undo-toast-btn"
              onClick={handleUndoRemove}
              title="Undo deletion"
            >
              <RotateCcw size={13} strokeWidth={2.4} />
              <span>Undo</span>
            </button>
            <button
              type="button"
              className="undo-toast-close"
              onClick={handleDismissUndo}
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
