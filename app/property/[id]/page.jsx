"use client";

import { useEffect, useState, use, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchPropertyById, getPropertyImages } from "@/app/lib/propertiesData";
import { getGoogleMapsUrl } from "@/app/lib/geocoding";
import { isPropertySaved, toggleSaveProperty } from "@/app/lib/savedHomes";
import { useAuth } from "@/app/context/AuthContext";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Star,
  Phone,
  MessageCircle,
  ExternalLink,
  Share2,
  Heart,
  Bookmark,
  Check,
  Building,
  ArrowLeft,
  X,
  Send,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./property-detail.css";

export default function PropertyDetailPage({ params }) {
  // Unwrap params using React.use() if Promise, or useParams hook
  const resolvedParams = params ? (typeof params.then === "function" ? use(params) : params) : useParams();
  const propertyId = resolvedParams?.id;

  const { requireAuth } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showStreetViewModal, setShowStreetViewModal] = useState(false);
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);

  // Inquiry form states
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [inquirySent, setInquirySent] = useState(false);

  // Leaflet map container for detail page
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const imagesCountRef = useRef(5);

  useEffect(() => {
    async function load() {
      if (!propertyId) return;
      setLoading(true);
      const data = await fetchPropertyById(propertyId);
      setProperty(data);
      if (data?.id) {
        setIsSaved(isPropertySaved(data.id));
      }
      setLoading(false);
    }
    load();
  }, [propertyId]);

  // Sync saved status with localStorage events
  useEffect(() => {
    if (!property?.id) return;
    setIsSaved(isPropertySaved(property.id));

    const handleSavedChange = () => {
      if (property?.id) {
        setIsSaved(isPropertySaved(property.id));
      }
    };

    window.addEventListener("storage", handleSavedChange);
    window.addEventListener("saved_homes_updated", handleSavedChange);
    return () => {
      window.removeEventListener("storage", handleSavedChange);
      window.removeEventListener("saved_homes_updated", handleSavedChange);
    };
  }, [property?.id]);

  // Safely manage body scroll whenever ANY modal or lightbox is active - guarantees page never gets stuck
  useEffect(() => {
    if (typeof document === "undefined") return;
    const isAnyModalActive = showInquiryModal || lightboxOpen || showStreetViewModal || showFloorPlanModal;
    if (isAnyModalActive) {
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [showInquiryModal, lightboxOpen, showStreetViewModal, showFloorPlanModal]);

  // Global Escape & Arrow key listener for modals & lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
        setShowStreetViewModal(false);
        setShowFloorPlanModal(false);
        setShowInquiryModal(false);
      } else if (lightboxOpen) {
        if (e.key === "ArrowLeft") {
          setLightboxIdx((prev) => (prev - 1 + imagesCountRef.current) % imagesCountRef.current);
        } else if (e.key === "ArrowRight") {
          setLightboxIdx((prev) => (prev + 1) % imagesCountRef.current);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  // Initialize interactive map for property location
  useEffect(() => {
    if (!property || !property.lat || !property.lng || !mapContainerRef.current) return;

    let isCancelled = false;

    const initMap = async () => {
      try {
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        let L = window.L;
        if (!L) {
          try {
            const leafletModule = await import("leaflet");
            L = leafletModule.default || leafletModule;
            window.L = L;
          } catch (importErr) {
            await new Promise((resolve) => {
              const script = document.createElement("script");
              script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
              script.async = true;
              script.onload = () => resolve();
              script.onerror = () => resolve();
              document.body.appendChild(script);
            });
            L = window.L;
          }
        }

        if (isCancelled || !mapContainerRef.current || !L) return;

        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove();
          } catch (e) { }
          mapInstanceRef.current = null;
        }

        if (mapContainerRef.current._leaflet_id) {
          delete mapContainerRef.current._leaflet_id;
        }

        const map = L.map(mapContainerRef.current, {
          center: [property.lat, property.lng],
          zoom: 15,
          scrollWheelZoom: false,
        });

        L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
          attribution: "&copy; Google Maps",
          maxZoom: 20,
        }).addTo(map);

        // Custom Location Pin Mark (Google Maps Dropped Pin style)
        const customIcon = L.divIcon({
          className: "property-map-marker-container",
          html: `
            <div class="property-map-pin-mark selected">
              <div class="pin-mark-graphic">
                <svg class="pin-mark-svg" width="34" height="42" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path class="pin-mark-body" d="M15 1C7.268 1 1 7.268 1 15C1 24.5 15 37 15 37C15 37 29 24.5 29 15C29 7.268 22.732 1 15 1Z" fill="#ee705b" stroke="#ffffff" stroke-width="1.8"/>
                  <circle cx="15" cy="14.5" r="6.5" fill="#ffffff"/>
                  <path d="M15 10.5L11 14V18H13.5V15.5H16.5V18H19V14L15 10.5Z" fill="#ee705b"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [34, 42],
          iconAnchor: [17, 42],
          popupAnchor: [0, -42],
        });

        const fullDisplayAddress = `${property.streetAddress || property.location || property.area}, ${property.city}, Gujarat${property.pincode ? ` - ${property.pincode}` : ""}`;

        const marker = L.marker([property.lat, property.lng], { icon: customIcon }).addTo(map);
        marker.bindPopup(`
          <div class="detail-map-popup-card">
            
            <strong class="detail-map-popup-name">${property.name}</strong>
            <div class="detail-map-popup-address">📍 ${fullDisplayAddress}</div>
          </div>
        `, { maxWidth: 280, closeButton: true, autoClose: false }).openPopup();

        mapInstanceRef.current = map;

        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 150);

        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 500);
      } catch (err) {
        console.error("Leaflet error on detail page:", err);
      }
    };

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) { }
        mapInstanceRef.current = null;
      }
    };
  }, [property]);

  // Handle Share link copy with robust fallback
  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch (e) {
      console.warn("Could not copy link:", e);
    }
  };

  // Handle Save / Favorite property toggle that persists to saved homes
  const handleToggleSave = () => {
    if (!property) return;
    requireAuth(() => {
      const nextSaved = toggleSaveProperty(property);
      setIsSaved(nextSaved);
    }, {
      title: "Save Property to Favorites",
      subtitle: "Sign in to save this property and view it anytime under Saved Homes.",
    });
  };

  // Handle Inquiry Form Submit
  const handleSendInquiry = (e) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setShowInquiryModal(false);
      setInquiryName("");
      setInquiryPhone("");
      setInquiryMsg("");
    }, 2000);
  };

  if (loading) {
    return (
      <main className="property-detail-page">
        <div style={{ padding: "120px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>⏳</div>
          <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Loading Property Details...</h2>
          <p style={{ color: "#77766f", fontSize: "14px" }}>Retrieving verified photos, unit specifications and dealer profile.</p>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="property-detail-page">
        <div style={{ padding: "120px 20px", textAlign: "center", maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏡</div>
          <h2 style={{ fontSize: "22px", fontWeight: "800" }}>Property Not Found</h2>
          <p style={{ color: "#77766f", fontSize: "14px", marginBottom: "20px" }}>
            The property you are looking for may have been sold or removed from our Gujarat listings.
          </p>
          <Link
            href="/buy"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#1d1e1a",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} />
            <span>Browse All Properties</span>
          </Link>
        </div>
      </main>
    );
  }

  const rawDealer = property.dealer || {};
  const dealer = {
    name: rawDealer.name || "Rahul Patel",
    company: rawDealer.agencyName || rawDealer.company || "Surat Elite Realty & Properties",
    phone: rawDealer.phone || "+91 98251 44221",
    email: rawDealer.email || "rahul@patelrealty.com",
    whatsapp: (rawDealer.phone || "919825144221").replace(/\D/g, ""),
    rating: rawDealer.rating || 4.9,
    reviewsCount: rawDealer.reviewsCount || 52,
    totalProperties: rawDealer.totalProperties || 125,
    verified: rawDealer.verified !== undefined ? Boolean(rawDealer.verified) : (rawDealer.verificationStatus === "Verified" || true),
    avatar: rawDealer.profilePhoto || rawDealer.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    role: rawDealer.dealerType || rawDealer.role || "Verified Property Dealer",
    address: rawDealer.officeAddress || rawDealer.address || "",
    city: rawDealer.city || property.city || "Surat",
    bio: rawDealer.bio || "",
    reraNumber: rawDealer.reraNumber || rawDealer.rera || "",
  };

  const images = property ? getPropertyImages(property) : [];
  const defaultFallbackImages = [
    property?.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  ];
  // Ensure minimum 5 images, but preserve all extra images for full gallery browsing
  const allImages = [...images];
  defaultFallbackImages.forEach((fb) => {
    if (allImages.length < 5 && !allImages.includes(fb)) {
      allImages.push(fb);
    }
  });
  const galleryImages = allImages;
  imagesCountRef.current = galleryImages.length;
  const extraPhotosCount = Math.max(0, galleryImages.length - 4);
  const gmapsLink = getGoogleMapsUrl(property.lat, property.lng, `${property.name}, ${property.location}`);
  const whatsappUrl = `https://wa.me/${dealer.whatsapp || '919825144221'}?text=${encodeURIComponent(
    `Hello ${dealer.name}, I am interested in viewing "${property.name}" (${property.priceLabel}) located in ${property.area || property.city}, Gujarat. Please share further details.`
  )}`;

  return (
    <main className="property-detail-page">
      {/* ======================================================================
          TOP BREADCRUMBS & ACTION BAR
          ====================================================================== */}
      <section className="property-breadcrumb-bar">
        <nav className="breadcrumb-trail" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={`/${property.mode}`}>{property.mode === "buy" ? "Buy" : property.mode === "rent" ? "Rent" : "Short-term"}</Link>
          <span>/</span>
          <Link href={`/${property.mode}?city=${encodeURIComponent(property.city)}`}>{property.city}</Link>
          <span>/</span>
          <span className="breadcrumb-current">{property.name}</span>
        </nav>

        <div className="breadcrumb-actions">
          <button
            type="button"
            className={`detail-action-btn ${copiedShare ? "detail-action-btn--success" : ""}`}
            onClick={handleShare}
            title="Copy property link to clipboard"
            id="property-share-btn"
          >
            {copiedShare ? <Check size={14} color="#16a34a" /> : <Share2 size={14} />}
            <span>{copiedShare ? "Link Copied!" : "Share"}</span>
          </button>

          <button
            type="button"
            className={`detail-action-btn ${isSaved ? "detail-action-btn--saved" : ""}`}
            onClick={handleToggleSave}
            title={isSaved ? "Remove from saved homes" : "Save property to favorites"}
            id="property-save-btn"
          >
            <Heart size={14} fill={isSaved ? "#ee705b" : "none"} color={isSaved ? "#ee705b" : "currentColor"} />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>
        </div>
      </section>

      <div className="property-detail-container">
        {/* ======================================================================
            TITLE & PRICE HEADER
            ====================================================================== */}
        <section className="property-header-section">
          <div className="property-title-col">
            <div className="property-badges-row">
              <span className={`badge-mode ${property.mode}`}>
                {property.mode === "buy" ? "For Sale" : property.mode === "rent" ? "For Rent" : "Short-term Stay"}
              </span>
              <span className="badge-type">{property.type}</span>
              <span className="badge-status">{property.unitDetails?.status || "Ready to Move"}</span>
            </div>

            <h1 className="detail-main-title">{property.name}</h1>

            <div className="detail-location-row">
              <MapPin size={17} color="#ee705b" />
              <span>
                {property.streetAddress || property.location}, {property.city}, Gujarat
                {property.pincode ? ` - ${property.pincode}` : ""}
              </span>
            </div>
          </div>

          <div className="property-price-col">
            <div className="detail-price-amount">{property.priceLabel}</div>
            <div className="detail-price-sub">
              {property.mode === "rent" ? "Monthly Rental Amount" : property.mode === "short-term" ? "Per Night Booking" : "Estimated Purchase Price"}
            </div>
          </div>
        </section>

        {/* ======================================================================
            PHOTO GALLERY GRID (Hero on Left + 2x2 Grid on Right matching uploaded layout)
            ====================================================================== */}
        <section className="property-gallery-grid">
          {/* Main Hero Photo (Left Spanning 2 Rows) */}
          <div
            className="gallery-main-img"
            onClick={() => {
              setLightboxIdx(0);
              setLightboxOpen(true);
            }}
          >
            <img src={galleryImages[0]} alt={property.name} />
            <div className="gallery-pills-overlay">
              <button
                type="button"
                className="gallery-pill-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFloorPlanModal(true);
                }}
                title="View architectural floor layout"
              >
                <Layers size={14} />
                <span>Floor plan</span>
              </button>
              <button
                type="button"
                className="gallery-pill-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStreetViewModal(true);
                }}
                title="Explore 360 street & neighborhood view"
              >
                <Compass size={14} />
                <span>Street view</span>
              </button>
            </div>
          </div>

          {/* Sub Photo 1 (Top-Left of 2x2) */}
          <div
            className="gallery-sub-img"
            onClick={() => {
              setLightboxIdx(1);
              setLightboxOpen(true);
            }}
          >
            <img src={galleryImages[1]} alt={`${property.name} photo 2`} />
          </div>

          {/* Sub Photo 2 (Top-Right of 2x2) */}
          <div
            className="gallery-sub-img"
            onClick={() => {
              setLightboxIdx(2);
              setLightboxOpen(true);
            }}
          >
            <img src={galleryImages[2]} alt={`${property.name} photo 3`} />
          </div>

          {/* Sub Photo 3 (Bottom-Left of 2x2) */}
          <div
            className="gallery-sub-img"
            onClick={() => {
              setLightboxIdx(3);
              setLightboxOpen(true);
            }}
          >
            <img src={galleryImages[3]} alt={`${property.name} photo 4`} />
          </div>

          {/* Sub Photo 4 (Bottom-Right of 2x2 with dynamic extra count) */}
          <div
            className="gallery-sub-img"
            onClick={() => {
              setLightboxIdx(4);
              setLightboxOpen(true);
            }}
          >
            <img src={galleryImages[4]} alt={`${property.name} photo 5`} />
            {extraPhotosCount > 0 && (
              <div className="gallery-more-overlay">
                <span>+ {extraPhotosCount} Photos</span>
              </div>
            )}
          </div>
        </section>

        {/* ======================================================================
            2-COLUMN CONTENT: LEFT SPECS & DETAILS, RIGHT DEALER PROFILE
            ====================================================================== */}
        <div className="detail-content-layout">
          {/* LEFT COLUMN: MAIN CONTENT */}
          <div className="detail-main-content">
            {/* Key Metrics Strip */}
            <div className="key-metrics-strip">
              <div className="metric-card">
                <div className="metric-icon-box"><Bed size={20} /></div>
                <div>
                  <div className="metric-label">Bedrooms</div>
                  <div className="metric-value">{property.bedrooms} BHK</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box"><Bath size={20} /></div>
                <div>
                  <div className="metric-label">Bathrooms</div>
                  <div className="metric-value">{property.bathrooms} Baths</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box"><Maximize2 size={20} /></div>
                <div>
                  <div className="metric-label">Super Area</div>
                  <div className="metric-value">{property.size} sq.ft</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box"><Compass size={20} /></div>
                <div>
                  <div className="metric-label">Facing</div>
                  <div className="metric-value">{property.unitDetails?.facing || "East Facing"}</div>
                </div>
              </div>
            </div>

            {/* Property Description */}
            <div className="detail-card-section">
              <h3 className="detail-section-title">
                <Sparkles size={18} color="#ee705b" />
                <span>Property Overview</span>
              </h3>
              <p className="detail-description-text">{property.description}</p>
            </div>

            {/* Unit Details Specification Table */}
            <div className="detail-card-section">
              <h3 className="detail-section-title">
                <Building size={18} color="#ee705b" />
                <span>Property & Unit Details</span>
              </h3>
              <div className="unit-details-grid">
                <div className="unit-spec-box">
                  <div className="unit-spec-label">Wing / Tower</div>
                  <div className="unit-spec-val">{property.unitDetails?.wing || "A Wing"}</div>
                </div>
                <div className="unit-spec-box">
                  <div className="unit-spec-label">Floor</div>
                  <div className="unit-spec-val">{property.unitDetails?.floor || "5th Floor"}</div>
                </div>
                <div className="unit-spec-box">
                  <div className="unit-spec-label">Flat / Unit No</div>
                  <div className="unit-spec-val">{property.unitDetails?.flatNo || "Flat 502"}</div>
                </div>
                <div className="unit-spec-box">
                  <div className="unit-spec-label">Survey / Plot No</div>
                  <div className="unit-spec-val">{property.unitDetails?.surveyNo || "Survey 142/2"}</div>
                </div>
                <div className="unit-spec-box">
                  <div className="unit-spec-label">Status</div>
                  <div className="unit-spec-val">{property.unitDetails?.status || "Ready to Move"}</div>
                </div>
                <div className="unit-spec-box">
                  <div className="unit-spec-label">Furnishing</div>
                  <div className="unit-spec-val">{property.unitDetails?.furnishing || "Semi-Furnished"}</div>
                </div>
                <div className="unit-spec-box">
                  <div className="unit-spec-label">Construction Age</div>
                  <div className="unit-spec-val">{property.unitDetails?.age || "Brand New Construction"}</div>
                </div>
                <div className="unit-spec-box">
                  <div className="unit-spec-label">Pincode (Postal)</div>
                  <div className="unit-spec-val" style={{ color: "#0284c7" }}>{property.pincode || "395007"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY DEALER PROFILE CARD */}
          <aside className="detail-sidebar">
            <div className="dealer-profile-card">
              <div className="dealer-profile-top">
                <div className="dealer-profile-avatar-wrap">
                  <img
                    src={dealer.avatar}
                    alt={dealer.name}
                    className="dealer-profile-avatar"
                  />
                  {dealer.verified && (
                    <span className="dealer-profile-badge" title="Verified Gujarat Real Estate Dealer">
                      ✓
                    </span>
                  )}
                </div>

                <div className="dealer-profile-name-group">
                  <h3 className="dealer-profile-name">{dealer.name}</h3>
                  <div className="dealer-profile-company">{dealer.company}</div>
                  <div className="dealer-verified-tag">
                    <ShieldCheck size={14} />
                    <span>Verified Property Dealer</span>
                  </div>
                </div>
              </div>

              {/* Dealer Stats */}
              <div className="dealer-stats-strip">
                <div className="dealer-stat-box">
                  <div className="dealer-stat-num">
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <span>{dealer.rating || 4.9}</span>
                  </div>
                  <div className="dealer-stat-label">Rating ({dealer.reviewsCount || 48})</div>
                </div>
                <div className="dealer-stat-box">
                  <div className="dealer-stat-num">{dealer.totalProperties || 125}+</div>
                  <div className="dealer-stat-label">Active Properties</div>
                </div>
              </div>

              {/* Direct Contact Buttons */}
              <div className="dealer-contact-actions">
                <button
                  type="button"
                  className="dealer-btn-whatsapp"
                  onClick={() => {
                    requireAuth(() => {
                      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
                    }, {
                      title: "Contact Dealer on WhatsApp",
                      subtitle: "Sign in to send a direct WhatsApp message to the verified dealer.",
                    });
                  }}
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp Inquiry</span>
                </button>

                <button
                  type="button"
                  className="dealer-btn-call"
                  onClick={() => {
                    requireAuth(() => {
                      window.location.href = `tel:${dealer.phone || '+919825144221'}`;
                    }, {
                      title: "Call Verified Dealer",
                      subtitle: `Sign in to view direct phone details and connect with ${dealer.name}.`,
                    });
                  }}
                >
                  <Phone size={17} />
                  <span>Call Dealer: {dealer.phone || '+91 98251 44221'}</span>
                </button>

                <button
                  type="button"
                  className="dealer-inquiry-btn"
                  onClick={() => {
                    requireAuth(() => {
                      setShowInquiryModal(true);
                    }, {
                      title: "Schedule Property Visit",
                      subtitle: "Sign in to reserve your preferred date and time for a guided site tour.",
                    });
                  }}
                >
                  <Calendar size={16} />
                  <span>Schedule Property Visit</span>
                </button>
              </div>

              <div className="dealer-security-note">
                <ShieldCheck size={14} color="#16a34a" />
                <span>Verified by Gujarat Real Estate Authority</span>
              </div>
            </div>
          </aside>
        </div>

        {/* ======================================================================
            FULL-WIDTH SECTIONS: FEATURES & AMENITIES + EXACT LOCATION & MAP PIN
            Spanning 100% full container width (filling empty space on the right)
            ====================================================================== */}
        <div className="detail-fullwidth-sections">
          {/* Amenities Grid */}
          <div className="detail-card-section">
            <h3 className="detail-section-title">
              <span>Features & Amenities</span>
            </h3>
            <div className="amenities-grid">
              {(property.amenities || []).map((amenity, i) => (
                <div key={i} className="amenity-chip">
                  <CheckCircle2 size={16} className="amenity-chip-check" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exact Location & Interactive Map */}
          <div className="detail-card-section" id="property-location-map">
            <h3 className="detail-section-title">
              <MapPin size={18} color="#ee705b" />
              <span>Exact Location & Map Pin</span>
            </h3>
            <div className="detail-map-canvas-wrap">
              <div ref={mapContainerRef} className="detail-map-canvas" />
            </div>
            <div className="detail-map-address-banner">
              <div>
                <div style={{ fontSize: "17px", fontWeight: "800", color: "#ee705b", marginBottom: "3px" }}>
                  {property.priceLabel}
                </div>
                <strong style={{ fontSize: "14.5px", color: "#1d1e1a", display: "block", marginBottom: "3px" }}>
                  {property.streetAddress || property.location || property.name}
                </strong>
                <div style={{ fontSize: "13px", color: "#4b5563" }}>
                  📍 {property.area ? `${property.area}, ` : ""}{property.city}, Gujarat{property.pincode ? ` - ${property.pincode}` : ""}
                </div>
                <div style={{ fontSize: "11.5px", color: "#9ca3af", marginTop: "3px" }}>
                  Coordinates: {property.lat?.toFixed(5)}, {property.lng?.toFixed(5)} · Verified Gujarat Pin
                </div>
              </div>
              <a
                href={gmapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="gmaps-open-btn"
              >
                <span>Open in Google Maps</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================
          SCHEDULE VISIT / INQUIRY MODAL
          ====================================================================== */}
      {showInquiryModal && (
        <div className="inquiry-modal-backdrop" onClick={() => setShowInquiryModal(false)}>
          <div className="inquiry-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="inquiry-modal-close"
              onClick={() => setShowInquiryModal(false)}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: "20px", fontWeight: "800", margin: "0 0 6px 0" }}>Schedule Property Visit</h3>
            <p style={{ color: "#77766f", fontSize: "13.5px", margin: "0 0 20px 0" }}>
              Connect with <strong>{dealer.name}</strong> to arrange an in-person or virtual viewing of {property.name}.
            </p>

            {inquirySent ? (
              <div style={{ textAlign: "center", padding: "20px", background: "#f0fdf4", borderRadius: "12px", border: "1px solid #bbf7d0" }}>
                <CheckCircle2 size={36} color="#16a34a" style={{ margin: "0 auto 8px" }} />
                <h4 style={{ margin: "0 0 4px 0", color: "#166534" }}>Visit Request Sent!</h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#15803d" }}>
                  {dealer.name} will call you back within 30 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry}>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", marginBottom: "4px" }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    style={{ width: "100%", height: "42px", padding: "0 12px", borderRadius: "8px", border: "1px solid #d8d5cd" }}
                    placeholder="e.g. Ramesh Patel"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", marginBottom: "4px" }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    style={{ width: "100%", height: "42px", padding: "0 12px", borderRadius: "8px", border: "1px solid #d8d5cd" }}
                    placeholder="e.g. +91 98765 43210"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", marginBottom: "4px" }}>
                    Preferred Visit Date & Message
                  </label>
                  <textarea
                    rows={3}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #d8d5cd", resize: "vertical" }}
                    placeholder="e.g. Interested in Saturday afternoon site visit."
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    height: "46px",
                    background: "#ee705b",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <Send size={16} />
                  <span>Confirm Visit Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================
          INTERACTIVE STREET & NEIGHBORHOOD VIEW MODAL
          ====================================================================== */}
      {showStreetViewModal && (
        <div
          className="streetview-modal-backdrop"
          onClick={() => setShowStreetViewModal(false)}
        >
          <div
            className="streetview-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="streetview-modal-close"
              onClick={() => setShowStreetViewModal(false)}
              aria-label="Close street view"
            >
              <X size={20} />
            </button>

            <div className="streetview-header">
              <h3 className="streetview-title">
                <Compass size={22} color="#ee705b" />
                <span>360° Street & Neighborhood View</span>
              </h3>
              <p className="streetview-sub">
                📍 {property.streetAddress || property.location || property.area}, {property.city}, Gujarat
              </p>
            </div>

            <div className="streetview-frame-wrap">
              <iframe
                title={`Street View for ${property.name}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${property.lat},${property.lng}&z=17&output=embed`}
              />
            </div>

            <div className="streetview-actions-bar">
              <div style={{ fontSize: "13px", color: "#77766f" }}>
                Coordinates: <strong>{property.lat?.toFixed(5)}, {property.lng?.toFixed(5)}</strong> · Verified Gujarat Location
              </div>
              <a
                href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${property.lat},${property.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="streetview-ext-link"
              >
                <span>Launch in Google Street View</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          ARCHITECTURAL FLOOR PLAN MODAL
          ====================================================================== */}
      {showFloorPlanModal && (
        <div
          className="floorplan-modal-backdrop"
          onClick={() => setShowFloorPlanModal(false)}
        >
          <div
            className="floorplan-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="floorplan-modal-close"
              onClick={() => setShowFloorPlanModal(false)}
              aria-label="Close floor plan"
            >
              <X size={20} />
            </button>

            <div className="floorplan-header">
              <h3 className="floorplan-title">
                <Layers size={22} color="#ee705b" />
                <span>Architectural Floor Plan · {property.bedrooms} BHK</span>
              </h3>
              <p className="floorplan-sub">
                {property.name} · {property.size} sq.ft Super Built-up Area · {property.type}
              </p>
            </div>

            <div className="floorplan-blueprint-card">
              <div className="floorplan-svg-wrap">
                <svg
                  viewBox="0 0 600 360"
                  width="100%"
                  height="100%"
                  style={{ maxHeight: "340px" }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="20" y="20" width="560" height="320" fill="#f8fafc" stroke="#334155" strokeWidth="4" rx="8" />
                  
                  {/* Living Room */}
                  <rect x="30" y="30" width="280" height="170" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" strokeDasharray="4 2" />
                  <text x="170" y="105" textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="bold">Living &amp; Dining Lounge</text>
                  <text x="170" y="128" textAnchor="middle" fill="#64748b" fontSize="12">18&apos; 0&quot; × 14&apos; 6&quot; (261 sq.ft)</text>
                  
                  {/* Balcony */}
                  <rect x="30" y="210" width="160" height="120" fill="#e2e8f0" stroke="#0284c7" strokeWidth="2" />
                  <text x="110" y="265" textAnchor="middle" fill="#0369a1" fontSize="13" fontWeight="bold">Private Balcony</text>
                  <text x="110" y="285" textAnchor="middle" fill="#0284c7" fontSize="11">12&apos; 0&quot; × 6&apos; 0&quot;</text>
                  
                  {/* Kitchen */}
                  <rect x="200" y="210" width="150" height="120" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                  <text x="275" y="265" textAnchor="middle" fill="#92400e" fontSize="13" fontWeight="bold">Modular Kitchen</text>
                  <text x="275" y="285" textAnchor="middle" fill="#b45309" fontSize="11">10&apos; 0&quot; × 8&apos; 6&quot;</text>
                  
                  {/* Master Suite */}
                  <rect x="320" y="30" width="250" height="170" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
                  <text x="445" y="100" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">Master Suite Bedroom</text>
                  <text x="445" y="120" textAnchor="middle" fill="#047857" fontSize="11">15&apos; 0&quot; × 13&apos; 0&quot;</text>
                  <text x="445" y="140" textAnchor="middle" fill="#10b981" fontSize="11">Attached Luxury Bath</text>
                  
                  {/* Bedroom 2 */}
                  <rect x="360" y="210" width="210" height="120" fill="#fdf2f8" stroke="#db2777" strokeWidth="2" />
                  <text x="465" y="265" textAnchor="middle" fill="#9d174d" fontSize="13" fontWeight="bold">Bedroom 2 / Guest</text>
                  <text x="465" y="285" textAnchor="middle" fill="#be185d" fontSize="11">12&apos; 6&quot; × 11&apos; 0&quot;</text>
                </svg>
              </div>

              <div className="floorplan-specs-strip">
                <div className="floorplan-spec-item">
                  <div className="floorplan-spec-lbl">Super Built-up Area</div>
                  <div className="floorplan-spec-val">{property.size} sq.ft</div>
                </div>
                <div className="floorplan-spec-item">
                  <div className="floorplan-spec-lbl">Carpet Efficiency</div>
                  <div className="floorplan-spec-val">84.5% RERA</div>
                </div>
                <div className="floorplan-spec-item">
                  <div className="floorplan-spec-lbl">Configuration</div>
                  <div className="floorplan-spec-val">{property.bedrooms} BHK + {property.bathrooms} Bath</div>
                </div>
                <div className="floorplan-spec-item">
                  <div className="floorplan-spec-lbl">Ceiling Height</div>
                  <div className="floorplan-spec-val">10.5 ft (Grand)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          FULLSCREEN PHOTO LIGHTBOX MODAL WITH PROMINENT INDICATOR BUTTONS
          ====================================================================== */}
      {lightboxOpen && (
        <div
          className="property-lightbox-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="lightbox-header" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-title-wrap">
              <h4 className="lightbox-title">{property.name}</h4>
              <span className="lightbox-counter">
                Photo {lightboxIdx + 1} of {galleryImages.length}
              </span>
            </div>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close photo viewer"
              title="Close (Esc)"
            >
              <X size={22} />
            </button>
          </div>

          <div className="lightbox-body" onClick={(e) => e.stopPropagation()}>
            {/* Left Indicator Navigation Button */}
            <button
              type="button"
              className="lightbox-nav-btn lightbox-nav-prev"
              onClick={() => setLightboxIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
              aria-label="Previous photo"
              title="Previous photo (Left arrow)"
            >
              <ChevronLeft size={30} />
            </button>

            <img
              src={galleryImages[lightboxIdx]}
              alt={`${property.name} photo ${lightboxIdx + 1}`}
              className="lightbox-main-img"
            />

            {/* Right Indicator Navigation Button */}
            <button
              type="button"
              className="lightbox-nav-btn lightbox-nav-next"
              onClick={() => setLightboxIdx((prev) => (prev + 1) % galleryImages.length)}
              aria-label="Next photo"
              title="Next photo (Right arrow)"
            >
              <ChevronRight size={30} />
            </button>
          </div>

          <div className="lightbox-thumb-strip" onClick={(e) => e.stopPropagation()}>
            {galleryImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumb ${idx + 1}`}
                className={`lightbox-thumb ${lightboxIdx === idx ? "active" : ""}`}
                onClick={() => setLightboxIdx(idx)}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
