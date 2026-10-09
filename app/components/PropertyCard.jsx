"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ExternalLink,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { isPropertySaved, toggleSaveProperty } from "@/app/lib/savedHomes";
import { getPropertyImages } from "@/app/lib/propertiesData";
import { useAuth } from "@/app/context/AuthContext";

export default function PropertyCard({
  property,
  isSelected = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) {
  const { requireAuth } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const images = getPropertyImages(property);
  const activeImg = images[currentImgIdx] || property.image;

  const handlePrevImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImgIdx((prev) => (prev + 1) % images.length);
  };

  const handleDotClick = (e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImgIdx(idx);
  };

  useEffect(() => {
    if (property?.id) {
      setIsSaved(isPropertySaved(property.id));
    }

    const handleUpdate = () => {
      if (property?.id) {
        setIsSaved(isPropertySaved(property.id));
      }
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("saved_homes_updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("saved_homes_updated", handleUpdate);
    };
  }, [property?.id]);

  if (!property) return null;

  const handleToggleSave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    requireAuth(() => {
      if (property?.id) {
        const next = toggleSaveProperty(property);
        setIsSaved(next);
      }
    }, {
      title: "Save Property to Favorites",
      subtitle: "Sign in to save this property and view it anytime under Saved Homes.",
    });
  };

  const modeBadgeText =
    property.mode === "rent"
      ? "Rent"
      : property.mode === "short-term"
      ? "Short-Term"
      : "For Sale";

  const modeClass =
    property.mode === "rent"
      ? "mode-rent"
      : property.mode === "short-term"
      ? "mode-short-term"
      : "mode-buy";

  const dealer = property.dealer || {
    name: "Rahul Patel",
    company: "Surat Elite Realty",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    verified: true,
  };

  const router = useRouter();
  const propertyUrl = `/property/${property.id}`;

  const handleCardClick = (e) => {
    // If the click was on a button (carousel controls or favorite heart), do not navigate
    if (e.target.closest("button")) return;
    if (onClick) onClick(property.id);
    window.open(propertyUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      id={`property-card-${property.id}`}
      className={`property-card-item ${isSelected ? "selected-card" : ""}`}
      onMouseEnter={() => onMouseEnter && onMouseEnter(property.id)}
      onMouseLeave={() => onMouseLeave && onMouseLeave(property.id)}
      onClick={handleCardClick}
    >
      {/* Property Image & Badges */}
      <div className="property-card-image-wrap">
        <Link
          href={propertyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="property-card-image-link"
          title={`Open ${property.name} in new tab`}
        >
          <img
            src={activeImg}
            alt={`${property.name} - Photo ${currentImgIdx + 1}`}
            className="property-card-img"
            loading="lazy"
          />
        </Link>

        {/* Carousel Navigation Arrows (visible on hover) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="card-carousel-nav-btn card-carousel-prev"
              onClick={handlePrevImage}
              aria-label="Previous photo"
              title="Previous photo"
            >
              <ChevronLeft size={13} strokeWidth={2.4} />
            </button>

            <button
              type="button"
              className="card-carousel-nav-btn card-carousel-next"
              onClick={handleNextImage}
              aria-label="Next photo"
              title="Next photo"
            >
              <ChevronRight size={13} strokeWidth={2.4} />
            </button>

            {/* Carousel Dot Indicators */}
            <div className="card-carousel-dots">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`card-carousel-dot ${currentImgIdx === idx ? "active" : ""}`}
                  onClick={(e) => handleDotClick(e, idx)}
                  aria-label={`Photo ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Top Tagline Badge */}
        {property.tag && (
          <div className="property-card-badge-top">
            <span className="property-card-trending-badge">
              <Flame size={12} fill="#ee705b" color="#ee705b" />
              <span>{property.tag}</span>
            </span>
          </div>
        )}

        {/* Favorite Save Button */}
        <button
          type="button"
          className={`property-card-save-btn ${isSaved ? "saved" : ""}`}
          onClick={handleToggleSave}
          title={isSaved ? "Remove from saved homes" : "Save this property"}
          aria-label={isSaved ? "Unsave property" : "Save property"}
        >
          <Heart size={16} fill={isSaved ? "#ee705b" : "rgba(0,0,0,0.25)"} color={isSaved ? "#ee705b" : "#ffffff"} />
        </button>
      </div>

      {/* Property Content Body */}
      <div className="property-card-body">
        {/* Price */}
        <div className="property-card-price-wrap">
          <div className="property-card-price">{property.priceLabel}</div>
        </div>

        {/* Badges Row - ALWAYS below the price */}
        <div className="property-card-badges-row">
          <span className="property-card-type-tag">{property.type}</span>
          <span className="property-card-status">
            {property.unitDetails?.status || "Ready to Move"}
          </span>
        </div>

        {/* Title */}
        <h3 className="property-card-title">
          <Link
            href={propertyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="property-card-title-link"
          >
            {property.name}
          </Link>
        </h3>

        {/* Location & Pincode */}
        <div className="property-card-location">
          <MapPin size={14} className="location-icon" />
          <span className="location-text">
            {property.area}, {property.city}
          </span>
        </div>

        {/* Specs Row */}
        <div className="property-card-specs-row">
          <div className="spec-item" title="Bedrooms">
            <Bed size={14} />
            <span>{property.bedrooms} BHK</span>
          </div>
          <span className="spec-divider">•</span>
          <div className="spec-item" title="Bathrooms">
            <Bath size={14} />
            <span>{property.bathrooms} Baths</span>
          </div>
          <span className="spec-divider">•</span>
          <div className="spec-item" title="Carpet Area">
            <Maximize2 size={13} />
            <span>{Number(property.size || 1500).toLocaleString()} sq.ft</span>
          </div>
        </div>
      </div>
    </article>
  );
}
