"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PropertyCard from "@/app/components/PropertyCard";
import PropertyMap from "@/app/components/PropertyMap";
import SoftSandSelect from "@/app/components/SoftSandSelect";
import { fetchEnrichedProperties } from "@/app/lib/propertiesData";
import {
  Search,
  ChevronDown,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  List,
  Map as MapIcon,
  Sparkles,
  Building,
} from "lucide-react";
import "./property-listing.css";

const GUJARAT_CITIES = [
  "Surat",
  "Ahmedabad",
  "Vadodara",
  "Rajkot",
  "Gandhinagar",
  "Bhavnagar",
  "Jamnagar",
  "Junagadh",
  "Anand",
  "Nadiad",
  "Bharuch",
  "Vapi",
  "Mehsana",
  "Morbi",
  "Bhuj",
  "Navsari",
];

const GUJARAT_CITY_AREAS = {
  Surat: ["Vesu", "Adajan", "Pal", "Katargam", "Varachha", "Althan", "Piplod", "City Light", "Singanpor", "Amroli", "Mota Varachha", "Dumas Road", "Nanpura"],
  Ahmedabad: ["Bodakdev", "Sindhu Bhavan Road", "Prahlad Nagar", "SG Highway", "Satellite", "Ambli", "Vastrapur", "Thaltej", "Bopal", "Science City", "Navrangpura", "Gota"],
  Vadodara: ["Alkapuri", "Vasna-Bhayli", "Gotri", "Sayajigunj", "Karelibaug", "Akota", "Old Padra Road", "Manjalpur"],
  Rajkot: ["Kalawad Road", "Yagnik Road", "University Road", "Nana Mava", "150 Feet Ring Road", "Raiya Road", "Amin Marg"],
  Gandhinagar: ["Kudasan", "GIFT City Road", "Infocity", "Raysan", "Sargasan", "Sector 8", "Sector 21", "Vavol"],
};

const MODE_PROPERTY_TYPES = {
  buy: [
    "Apartment",
    "Independent House",
    "Villa/Bungalow",
    "Plot/Land",
    "Commercial Property",
  ],
  rent: [
    "Apartment",
    "Independent House",
    "Villa/Bungalow",
    "Studio",
    "Room",
    "Commercial Property",
  ],
  "short-term": [
    "Studio",
    "Furnished Apartment",
    "Serviced Apartment",
    "Villa",
    "Holiday Home",
    "Private Room",
  ],
};

const SORT_OPTIONS = [
  { value: "Popularity", label: "Popularity" },
  { value: "Recent added", label: "Recent added" },
  { value: "Highest price", label: "Highest price" },
  { value: "Lowest price", label: "Lowest price" },
  { value: "Square meters", label: "Square meters" },
  { value: "Building age", label: "Building age" },
];

function matchesPropertyType(item, selectedType) {
  if (!selectedType || selectedType === "All") return true;

  const target = selectedType.toLowerCase().trim();
  const propType = (item.type || "").toLowerCase().trim();
  const propName = (item.name || "").toLowerCase();
  const propDesc = (item.description || "").toLowerCase();

  if (propType === target) return true;

  if (target === "villa/bungalow") {
    return propType.includes("villa") || propType.includes("bungalow");
  }

  if (target === "independent house") {
    return (
      propType.includes("house") ||
      propType.includes("bungalow") ||
      propType.includes("home") ||
      propType.includes("row house") ||
      propType.includes("independent")
    );
  }

  if (target === "plot/land") {
    return propType.includes("plot") || propType.includes("land");
  }

  if (target === "commercial property") {
    return (
      propType.includes("commercial") ||
      propType.includes("office") ||
      propType.includes("shop") ||
      propType.includes("retail")
    );
  }

  if (target === "furnished apartment") {
    const isApt = propType.includes("apartment") || propType.includes("flat") || propType.includes("penthouse");
    const isFurnished =
      (item.unitDetails?.furnishing || "").toLowerCase().includes("furnished") ||
      propDesc.includes("furnished");
    return isApt || isFurnished;
  }

  if (target === "serviced apartment") {
    return (
      propType.includes("serviced") ||
      propDesc.includes("serviced") ||
      propType.includes("apartment") ||
      propType.includes("flat")
    );
  }

  if (target === "holiday home") {
    return (
      propType.includes("holiday") ||
      propType.includes("home") ||
      propType.includes("villa") ||
      propType.includes("cottage") ||
      propDesc.includes("stay") ||
      propDesc.includes("resort")
    );
  }

  if (target === "private room" || target === "room") {
    return (
      propType.includes("room") ||
      propName.includes("room") ||
      propDesc.includes("room") ||
      item.bedrooms === 1
    );
  }

  if (target === "studio") {
    return (
      propType.includes("studio") ||
      propName.includes("studio") ||
      propDesc.includes("studio") ||
      item.bedrooms === 1
    );
  }

  if (target === "apartment") {
    return (
      propType.includes("apartment") ||
      propType.includes("flat") ||
      propType.includes("penthouse")
    );
  }

  if (target === "villa") {
    return propType.includes("villa");
  }

  return propType.includes(target) || target.includes(propType);
}

export default function PropertyListing({ mode = "buy" }) {
  return (
    <Suspense fallback={<div className="property-listing-page"><div style={{ padding: "40px", textAlign: "center" }}>Loading properties...</div></div>}>
      <PropertyListingContent mode={mode} />
    </Suspense>
  );
}

function PropertyListingContent({ mode = "buy" }) {
  const searchParams = useSearchParams();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedBhk, setSelectedBhk] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("Popularity");

  // View States
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [showMap, setShowMap] = useState(true); // Default ON
  const [mobileView, setMobileView] = useState("list"); // 'list' | 'map'

  // Active type options depending on page mode (buy, rent, short-term)
  const activeTypeOptions = useMemo(() => {
    return MODE_PROPERTY_TYPES[mode] || MODE_PROPERTY_TYPES.buy;
  }, [mode]);

  // Pre-fill from URL query params (e.g. from homepage search widget)
  useEffect(() => {
    const qCity = searchParams.get("city");
    const qBedrooms = searchParams.get("bedrooms");
    const qPriceMin = searchParams.get("priceMin");
    const qPriceMax = searchParams.get("priceMax");
    const qType = searchParams.get("type");

    if (qCity) setSelectedCity(qCity);
    if (qBedrooms) setSelectedBhk(qBedrooms);
    if (qType) setSelectedType(qType);
    if (qPriceMin || qPriceMax) {
      if (qPriceMin && !qPriceMax) setSelectedPriceRange(`${qPriceMin}+`);
      else if (qPriceMin && qPriceMax) setSelectedPriceRange(`${qPriceMin}-${qPriceMax}`);
    }
  }, [searchParams]);

  // Load properties and ensure window is at top
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    let isCancelled = false;
    async function loadData() {
      setLoading(true);
      const data = await fetchEnrichedProperties(mode);
      if (!isCancelled) {
        setProperties(data || []);
        // No property selected by default!
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isCancelled = true;
    };
  }, [mode]);

  // Price range options tailored to listing mode
  const priceOptions = useMemo(() => {
    if (mode === "rent") {
      return [
        { label: "Any Budget", value: "" },
        { label: "Under ₹25k / mo", value: "0-25000" },
        { label: "₹25k – ₹50k / mo", value: "25000-50000" },
        { label: "₹50k – ₹1L / mo", value: "50000-100000" },
        { label: "₹1L+ / mo", value: "100000+" },
      ];
    }
    if (mode === "short-term") {
      return [
        { label: "Any Budget", value: "" },
        { label: "Under ₹3k / night", value: "0-3000" },
        { label: "₹3k – ₹6k / night", value: "3000-6000" },
        { label: "₹6k – ₹10k / night", value: "6000-10000" },
        { label: "₹10k+ / night", value: "10000+" },
      ];
    }
    return [
      { label: "Any Budget", value: "" },
      { label: "Under ₹50 Lakh", value: "0-5000000" },
      { label: "₹50 L – ₹1 Cr", value: "5000000-10000000" },
      { label: "₹1 Cr – ₹2.5 Cr", value: "10000000-25000000" },
      { label: "₹2.5 Cr – ₹5 Cr", value: "25000000-50000000" },
      { label: "₹5 Cr+", value: "50000000+" },
    ];
  }, [mode]);

  // Parse price range helper
  const parsedPriceRange = useMemo(() => {
    if (!selectedPriceRange) return [0, Infinity];
    if (selectedPriceRange.endsWith("+")) {
      return [Number(selectedPriceRange.slice(0, -1)), Infinity];
    }
    const [min, max] = selectedPriceRange.split("-").map(Number);
    return [min ?? 0, max ?? Infinity];
  }, [selectedPriceRange]);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    if (!properties || !Array.isArray(properties)) return [];
    return properties.filter((item) => {
      // 1. Text Search (title, locality, dealer name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesCity = item.city?.toLowerCase().includes(q);
        const matchesArea = item.area?.toLowerCase().includes(q);
        const matchesDealer = item.dealer?.name?.toLowerCase().includes(q);
        const matchesPincode = String(item.pincode || "").includes(q);
        if (!matchesName && !matchesCity && !matchesArea && !matchesDealer && !matchesPincode) {
          return false;
        }
      }

      // 2. City
      if (selectedCity && item.city?.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // 3. Area
      if (selectedArea && item.area?.toLowerCase() !== selectedArea.toLowerCase()) {
        return false;
      }

      // 4. BHK
      if (selectedBhk) {
        if (selectedBhk === "4" || selectedBhk === "4+") {
          if (item.bedrooms < 4) return false;
        } else {
          if (item.bedrooms !== Number(selectedBhk)) return false;
        }
      }

      // 5. Price
      if (selectedPriceRange) {
        const [min, max] = parsedPriceRange;
        if (item.price < min || item.price > max) return false;
      }

      // 6. Type
      if (!matchesPropertyType(item, selectedType)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "Lowest price") {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === "Highest price") {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === "Square meters") {
        return (b.size || 0) - (a.size || 0);
      }
      if (sortBy === "Recent added") {
        const aIsNew = a.unitDetails?.age?.toLowerCase().includes("brand new") || a.tag === "Trending";
        const bIsNew = b.unitDetails?.age?.toLowerCase().includes("brand new") || b.tag === "Trending";
        if (aIsNew && !bIsNew) return -1;
        if (!aIsNew && bIsNew) return 1;
        return String(b.id).localeCompare(String(a.id));
      }
      if (sortBy === "Building age") {
        const getAgeScore = (item) => {
          const ageStr = (item.unitDetails?.age || "").toLowerCase();
          if (ageStr.includes("brand new") || ageStr.includes("under construction")) return 0;
          const match = ageStr.match(/\d+/);
          return match ? Number(match[0]) : 5;
        };
        return getAgeScore(a) - getAgeScore(b);
      }

      // Default: Popularity
      const aTrending = a.tag === "Trending" || a.tag === "Popular" || String(a.id).startsWith("trend-");
      const bTrending = b.tag === "Trending" || b.tag === "Popular" || String(b.id).startsWith("trend-");

      if (aTrending && !bTrending) return -1;
      if (!aTrending && bTrending) return 1;
      return 0;
    });
  }, [
    properties,
    searchQuery,
    selectedCity,
    selectedArea,
    selectedBhk,
    selectedPriceRange,
    parsedPriceRange,
    selectedType,
    sortBy,
  ]);

  // Handle map pin selection: scrolls corresponding card into view on left with full photo visible
  const handleMapPinSelect = useCallback((id) => {
    setSelectedPropertyId(id);
    const cardEl = document.getElementById(`property-card-${id}`);
    if (cardEl) {
      const scrollBody = cardEl.closest(".split-cards-scroll-body") || cardEl.closest(".split-cards-column");
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

      if (scrollBody && (isDesktop || scrollBody.scrollHeight > scrollBody.clientHeight)) {
        const bodyRect = scrollBody.getBoundingClientRect();
        const cardRect = cardEl.getBoundingClientRect();
        scrollBody.scrollTo({
          top: scrollBody.scrollTop + (cardRect.top - bodyRect.top) - 16,
          behavior: "smooth",
        });
      } else if (!isDesktop) {
        // Only scroll window on mobile where layout is stacked full-page
        const filterBar = document.querySelector(".listing-filter-bar");
        const navBar = document.querySelector(".topbar");
        const navHeight = navBar ? navBar.getBoundingClientRect().height : 82;
        const filterHeight = filterBar ? filterBar.getBoundingClientRect().height : 80;
        const totalHeaderOffset = navHeight + filterHeight + 20;

        const cardRect = cardEl.getBoundingClientRect();
        const targetScrollY = window.pageYOffset + cardRect.top - totalHeaderOffset;

        window.scrollTo({
          top: Math.max(0, targetScrollY),
          behavior: "smooth",
        });
      }
    }
  }, []);

  // Handle card hover & leave (only highlight when hovering!)
  const handleCardHover = useCallback((id) => {
    setSelectedPropertyId(id);
  }, []);

  const handleCardLeave = useCallback(() => {
    setSelectedPropertyId(null);
  }, []);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCity("");
    setSelectedArea("");
    setSelectedBhk("");
    setSelectedPriceRange("");
    setSelectedType("All");
    setSortBy("Popularity");
  };

  const hasActiveFilters = Boolean(
    searchQuery || selectedCity || selectedArea || selectedBhk || selectedPriceRange || (selectedType && selectedType !== "All")
  );

  const titlePrefix = mode === "buy" ? "Properties for Sale" : mode === "rent" ? "Properties for Rent" : "Short-term Stays";

  return (
    <main className="property-listing-page">
      {/* ======================================================================
          TOP FILTER & SEARCH BAR
          ====================================================================== */}
      <section className="listing-filter-bar">
        <div className="listing-filter-top-row">
          {/* Keyword Search */}
          <div className="listing-search-input-wrap">
            <Search size={18} className="listing-search-icon" />
            <input
              type="text"
              className="listing-search-input"
              placeholder="Search area, society, dealer name, or pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="listing-filter-controls-group">
            {/* Property Type Dropdown */}
            <div className="listing-select-wrap type-select-wrap">
              <SoftSandSelect
                className="listing-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="All">All Types</option>
                {activeTypeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </SoftSandSelect>
            </div>

            {/* City Dropdown */}
            <div className="listing-select-wrap">
              <SoftSandSelect
                className="listing-select"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedArea(""); // Reset area on city change
                }}
              >
                <option value="">All Cities (Gujarat)</option>
                {GUJARAT_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </SoftSandSelect>
            </div>

            {/* Area Dropdown (Dynamic) */}
            <div className="listing-select-wrap">
              <SoftSandSelect
                className="listing-select"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                disabled={!selectedCity || !(GUJARAT_CITY_AREAS[selectedCity] || []).length}
              >
                <option value="">
                  {selectedCity ? `All Areas in ${selectedCity}` : "Select City First"}
                </option>
                {(GUJARAT_CITY_AREAS[selectedCity] || []).map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </SoftSandSelect>
            </div>

            {/* Bedrooms Dropdown */}
            <div className="listing-select-wrap" style={{ minWidth: "115px" }}>
              <SoftSandSelect
                className="listing-select"
                value={selectedBhk}
                onChange={(e) => setSelectedBhk(e.target.value)}
              >
                <option value="">Any BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </SoftSandSelect>
            </div>

            {/* Price Range Dropdown */}
            <div className="listing-select-wrap price-select-wrap">
              <SoftSandSelect
                className="listing-select"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
              >
                {priceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </SoftSandSelect>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="clear-filters-btn"
                title="Reset all filters"
              >
                Reset
              </button>
            )}

            {/* Mobile View Toggle Buttons */}
            <div className="mobile-view-toggle">
              <button
                type="button"
                className={`mobile-toggle-btn ${mobileView === "list" ? "active" : ""}`}
                onClick={() => setMobileView("list")}
              >
                <List size={14} />
                <span>List</span>
              </button>
              <button
                type="button"
                className={`mobile-toggle-btn ${mobileView === "map" ? "active" : ""}`}
                onClick={() => {
                  setMobileView("map");
                  setShowMap(true);
                }}
              >
                <MapIcon size={14} />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SPLIT SCREEN CONTAINER: LEFT CARDS | RIGHT MAP
          ====================================================================== */}
      <section className="split-screen-container">
        {/* LEFT COLUMN: Scrollable Property Cards */}
        <div className={`split-cards-column ${!showMap ? "cards-full-width" : ""} ${mobileView === "map" ? "mobile-hide-list" : ""}`}>
          <div className="split-cards-header">
            <h2 className="split-cards-count-title">
              <span>{titlePrefix} </span>
              <span className="split-cards-title-city-group">
                <span>{selectedCity ? `in ${selectedCity}` : "across Gujarat"}</span>
                <span className="split-cards-count-badge">
                  {filteredProperties.length}
                </span>
              </span>
            </h2>

            {/* Right Header Actions: Sort By Dropdown & Show Map Toggle */}
            <div className="split-cards-header-actions">
              {/* Sort By Dropdown with Soft Sand Theme */}
              <div className="listing-sort-select-wrap">
                <SoftSandSelect
                  className="listing-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={SORT_OPTIONS}
                  aria-label="Sort properties"
                />
              </div>

              {/* Show Map Toggle Switch Button */}
              <div className="show-map-toggle-wrap">
                <button
                  type="button"
                  className={`show-map-toggle-btn ${showMap ? "active" : ""}`}
                  onClick={() => {
                    setShowMap((prev) => {
                      const next = !prev;
                      setMobileView(next ? "map" : "list");
                      return next;
                    });
                  }}
                  aria-pressed={showMap}
                  title={showMap ? "Hide Map" : "Show Map"}
                >
                  <MapIcon size={15} />
                  <span>Show Map</span>
                  <span className={`toggle-switch-pill ${showMap ? "on" : "off"}`}>
                    <span className="toggle-switch-circle" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Products Body with independent right-side scrollbar */}
          <div className="split-cards-scroll-body">
            {loading ? (
              <div style={{ padding: "60px 20px", textAlign: "center", color: "#77766f" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>⏳</div>
                <div>Loading real estate properties...</div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div style={{ padding: "60px 20px", textAlign: "center", background: "#ffffff", borderRadius: "16px", border: "1.5px dashed #d8d5cd" }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
                <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: "700" }}>No properties matched your criteria</h3>
                <p style={{ color: "#77766f", fontSize: "14px", margin: "0 0 16px 0" }}>
                  Try adjusting your city, area, price range, or BHK filter.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  style={{
                    background: "#1d1e1a",
                    color: "#ffffff",
                    padding: "8px 18px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="split-cards-grid">
                {filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    isSelected={Boolean(selectedPropertyId && String(prop.id) === String(selectedPropertyId))}
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardLeave}
                    onClick={handleCardHover}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Leaflet Google-Style Map */}
        {showMap && (
          <div className={`split-map-column ${mobileView === "list" ? "mobile-only-hide-map" : ""}`}>
            <PropertyMap
              properties={filteredProperties}
              selectedPropertyId={selectedPropertyId}
              onSelectProperty={handleMapPinSelect}
              centerCity={selectedCity || "Surat"}
            />
          </div>
        )}
      </section>
    </main>
  );
}
