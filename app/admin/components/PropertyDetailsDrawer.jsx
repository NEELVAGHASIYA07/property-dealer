"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  MapPin,
  ExternalLink,
  Edit3,
  Building2,
  Home,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Layers,
  Phone,
  MessageSquare,
  Sparkles,
  Compass,
  FileText,
  Clock,
  ChevronRight,
  Maximize2,
  Share2,
} from "lucide-react";
import {
  resolvePropertyCoordinates,
  getGoogleMapsPinUrl,
  getGoogleMapsEmbedUrl,
  getGujaratPincode,
} from "@/app/lib/geocoding";
import { getDealerForProperty, VERIFIED_DEALERS } from "@/app/lib/dealers";
import { FALLBACK_PROPERTIES } from "@/app/lib/propertiesData";
import "./PropertyDetailsDrawer.css";

function formatCurrency(val) {
  if (!val) return "₹0";
  const num = Number(val);
  if (isNaN(num)) return String(val);
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2).replace(/\.00$/, "")} Lac`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function PropertyDetailsDrawer({
  property,
  onClose,
  onEdit,
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (property) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [property]);

  if (!property) return null;

  // Enrich property data using Fallback or heuristics
  const fallback =
    FALLBACK_PROPERTIES.find(
      (p) =>
        String(p.id) === String(property.id) ||
        p.name?.toLowerCase() === property.name?.toLowerCase()
    ) || null;

  const city = property.city || fallback?.city || "Surat";
  const area =
    property.area ||
    fallback?.area ||
    (property.location ? property.location.split(",")[0].trim() : "Vesu");
  const district = property.district || property.city || fallback?.city || "Surat";
  const pincode =
    property.pincode && property.pincode !== "395007"
      ? property.pincode
      : fallback?.pincode || getGujaratPincode(area, city) || "395007";
  const streetAddress =
    property.streetAddress ||
    property.address ||
    fallback?.streetAddress ||
    `${area}, Near VIP Road, ${city}`;

  const society =
    property.society ||
    property.project ||
    fallback?.society ||
    `${property.name.replace(/Villa|Apartment|Residence|Penthouse/gi, "").trim()} Residency` ||
    "Green Valley Residency";

  const wing =
    property.wing ||
    fallback?.unitDetails?.wing ||
    (property.type === "Villa" ? "Villa Enclave" : "Wing A");

  const floor =
    property.floor ||
    fallback?.unitDetails?.floor ||
    (property.type === "Villa" ? "Ground + 1" : "5");

  const flatNo =
    property.flatNo ||
    property.plotNo ||
    property.villaNo ||
    fallback?.unitDetails?.flatNo ||
    (property.type === "Villa" ? "Villa No. 4" : "502");

  const surveyNo =
    property.surveyNo ||
    fallback?.unitDetails?.surveyNo ||
    `S.No ${100 + (Number(property.id) || 12)}/A`;

  // Coordinates & Pin Link
  const coords = resolvePropertyCoordinates({
    ...fallback,
    ...property,
    city,
    area,
  });
  const googleMapsPinUrl = getGoogleMapsPinUrl(coords.lat, coords.lng, property.name);
  const googleMapsEmbedUrl = getGoogleMapsEmbedUrl(coords.lat, coords.lng);

  // Dealer details
  const dealer =
    property.dealer ||
    getDealerForProperty({
      ...fallback,
      ...property,
      city,
    }) ||
    VERIFIED_DEALERS[0];

  // Images gallery
  const gallery =
    property.images && Array.isArray(property.images) && property.images.length > 0
      ? property.images
      : fallback?.images && Array.isArray(fallback?.images) && fallback?.images.length > 0
      ? fallback.images
      : [property.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"];

  const currentImage = gallery[activeImageIndex] || gallery[0];

  // Dates
  const createdDate = property.createdAt
    ? new Date(property.createdAt).toLocaleDateString("en-GB")
    : "01/10/2026";
  const updatedDate = property.updatedAt
    ? new Date(property.updatedAt).toLocaleDateString("en-GB")
    : "05/10/2026";

  const modeLabel =
    property.mode === "rent"
      ? "Rent"
      : property.mode === "short-term"
      ? "Short-term"
      : "Buy";

  const priceFormatted =
    property.priceLabel || formatCurrency(property.price);

  return (
    <div className="prop-drawer-overlay" onClick={onClose}>
      <aside
        className="prop-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Property Details Drawer"
      >
        {/* ========================================================= */}
        {/* DRAWER HEADER */}
        {/* ========================================================= */}
        <header className="prop-drawer-header">
          <div className="prop-drawer-header-left">
            <div className="prop-drawer-badge">PROPERTY DETAILS</div>
            <h2 className="prop-drawer-title">{property.name}</h2>
          </div>

          <div className="prop-drawer-header-actions">
            {onEdit && (
              <button
                type="button"
                className="prop-drawer-action-btn edit"
                onClick={() => onEdit(property)}
                title="Edit Property Details"
              >
                <Edit3 size={15} />
                <span>Edit</span>
              </button>
            )}
            <Link
              href={`/property/${property.id}`}
              target="_blank"
              className="prop-drawer-action-btn view-live"
              title="Open Live Public Page"
            >
              <ExternalLink size={15} />
              <span>Live Site</span>
            </Link>
            <button
              type="button"
              className="prop-drawer-close-btn"
              onClick={onClose}
              aria-label="Close Property Details"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* DRAWER BODY (SCROLLABLE) */}
        {/* ========================================================= */}
        <div className="prop-drawer-body">
          {/* 1. MEDIA GALLERY & PRIMARY INFO */}
          <section className="prop-drawer-media-section">
            <div className="prop-drawer-image-wrap">
              <img
                src={currentImage}
                alt={property.name}
                className="prop-drawer-main-image"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
                }}
              />
              <span className={`prop-drawer-mode-badge ${property.mode || "buy"}`}>
                {modeLabel}
              </span>
              <span className="prop-drawer-status-badge published">
                ● Published
              </span>
            </div>

            {gallery.length > 1 && (
              <div className="prop-drawer-thumbnails">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`prop-drawer-thumb-btn ${
                      activeImageIndex === idx ? "active" : ""
                    }`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

            <div className="prop-drawer-headline">
              <div className="prop-drawer-price-tag">{priceFormatted}</div>
              <h3 className="prop-drawer-prop-name">{property.name}</h3>
              <div className="prop-drawer-sub-address">
                <MapPin size={14} color="#ee705b" />
                <span>
                  {area}, {city}
                </span>
              </div>
            </div>
          </section>

          {/* 2. BASIC INFORMATION SECTION */}
          <section className="prop-drawer-card">
            <h4 className="prop-drawer-section-heading">
              <Building2 size={16} />
              <span>Basic Information</span>
            </h4>

            <div className="prop-drawer-table-grid">
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">Property Type</span>
                <span className="prop-drawer-value">{property.type || "Apartment"}</span>
              </div>
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">Listing Type</span>
                <span className="prop-drawer-value">{modeLabel}</span>
              </div>
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">Super Built-up Area</span>
                <span className="prop-drawer-value">
                  {property.size ? `${property.size} sq.ft.` : "1850 sq.ft."}
                </span>
              </div>
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">Bedrooms (BHK)</span>
                <span className="prop-drawer-value">
                  {property.bedrooms ? `${property.bedrooms} BHK` : "3 BHK"}
                </span>
              </div>
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">Bathrooms</span>
                <span className="prop-drawer-value">
                  {property.bathrooms ? `${property.bathrooms} Bathrooms` : "3 Bathrooms"}
                </span>
              </div>
              {property.tag && (
                <div className="prop-drawer-row">
                  <span className="prop-drawer-label">Tag / Highlights</span>
                  <span className="prop-drawer-value">
                    <span className="prop-drawer-highlight-tag">{property.tag}</span>
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* 3. PROPERTY DETAILS / UNIT INFORMATION */}
          <section className="prop-drawer-card">
            <h4 className="prop-drawer-section-heading">
              <Layers size={16} />
              <span>Property Details (Unit Info)</span>
            </h4>

            <div className="prop-drawer-table-grid">
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">Project / Society</span>
                <span className="prop-drawer-value font-semibold">{society}</span>
              </div>
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">Wing / Tower</span>
                <span className="prop-drawer-value">{wing}</span>
              </div>
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">Floor</span>
                <span className="prop-drawer-value">{floor}</span>
              </div>
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">Flat No. / Plot No.</span>
                <span className="prop-drawer-value font-semibold">{flatNo}</span>
              </div>
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">Survey No. / RERA</span>
                <span className="prop-drawer-value">{surveyNo}</span>
              </div>
            </div>
          </section>

          {/* 4. LOCATION & EXACT GOOGLE MAP PIN */}
          <section className="prop-drawer-card">
            <div className="prop-drawer-section-header-row">
              <h4 className="prop-drawer-section-heading">
                <MapPin size={16} />
                <span>Location & Exact Map Pin</span>
              </h4>
              <a
                href={googleMapsPinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="prop-drawer-maps-open-btn"
                title="Open exact marked pin on Google Maps"
              >
                <span>Google Maps Pin</span>
                <ExternalLink size={13} />
              </a>
            </div>

            <div className="prop-drawer-table-grid">
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">District</span>
                <span className="prop-drawer-value">{district}</span>
              </div>
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">City</span>
                <span className="prop-drawer-value">{city}</span>
              </div>
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">Area / Locality</span>
                <span className="prop-drawer-value font-semibold">{area}</span>
              </div>
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">Pincode</span>
                <span className="prop-drawer-value">{pincode}</span>
              </div>
              <div className="prop-drawer-row">
                <span className="prop-drawer-label">Street Address</span>
                <span className="prop-drawer-value">{streetAddress}</span>
              </div>
            </div>

            {/* Embedded Visual Google Map with Pin Marker */}
            <div className="prop-drawer-map-container">
              <div className="prop-drawer-map-header">
                <div className="prop-drawer-map-coords">
                  <span className="prop-drawer-pin-icon">📍</span>
                  <span>
                    {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
                  </span>
                </div>
                <span className="prop-drawer-map-tag">Exact Pin Location</span>
              </div>

              <div className="prop-drawer-map-frame-wrap">
                <iframe
                  title={`Google Maps Pin - ${property.name}`}
                  src={googleMapsEmbedUrl}
                  className="prop-drawer-map-iframe"
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              <div className="prop-drawer-map-footer">
                <a
                  href={googleMapsPinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="prop-drawer-map-link-btn"
                >
                  <ExternalLink size={14} />
                  <span>Open Exact Pin Marker in Google Maps ↗</span>
                </a>
              </div>
            </div>
          </section>

          {/* 5. DEALER INFORMATION */}
          <section className="prop-drawer-card">
            <h4 className="prop-drawer-section-heading">
              <ShieldCheck size={16} />
              <span>Assigned Dealer</span>
            </h4>

            <div className="prop-drawer-dealer-box">
              <img
                src={
                  dealer.avatar ||
                  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
                }
                alt={dealer.name}
                className="prop-drawer-dealer-avatar"
              />

              <div className="prop-drawer-dealer-info">
                <div className="prop-drawer-dealer-name-row">
                  <strong className="prop-drawer-dealer-name">{dealer.name}</strong>
                  <span className="prop-drawer-verified-chip">
                    <CheckCircle2 size={12} />
                    <span>Verified Dealer</span>
                  </span>
                </div>

                <div className="prop-drawer-dealer-agency">
                  {dealer.company || "ABC Properties"}
                </div>

                <div className="prop-drawer-dealer-phone">
                  <Phone size={13} />
                  <span>{dealer.phone || "+91 98251 44221"}</span>
                </div>

                <div className="prop-drawer-dealer-actions">
                  <a
                    href={`tel:${dealer.phone?.replace(/[^0-9+]/g, "")}`}
                    className="prop-dealer-contact-btn call"
                  >
                    <Phone size={13} />
                    <span>Call Dealer</span>
                  </a>
                  {dealer.whatsapp && (
                    <a
                      href={`https://wa.me/${dealer.whatsapp}?text=Hello%20${encodeURIComponent(
                        dealer.name
                      )},%20inquiring%20about%20${encodeURIComponent(property.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="prop-dealer-contact-btn whatsapp"
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 6. SYSTEM INFORMATION & TIMESTAMPS */}
          <section className="prop-drawer-card system-info">
            <div className="prop-drawer-system-row">
              <div className="prop-drawer-system-item">
                <span className="prop-system-label">Listing Status:</span>
                <span className="prop-system-val status-published">Published</span>
              </div>
              <div className="prop-drawer-system-item">
                <span className="prop-system-label">Property ID:</span>
                <span className="prop-system-val">#PROP-{property.id}</span>
              </div>
            </div>

            <div className="prop-drawer-system-row" style={{ marginTop: "10px" }}>
              <div className="prop-drawer-system-item">
                <Clock size={13} color="#77766f" />
                <span className="prop-system-label">Created:</span>
                <span className="prop-system-val">{createdDate}</span>
              </div>
              <div className="prop-drawer-system-item">
                <Clock size={13} color="#77766f" />
                <span className="prop-system-label">Updated:</span>
                <span className="prop-system-val">{updatedDate}</span>
              </div>
            </div>
          </section>
        </div>

        {/* ========================================================= */}
        {/* DRAWER FOOTER */}
        {/* ========================================================= */}
        <footer className="prop-drawer-footer">
          <button
            type="button"
            className="prop-drawer-btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          {onEdit && (
            <button
              type="button"
              className="prop-drawer-btn-primary"
              onClick={() => onEdit(property)}
            >
              <Edit3 size={15} />
              <span>Edit Property</span>
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}
