"use client";

import { useEffect, useRef, useState } from "react";
import { GUJARAT_CITY_COORDS } from "@/app/lib/geocoding";
import { RotateCcw, Layers, MapPin, Plus, Minus } from "lucide-react";

const MAP_LAYERS = {
  google: {
    name: "Google Map",
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: "&copy; Google Maps",
    maxZoom: 20,
  },
  satellite: {
    name: "Satellite",
    url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    attribution: "&copy; Google Satellite Hybrid",
    maxZoom: 20,
  },
  osm: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
  },
};

/**
 * Resolves real, accurate geographic positions for all property pins.
 * - ALWAYS keeps every marker in its true physical neighborhood & city.
 * - If multiple properties share identical/near-identical coordinates (distance < 0.0006 degrees ~ 60m),
 *   it applies a subtle micro-offset of 0.0012 to 0.0016 degrees (~120-160 meters on the ground in that SAME area)
 *   so that pins do not completely occlude each other.
 * - NEVER displaces pins across cities or states!
 */
function resolveAccurateMarkerPositions(props, L) {
  if (!props || props.length === 0 || !L) return [];

  // Group by identical/near-identical geographic coordinates (< 0.0006 degrees ~ 60m)
  const groups = [];
  props.forEach((prop, idx) => {
    let lat = Number(prop.lat);
    let lng = Number(prop.lng);
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

    let matchedGroup = null;
    for (const g of groups) {
      const dLat = Math.abs(g.baseLat - lat);
      const dLng = Math.abs(g.baseLng - lng);
      if (dLat < 0.0006 && dLng < 0.0006) {
        matchedGroup = g;
        break;
      }
    }

    if (matchedGroup) {
      matchedGroup.items.push({ ...prop, originalIndex: idx });
    } else {
      groups.push({
        baseLat: lat,
        baseLng: lng,
        items: [{ ...prop, originalIndex: idx }],
      });
    }
  });

  const results = [];
  groups.forEach((g) => {
    const count = g.items.length;
    if (count === 1) {
      results.push({
        ...g.items[0],
        renderLatLng: L.latLng(g.baseLat, g.baseLng),
      });
    } else {
      // Disperse co-located properties along adjacent street plots (~120-160m max in the same neighborhood)
      const radiusDeg = 0.0013;
      g.items.forEach((item, idx) => {
        const angle = (2 * Math.PI * idx) / count;
        const latOffset = Math.sin(angle) * radiusDeg;
        const lngOffset = Math.cos(angle) * radiusDeg * 1.08;

        results.push({
          ...item,
          renderLatLng: L.latLng(g.baseLat + latOffset, g.baseLng + lngOffset),
        });
      });
    }
  });

  return results;
}

export default function PropertyMap({
  properties = [],
  selectedPropertyId = null,
  onSelectProperty,
  centerCity = "Surat",
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({});
  const [mapType, setMapType] = useState("google"); // 'google' | 'satellite' | 'osm'
  const [mapReady, setMapReady] = useState(false);

  // Initialize Leaflet Map once
  useEffect(() => {
    let isCancelled = false;
    let resizeObserver = null;

    const loadLeaflet = async () => {
      try {
        // 1. Inject Leaflet CSS if not already present
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        // 2. Load Leaflet (dynamic import with CDN fallback)
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
              document.head.appendChild(script);
            });
            L = window.L;
          }
        }

        if (isCancelled || !mapContainerRef.current || !L) return;

        // Clean existing map instance
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove();
          } catch (e) { }
          mapInstanceRef.current = null;
        }

        // Clear _leaflet_id to avoid "Map container is already initialized"
        if (mapContainerRef.current._leaflet_id) {
          delete mapContainerRef.current._leaflet_id;
        }

        // Determine initial center
        const defaultCoord = GUJARAT_CITY_COORDS[centerCity] || GUJARAT_CITY_COORDS.Surat;
        let centerLat = defaultCoord.lat;
        let centerLng = defaultCoord.lng;

        if (properties.length > 0 && properties[0].lat && properties[0].lng) {
          centerLat = properties[0].lat;
          centerLng = properties[0].lng;
        }

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 12,
          scrollWheelZoom: true,
          zoomControl: false,
        });

        // Add Tile Layer
        const cfg = MAP_LAYERS[mapType] || MAP_LAYERS.google;
        const tileLayer = L.tileLayer(cfg.url, {
          attribution: cfg.attribution,
          maxZoom: cfg.maxZoom,
        }).addTo(map);

        tileLayerRef.current = tileLayer;
        mapInstanceRef.current = map;
        setMapReady(true);

        // Attach ResizeObserver to automatically invalidate size when container dimensions change
        if (typeof ResizeObserver !== "undefined" && mapContainerRef.current) {
          resizeObserver = new ResizeObserver(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.invalidateSize();
            }
          });
          resizeObserver.observe(mapContainerRef.current);
        }

        // Initial invalidation passes
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);

        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 400);
      } catch (err) {
        console.warn("PropertyMap initialization warning:", err);
      }
    };

    loadLeaflet();

    return () => {
      isCancelled = true;
      if (resizeObserver) {
        try {
          resizeObserver.disconnect();
        } catch (e) { }
      }
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) { }
        mapInstanceRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Handle Dynamic Tile Switching without recreating map
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;
    const cfg = MAP_LAYERS[mapType] || MAP_LAYERS.google;

    if (tileLayerRef.current) {
      try {
        map.removeLayer(tileLayerRef.current);
      } catch (e) { }
    }

    const newLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom,
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [mapType, mapReady]);

  // Update Markers when properties change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => {
      try {
        m.remove();
      } catch (e) { }
    });
    markersRef.current = {};

    if (!properties || properties.length === 0) return;

    // Function to calculate accurate positions and place/update pins
    const renderMarkers = () => {
      const resolvedProps = resolveAccurateMarkerPositions(properties, L);

      resolvedProps.forEach((prop) => {
        let marker = markersRef.current[String(prop.id)];

        if (!marker) {
          const isSelected = Boolean(selectedPropertyId && String(prop.id) === String(selectedPropertyId));

          // Custom DivIcon with Google Maps-style Dropped Pin Mark
          const icon = L.divIcon({
            className: "property-map-marker-container",
            html: `
              <div class="property-map-pin-mark ${isSelected ? "selected" : ""}" id="marker-pin-${prop.id}">
                <div class="pin-hover-badge">
                  <span>${prop.priceLabel || "View"}</span>
                </div>
                <div class="pin-mark-graphic">
                  <svg class="pin-mark-svg" width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path class="pin-mark-body" d="M15 1C7.268 1 1 7.268 1 15C1 24.5 15 37 15 37C15 37 29 24.5 29 15C29 7.268 22.732 1 15 1Z" fill="#ee705b" stroke="#ffffff" stroke-width="1.8"/>
                    <circle cx="15" cy="14.5" r="6.5" fill="#ffffff"/>
                    <path d="M15 10.5L11 14V18H13.5V15.5H16.5V18H19V14L15 10.5Z" fill="#ee705b"/>
                  </svg>
                </div>
              </div>
            `,
            iconSize: [30, 38],
            iconAnchor: [15, 38],
            popupAnchor: [0, -38],
          });

          marker = L.marker(prop.renderLatLng, {
            icon,
            zIndexOffset: isSelected ? 20000 : 0,
          }).addTo(map);

          // On mouseover, bring to front so it never gets obscured
          marker.on("mouseover", () => {
            marker.setZIndexOffset(10000);
          });
          marker.on("mouseout", () => {
            if (!selectedPropertyId || String(selectedPropertyId) !== String(prop.id)) {
              marker.setZIndexOffset(0);
            }
          });

          // Popup Content Card
          const popupHtml = `
            <div class="map-popup-card">
              <div class="map-popup-img" style="background-image: url('${prop.image}');"></div>
              <div class="map-popup-content">
                <div class="map-popup-price">${prop.priceLabel}</div>
                <h4 class="map-popup-title">${prop.name}</h4>
                <div class="map-popup-location">📍 ${prop.area}, ${prop.city}</div>
                <div class="map-popup-specs">
                  <span>${prop.bedrooms} BHK</span>
                  <span>•</span>
                  <span>${prop.bathrooms} Baths</span>
                  <span>•</span>
                  <span>${prop.size} sq.ft</span>
                </div>
                <a
                  href="/property/${prop.id}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="map-popup-action-btn"
                  style="display: block; text-align: center; background: #ee705b; color: #ffffff; padding: 7px 12px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 12px;"
                >
                  View Full Details ↗
                </a>
              </div>
            </div>
          `;

          marker.bindPopup(popupHtml, {
            className: "property-custom-popup",
            maxWidth: 270,
            autoPan: false,
          });

          // Pin Click Synchronizes with Left Cards
          marker.on("click", () => {
            if (onSelectProperty) {
              onSelectProperty(prop.id);
            }
          });

          markersRef.current[String(prop.id)] = marker;
        } else {
          marker.setLatLng(prop.renderLatLng);
        }
      });
    };

    // Calculate bounds using real geographic coordinates
    const bounds = properties
      .filter((p) => p.lat && p.lng && !isNaN(p.lat) && !isNaN(p.lng))
      .map((p) => [Number(p.lat), Number(p.lng)]);

    if (bounds.length > 1 && !selectedPropertyId) {
      try {
        map.fitBounds(bounds, {
          paddingTopLeft: [70, 85], // extra room for header controls
          paddingBottomRight: [70, 65], // extra room for bottom tips
          maxZoom: 13,
        });
      } catch (e) { }
    } else if (bounds.length === 1 && !selectedPropertyId) {
      map.setView(bounds[0], 13);
    }

    // Initial render of markers
    renderMarkers();

    // Invalidate size on markers change and refresh positions
    const t1 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        renderMarkers();
      }
    }, 150);

    const t2 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        renderMarkers();
      }
    }, 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [properties, mapReady]);

  // Synchronize Map when selectedPropertyId changes (Card hover/click -> Map Pin & Pan)
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // When no property is selected, clear all pin highlights and close any popup
    if (!selectedPropertyId) {
      properties.forEach((prop) => {
        const pinEl = document.getElementById(`marker-pin-${prop.id}`);
        if (pinEl) {
          pinEl.classList.remove("selected");
        }
        const m = markersRef.current[String(prop.id)];
        if (m) m.setZIndexOffset(0);
      });
      try {
        map.closePopup();
      } catch (e) { }
      return;
    }

    const targetMarker = markersRef.current[String(selectedPropertyId)];

    // Update all pins' CSS classes
    properties.forEach((prop) => {
      const pinEl = document.getElementById(`marker-pin-${prop.id}`);
      const m = markersRef.current[String(prop.id)];
      if (pinEl) {
        if (String(prop.id) === String(selectedPropertyId)) {
          pinEl.classList.add("selected");
          if (m) m.setZIndexOffset(100000);
        } else {
          pinEl.classList.remove("selected");
          if (m) m.setZIndexOffset(0);
        }
      }
    });

    if (targetMarker) {
      targetMarker.setZIndexOffset(100000);
      const latLng = targetMarker.getLatLng();
      if (!map.getBounds().contains(latLng)) {
        map.panTo(latLng, { animate: true, duration: 0.35 });
      }
      targetMarker.openPopup();
    }
  }, [selectedPropertyId, mapReady, properties]);

  // Reset view to encompass all current properties
  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    const bounds = properties
      .filter((p) => p.lat && p.lng && !isNaN(p.lat) && !isNaN(p.lng))
      .map((p) => [Number(p.lat), Number(p.lng)]);

    if (bounds.length > 1) {
      mapInstanceRef.current.fitBounds(bounds, {
        paddingTopLeft: [70, 85],
        paddingBottomRight: [70, 65],
        maxZoom: 13,
      });
    } else if (bounds.length === 1) {
      mapInstanceRef.current.setView(bounds[0], 13);
    } else {
      const defaultCoord = GUJARAT_CITY_COORDS[centerCity] || GUJARAT_CITY_COORDS.Surat;
      mapInstanceRef.current.setView([defaultCoord.lat, defaultCoord.lng], 12);
    }
  };

  const handleToggleMapType = () => {
    setMapType((prev) => (prev === "google" ? "satellite" : prev === "satellite" ? "osm" : "google"));
  };

  const handleZoomIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="property-map-wrapper">
      <div ref={mapContainerRef} className="property-map-canvas" />

      {/* Floating Header Controls */}
      <div className="property-map-overlay-header">
        <div className="property-map-badge">
          <MapPin size={14} color="#ee705b" />
          <span>Interactive Gujarat Map ({properties.length} Pins)</span>
        </div>

        <div className="property-map-controls">
          <button
            type="button"
            className="property-map-btn"
            onClick={handleResetView}
            title="Reset map view to show all properties"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            className="property-map-btn"
            onClick={handleToggleMapType}
            title="Toggle map style"
          >
            <Layers size={13} />
            <span>{MAP_LAYERS[mapType]?.name || "Google Map"}</span>
          </button>
        </div>
      </div>

      {/* Floating Zoom Controls (Right Side - no overlap with top-left badge and no page scroll jump) */}
      <div className="property-map-zoom-controls">
        <button
          type="button"
          className="property-map-zoom-btn"
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
        >
          <Plus size={16} />
        </button>
        <div className="property-map-zoom-divider" />
        <button
          type="button"
          className="property-map-zoom-btn"
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <Minus size={16} />
        </button>
      </div>

      {/* Helper Guidance Tip */}
      <div className="property-map-tip">
        <span>📍 Hover card to highlight pin &bull; Click pin to scroll card &bull; All {properties.length} properties displayed</span>
      </div>
    </div>
  );
}
