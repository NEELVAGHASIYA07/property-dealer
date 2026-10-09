"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  reverseGeocode,
  searchLocation,
  searchLocationSuggestions,
  parseGoogleMapsInput,
  getGoogleMapsUrl,
  getDirectGoogleMapsOpenUrl,
  getGoogleMapsEmbedUrl,
  getGujaratPincode,
} from "@/app/lib/geocoding";
import {
  MapPin,
  Search,
  Navigation,
  ExternalLink,
  Layers,
  Check,
  Loader2,
  Copy,
  Compass,
  Globe,
  HelpCircle,
} from "lucide-react";

export default function InteractiveMapPicker({
  lat = 23.0338,
  lng = 72.5850,
  address = "",
  cityName = "Ahmedabad",
  areaName = "",
  onLocationSelect,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const searchWrapRef = useRef(null);

  const [currentCoords, setCurrentCoords] = useState({
    lat: Number(lat) || 23.0338,
    lng: Number(lng) || 72.5850,
  });

  const [viewMode, setViewMode] = useState("interactive"); // "interactive" | "google-embed"
  const [activeLayer, setActiveLayer] = useState("google"); // "google" | "satellite" | "osm"
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showHelpTip, setShowHelpTip] = useState(false);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);

  // Sync internal coords if external props change substantially
  useEffect(() => {
    const numLat = Number(lat);
    const numLng = Number(lng);
    if (
      !isNaN(numLat) &&
      !isNaN(numLng) &&
      (Math.abs(numLat - currentCoords.lat) > 0.0001 ||
        Math.abs(numLng - currentCoords.lng) > 0.0001)
    ) {
      setCurrentCoords({ lat: numLat, lng: numLng });
      setIsLocationConfirmed(false);
      if (mapInstanceRef.current && markerRef.current) {
        markerRef.current.setLatLng([numLat, numLng]);
        mapInstanceRef.current.flyTo([numLat, numLng], 16, { animate: true, duration: 0.8 });
      }
    }
  }, [lat, lng]);

  // Debounced search suggestions
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await searchLocationSuggestions(searchQuery, cityName);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (err) {
        console.error("Suggestions error:", err);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery, cityName]);

  // Click outside listener for suggestions popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle location update and reverse geocode
  const handlePinMoved = useCallback(
    async (newLat, newLng, customSocietyName = "") => {
      setCurrentCoords({ lat: newLat, lng: newLng });
      setIsLocationConfirmed(false);
      setStatusMessage("Finding exact address & society from Google Maps...");

      try {
        const geoResult = await reverseGeocode(newLat, newLng, cityName);
        const resolvedSociety = customSocietyName || geoResult?.society || "";
        const pinGoogleUrl = `https://www.google.com/maps?q=${newLat},${newLng}&z=18`;
        const verifiedPin = getGujaratPincode(geoResult?.area || areaName, geoResult?.city || cityName) || geoResult?.pincode || "";

        if (geoResult && geoResult.address) {
          setStatusMessage(`Pinned: ${resolvedSociety || geoResult.address}`);
          if (markerRef.current) {
            markerRef.current
              .bindPopup(
                `<div style="font-family: inherit; font-size: 13px; line-height: 1.4; color: #1e293b; min-width: 200px;">
                  <strong style="color: #dc2626; display: flex; align-items: center; gap: 4px;">
                    📍 Property Location Marked
                  </strong>
                  <div style="margin-top: 4px; font-weight: 600; font-size: 13.5px; color: #0f172a;">${
                    resolvedSociety && resolvedSociety !== "Exact Pin Point" && resolvedSociety !== cityName
                      ? resolvedSociety
                      : (geoResult.area || "Exact Pin Point")
                  }</div>
                  <div style="font-size: 12px; color: #475569; margin-top: 3px;">${geoResult.address}</div>
                  ${verifiedPin ? `<div style="font-size: 11.5px; color: #0284c7; font-weight: 600; margin-top: 4px; background: #f0f9ff; padding: 2px 6px; border-radius: 4px; display: inline-block;">📮 PIN: ${verifiedPin} (${geoResult.area || cityName})</div>` : ""}
                  <div style="margin-top: 6px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 4px;">
                    Lat: ${newLat.toFixed(5)}, Lng: ${newLng.toFixed(5)}
                  </div>
                </div>`
              )
              .openPopup();
          }

          if (onLocationSelect) {
            onLocationSelect({
              lat: newLat,
              lng: newLng,
              mapUrl: pinGoogleUrl,
              address: geoResult.address,
              society: resolvedSociety || geoResult.society,
              road: geoResult.road,
              area: geoResult.area,
              city: geoResult.city || cityName,
              pincode: verifiedPin,
            });
          }
        } else {
          setStatusMessage(`Pinned at ${newLat.toFixed(4)}, ${newLng.toFixed(4)}`);
          if (onLocationSelect) {
            const fallbackPin = getGujaratPincode(areaName, cityName);
            onLocationSelect({
              lat: newLat,
              lng: newLng,
              mapUrl: pinGoogleUrl,
              address: address || `${newLat.toFixed(5)}, ${newLng.toFixed(5)}`,
              city: cityName,
              area: areaName,
              pincode: fallbackPin,
            });
          }
        }
      } catch (err) {
        console.error("Reverse geocoding error:", err);
        setStatusMessage("Location pinned!");
      } finally {
        setTimeout(() => setStatusMessage(""), 4500);
      }
    },
    [onLocationSelect, cityName, areaName, address]
  );

  // Confirm exact location action
  const handleConfirmLocation = () => {
    setIsLocationConfirmed(true);
    setStatusMessage(`✓ Exact location confirmed: ${currentCoords.lat.toFixed(5)}, ${currentCoords.lng.toFixed(5)}`);
    if (onLocationSelect) {
      onLocationSelect({
        lat: currentCoords.lat,
        lng: currentCoords.lng,
        isConfirmed: true,
      });
    }
  };

  // Load Leaflet dynamically
  useEffect(() => {
    let isCancelled = false;

    const loadLeaflet = async () => {
      try {
        // 1. Inject Leaflet CSS
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        // 2. Inject Leaflet JS
        if (!window.L) {
          await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => {
              console.warn("Leaflet CDN load failed or blocked");
              resolve();
            };
            document.body.appendChild(script);
          });
        }

        if (isCancelled || !mapContainerRef.current || !window.L) return;

        const L = window.L;

        // Clean up previous instance if any
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove();
          } catch (e) {}
          mapInstanceRef.current = null;
        }

        // Prevent Leaflet "Map container is already initialized" crash
        if (mapContainerRef.current._leaflet_id) {
          delete mapContainerRef.current._leaflet_id;
        }

        // Create Map instance
        const map = L.map(mapContainerRef.current, {
          center: [currentCoords.lat, currentCoords.lng],
          zoom: 16,
          zoomControl: false,
        });

        L.control.zoom({ position: "bottomright" }).addTo(map);

        // Define Tile Layers
        const layers = {
          google: L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
            maxZoom: 20,
            attribution: "© Google Maps",
          }),
          satellite: L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
            maxZoom: 20,
            attribution: "© Google Satellite Hybrid",
          }),
          osm: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap contributors",
          }),
        };

        tileLayerRef.current = layers;
        layers[activeLayer].addTo(map);

        // Custom animated pin icon
        const pinIcon = L.divIcon({
          className: "custom-interactive-pin",
          html: `
            <div class="interactive-pin-wrapper">
              <div class="interactive-pin-ripple"></div>
              <div class="interactive-pin-core">
                <svg viewBox="0 0 24 24" width="38" height="38" fill="#dc2626" stroke="#ffffff" stroke-width="1.8" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.45))">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.8" fill="#ffffff"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [38, 44],
          iconAnchor: [19, 40],
          popupAnchor: [0, -38],
        });

        // Add draggable pin marker
        const marker = L.marker([currentCoords.lat, currentCoords.lng], {
          icon: pinIcon,
          draggable: true,
          autoPan: true,
        }).addTo(map);

        marker.bindPopup(
          `<div style="font-family: inherit; font-size: 13px; line-height: 1.4; color: #1e293b;">
            <strong style="color: #dc2626;">📍 Property Location Marked</strong>
            <div style="font-size: 11.5px; color: #64748b; margin-top: 2px;">
              ${address || "Drag pin or click map to adjust exact point"}
            </div>
          </div>`
        );

        // Event: Marker dragged
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          handlePinMoved(pos.lat, pos.lng);
        });

        // Event: Click map to reposition pin
        map.on("click", (e) => {
          const { lat: clickLat, lng: clickLng } = e.latlng;
          marker.setLatLng([clickLat, clickLng]);
          handlePinMoved(clickLat, clickLng);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
        setMapLoaded(true);

        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 250);
      } catch (err) {
        console.warn("Leaflet map initialization non-fatal error:", err);
      }
    };

    loadLeaflet();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Tile Layer
  const handleLayerSwitch = (newLayer) => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const map = mapInstanceRef.current;
    const layers = tileLayerRef.current;

    Object.values(layers).forEach((layer) => {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    });

    layers[newLayer].addTo(map);
    setActiveLayer(newLayer);
  };

  // Select suggestion from autocomplete
  const handleSelectSuggestion = (s) => {
    setShowSuggestions(false);
    setSearchQuery(s.title || s.address);
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([s.lat, s.lng], 17, { animate: true, duration: 1 });
      markerRef.current.setLatLng([s.lat, s.lng]);
    }
    handlePinMoved(s.lat, s.lng, s.society || s.title);
  };

  // Master Google Maps Resolver (Handles Links, Coordinates, or Place names)
  const handleResolveGoogleMapsInput = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    if (!searchQuery.trim()) return;

    setShowSuggestions(false);
    setSearching(true);
    setStatusMessage(`Resolving Google Maps location for "${searchQuery}"...`);

    try {
      const res = await parseGoogleMapsInput(searchQuery, cityName);
      if (res && res.lat && res.lng) {
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.flyTo([res.lat, res.lng], 17, { animate: true, duration: 1 });
          markerRef.current.setLatLng([res.lat, res.lng]);
        }
        handlePinMoved(res.lat, res.lng, res.placeName || res.society);
        setStatusMessage(`✓ Exact location pinned: ${res.society || res.address}`);
      } else {
        setStatusMessage(`Could not resolve "${searchQuery}". Try pasting exact Google Maps link or coordinates.`);
      }
    } catch (err) {
      console.error("Map search error:", err);
      setStatusMessage("Failed to resolve location. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  // Direct numeric Lat/Lng change
  const handleManualCoordsChange = (field, val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    const newCoords = {
      ...currentCoords,
      [field]: num,
    };
    setCurrentCoords(newCoords);
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([newCoords.lat, newCoords.lng]);
      mapInstanceRef.current.panTo([newCoords.lat, newCoords.lng]);
    }
    handlePinMoved(newCoords.lat, newCoords.lng);
  };

  // Detect current GPS location
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setStatusMessage("Detecting your exact GPS location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.flyTo([userLat, userLng], 18, { animate: true, duration: 1.2 });
          markerRef.current.setLatLng([userLat, userLng]);
        }
        handlePinMoved(userLat, userLng);
        setIsLocating(false);
      },
      (err) => {
        console.error("GPS error:", err);
        setStatusMessage("Could not retrieve GPS location. Check browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const directGoogleMapsUrl = getGoogleMapsUrl(currentCoords.lat, currentCoords.lng, address);
  const openExternalMapsUrl = getDirectGoogleMapsOpenUrl(cityName, areaName, currentCoords.lat, currentCoords.lng);

  return (
    <div className="interactive-map-picker-card">
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: DIRECT GOOGLE MAPS PRO RESOLVER TOOLBAR */}
      {/* ------------------------------------------------------------- */}
      <div className="google-maps-master-toolbar">
        <div className="google-maps-toolbar-top">
          <div className="google-maps-brand-pill">
            <span className="google-icon-dot"></span>
            <strong>Google Maps Location Hub</strong>
          </div>

          <div className="google-maps-toolbar-actions">
            {/* Open Google Maps Button */}
            <a
              href={openExternalMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="google-action-btn external-maps-btn"
              title="Open Google Maps in a new tab to find the exact point"
            >
              <ExternalLink size={13} />
              <span>Open in Google Maps ↗</span>
            </a>

            {/* GPS Locate Button */}
            <button
              type="button"
              className="google-action-btn gps-btn"
              onClick={handleDetectGPS}
              disabled={isLocating}
              title="Detect my device current GPS location"
            >
              {isLocating ? <Loader2 size={13} className="animate-spin" /> : <Navigation size={13} />}
              <span>Use Current Location</span>
            </button>

            {/* How to pin tooltip trigger */}
            <button
              type="button"
              className="google-action-btn help-tip-btn"
              onClick={() => setShowHelpTip(!showHelpTip)}
              title="How to get exact pin from Google Maps"
            >
              <HelpCircle size={13} />
              <span>Exact Pin Guide</span>
            </button>
          </div>
        </div>

        {/* Helper Guide Banner */}
        {showHelpTip && (
          <div className="google-pin-guide-banner">
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <Compass size={16} style={{ color: "#2563eb", flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "12px", color: "#1e293b", lineHeight: 1.5 }}>
                <strong>How to get 100% exact pin from Google Maps:</strong>
                <ol style={{ margin: "4px 0 0", paddingLeft: "18px" }}>
                  <li>Click <strong>Open in Google Maps ↗</strong> above.</li>
                  <li>Search or zoom into your exact society, building, or plot.</li>
                  <li><strong>Right-click</strong> directly on the building/plot on Google Maps.</li>
                  <li>Click on the <strong>coordinates</strong> (e.g. <code>23.0338, 72.5850</code>) at the top of the menu to copy them.</li>
                  <li>Paste the coordinates or the link into the box below and click <strong>Pin on Map</strong>!</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Master Input for Link / Coordinates / Society search */}
        <div className="google-resolver-input-row" ref={searchWrapRef}>
          <div className="google-resolver-input-wrap">
            <Search size={15} className="google-input-icon" />
            <input
              type="text"
              placeholder={`Paste Google Maps Link, Coordinates (e.g. 23.0338, 72.5850), or Society name in ${cityName}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleResolveGoogleMapsInput(e);
                }
              }}
              className="google-resolver-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="google-input-clear-btn"
                onClick={() => {
                  setSearchQuery("");
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
              >
                ✕
              </button>
            )}

            {/* Live Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="map-search-suggestions">
                {suggestions.map((s, idx) => (
                  <div
                    key={`${s.lat}-${s.lng}-${idx}`}
                    className="map-suggestion-item"
                    onClick={() => handleSelectSuggestion(s)}
                  >
                    <MapPin size={14} style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="map-suggestion-title">{s.title}</div>
                      <div className="map-suggestion-sub">{s.subtitle || s.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleResolveGoogleMapsInput}
            disabled={searching}
            className="google-resolve-btn"
          >
            {searching ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
            <span>Pin on Map</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: MAP VIEW TABS & LAYER SWITCHER */}
      {/* ------------------------------------------------------------- */}
      <div className="interactive-map-subtoolbar">
        <div className="map-view-switch-tabs">
          <button
            type="button"
            className={`map-view-tab-btn ${viewMode === "interactive" ? "active" : ""}`}
            onClick={() => {
              setViewMode("interactive");
              setTimeout(() => {
                if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
              }, 150);
            }}
          >
            <MapPin size={13} />
            <span>Interactive Pin Canvas</span>
          </button>
          <button
            type="button"
            className={`map-view-tab-btn ${viewMode === "google-embed" ? "active" : ""}`}
            onClick={() => setViewMode("google-embed")}
          >
            <Globe size={13} />
            <span>Direct Google Map View</span>
          </button>
        </div>

        {viewMode === "interactive" && (
          <div className="map-layer-selector">
            <button
              type="button"
              className={`layer-btn ${activeLayer === "google" ? "active" : ""}`}
              onClick={() => handleLayerSwitch("google")}
              title="Google Roads Layer"
            >
              Google Road
            </button>
            <button
              type="button"
              className={`layer-btn ${activeLayer === "satellite" ? "active" : ""}`}
              onClick={() => handleLayerSwitch("satellite")}
              title="Google Satellite Hybrid"
            >
              Satellite
            </button>
            <button
              type="button"
              className={`layer-btn ${activeLayer === "osm" ? "active" : ""}`}
              onClick={() => handleLayerSwitch("osm")}
              title="OpenStreetMap Layer"
            >
              OSM
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: MAP CANVAS / DIRECT GOOGLE EMBED */}
      {/* ------------------------------------------------------------- */}
      <div className="interactive-map-canvas-wrap">
        {/* Leaflet Canvas */}
        <div
          ref={mapContainerRef}
          className="interactive-map-canvas"
          style={{ display: viewMode === "interactive" ? "block" : "none" }}
        />

        {/* Direct Google Maps Iframe Embed */}
        {viewMode === "google-embed" && (
          <div className="direct-google-maps-embed-wrap">
            <iframe
              title="Direct Google Maps Point View"
              src={getGoogleMapsEmbedUrl(currentCoords.lat, currentCoords.lng)}
              className="google-maps-embed-frame"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        {/* Floating status pill */}
        {statusMessage && (
          <div className="map-floating-status">
            <span className="status-dot"></span>
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Interactive pin instruction banner */}
        {viewMode === "interactive" && (
          <div className="map-pin-help-banner">
            <MapPin size={13} style={{ color: "#dc2626" }} />
            <span>
              <strong>Exact Pin Point:</strong> Click anywhere on the map or drag the red pin to set the exact property coordinates.
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 4: EXACT COORDINATES & DIRECT GOOGLE MAPS LINK */}
      {/* ------------------------------------------------------------- */}
      <div className="interactive-map-footer-rebuilt">
        <div className="map-coords-inputs-group">
          <div className="coord-field">
            <span className="coord-label">Latitude:</span>
            <input
              type="number"
              step="0.000001"
              className="coord-input"
              value={currentCoords.lat}
              onChange={(e) => handleManualCoordsChange("lat", e.target.value)}
            />
          </div>
          <div className="coord-field">
            <span className="coord-label">Longitude:</span>
            <input
              type="number"
              step="0.000001"
              className="coord-input"
              value={currentCoords.lng}
              onChange={(e) => handleManualCoordsChange("lng", e.target.value)}
            />
          </div>
        </div>

        <div className="map-footer-direct-actions">
          {/* Confirm Exact Location Button */}
          <button
            type="button"
            className={`map-confirm-location-btn ${isLocationConfirmed ? "confirmed" : ""}`}
            onClick={handleConfirmLocation}
            title="Lock current pin as the verified exact property coordinates"
          >
            <Check size={14} />
            <span>{isLocationConfirmed ? "✓ Location Confirmed" : "Confirm Exact Location"}</span>
          </button>

          <button
            type="button"
            className="map-footer-copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(directGoogleMapsUrl);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            title="Copy exact Google Maps link to clipboard"
          >
            {copiedLink ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedLink ? "Copied!" : "Copy Google Link"}</span>
          </button>

          <a
            href={directGoogleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="map-external-google-link"
            title="Open exact marked point in Google Maps"
          >
            <ExternalLink size={13} />
            <span>Open in Google Maps ↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
