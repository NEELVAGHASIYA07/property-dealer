"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  loginUser,
  getCities,
} from "@/app/lib/api";
import InteractiveMapPicker from "@/app/components/InteractiveMapPicker";
import PropertyDetailsDrawer from "./components/PropertyDetailsDrawer";
import { FALLBACK_PROPERTIES } from "@/app/lib/propertiesData";
import {
  searchLocation,
  reverseGeocode,
  getGoogleMapsUrl,
  getGoogleMapsPinUrl,
  resolvePropertyCoordinates,
  parseGoogleMapsInput,
  getGujaratPincode,
  getGujaratAreaForPincode,
  GUJARAT_PINCODE_AREAS,
  GUJARAT_AREA_PINCODES,
} from "@/app/lib/geocoding";
import "./admin.css";

import {
  Building2,
  Plus,
  Tag,
  Search,
  Filter,
  TrendingUp,
  Trash2,
  Edit3,
  ExternalLink,
  DollarSign,
  Home,
  Users,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldAlert,
  LogOut,
  LayoutGrid,
  List,
  Phone,
  MessageSquare,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
  Eye,
  RefreshCw,
  MoreHorizontal,
  Info,
  Check,
  UploadCloud,
  FileText,
  Camera,
  Navigation,
  CheckSquare,
  Square,
  Clock,
  ShieldCheck,
  FileCheck,
  Percent,
} from "lucide-react";

// Preset luxury photos for quick property creation
const PRESET_PHOTOS = [
  { label: "Modern Luxury Villa", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85" },
  { label: "High-Rise Penthouse", url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85" },
  { label: "Serene Garden Bungalow", url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85" },
  { label: "Contemporary Apartment", url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=85" },
  { label: "Grand Estate Villa", url: "https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=1000&q=85" },
  { label: "Coastal Vacation Villa", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=85" },
];

// Preset broker avatars for dealer information section
const DEALER_PRESET_AVATARS = [
  {
    name: "Rahul Patel",
    url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Priya Shah",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Amit Mehta",
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Neha Desai",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },
];

const GUJARAT_CITY_AREAS = {
  Ahmedabad: [
    "Bodakdev", "Sindhu Bhavan Road", "Prahlad Nagar", "SG Highway", "Satellite",
    "Ambli", "Vastrapur", "Thaltej", "South Bopal", "Science City Road",
    "Shela", "Navrangpura", "Ghatlodia", "Naranpura", "Paldi", "Maninagar", "Chandkheda", "Gota"
  ],
  Surat: [
    "Katargam", "Vesu", "Adajan", "Pal", "Althan", "Piplod", "City Light",
    "Ghod Dod Road", "Singanpor", "Amroli", "Mota Varachha", "Varachha",
    "Jahangirpura", "Udhna", "Dindoli", "Nanpura", "Rander", "Dumas Road"
  ],
  Vadodara: [
    "Alkapuri", "Vasna-Bhayli Road", "Gotri", "Sayajigunj", "Karelibaug",
    "Akota", "Fatehgunj", "Manjalpur", "Sevasi", "Old Padra Road"
  ],
  Rajkot: [
    "Kalawad Road", "Yagnik Road", "University Road", "Nana Mava", "150 Feet Ring Road",
    "Raiya Road", "Amin Marg", "Kotecha Chowk", "Madhapar"
  ],
  Gandhinagar: [
    "Kudasan", "GIFT City Road", "Infocity", "Raysan", "Sargasan",
    "Sector 8", "Sector 1", "Sector 21", "Vavol", "Koba"
  ],
  Bhavnagar: [
    "Victoria Park Road", "Takhteshwar", "Waghawadi Road", "Kaliyabid", "Ghogha Road",
    "Subhashnagar", "Kalanala"
  ],
  Jamnagar: [
    "Patel Colony", "Digjam Road", "Bedi Road", "Oshwal Colony", "Park Colony", "Khambhalia Road"
  ],
  Junagadh: [
    "Moti Baug", "Zanzarda Road", "Girnar Road", "Talav Gate", "Joshipura"
  ],
  Anand: [
    "Vidyanagar Road", "Vallabh Vidyanagar", "Amul Dairy Road", "Borsad Road", "Jitodia Road"
  ],
  Nadiad: [
    "College Road", "Mission Road", "Santram Road", "Uttarsanda Road"
  ],
  Bharuch: [
    "Zadeshwar Road", "Link Road", "Station Road", "Bholav"
  ],
  Vapi: [
    "Chala", "GIDC Residential", "Koparli Road", "Silvassa Road"
  ],
  Mehsana: [
    "Radhanpur Road", "Nagaland Circle", "Highway Road", "Modhera Road"
  ],
  Morbi: [
    "Sanala Road", "Ravapar Road", "Kandla Highway", "Lakhdhirpur Road"
  ],
  Bhuj: [
    "Mirzapar Road", "Mundra Road", "College Road", "Jubilee Ground"
  ],
  Navsari: [
    "Lunsikui", "Vijalpore", "Station Road", "Chhapra Road"
  ]
};

const GUJARAT_CITIES = Object.keys(GUJARAT_CITY_AREAS);

const CITY_COORDINATES = {
  Ahmedabad: { lat: 23.0338, lng: 72.5850, landmarks: ["Sindhu Bhavan Marg", "Bodakdev", "Prahlad Nagar Garden", "Iskcon Crossroads", "SG Highway"] },
  Surat: { lat: 21.1702, lng: 72.8311, landmarks: ["Dumas Beach Road", "Vesu VIP Road", "Piplod Canal Walk", "Ghod Dod Road"] },
  Vadodara: { lat: 22.3072, lng: 73.1812, landmarks: ["Alkapuri High Street", "Sayaji Garden", "Vasna-Bhayli Main Road", "Gotri Lake"] },
  Rajkot: { lat: 22.3039, lng: 70.8022, landmarks: ["Kalawad Road", "Yagnik Road Commercial Hub", "150 Ft Ring Road"] },
  Gandhinagar: { lat: 23.2156, lng: 72.6369, landmarks: ["GIFT City Tower 1", "Kudasan Main Road", "Infocity IT Park", "Sector 8 Botanical Garden"] },
  Bhavnagar: { lat: 21.7645, lng: 72.1519, landmarks: ["Victoria Park Sanctuary", "Takhteshwar Temple Road", "Waghawadi Road"] },
  Jamnagar: { lat: 22.4707, lng: 70.0577, landmarks: ["Digjam Circle", "Patel Colony Square", "Lakhota Lakefront"] },
  Junagadh: { lat: 21.5222, lng: 70.4579, landmarks: ["Moti Baug", "Girnar Foothills", "Zanzarda Road"] },
  Anand: { lat: 22.5645, lng: 72.9289, landmarks: ["Vidyanagar Road", "Amul Dairy Campus", "BVM Engineering Circle"] },
  Nadiad: { lat: 22.6916, lng: 72.8634, landmarks: ["Santram Mandir Road", "College Road"] },
  Bharuch: { lat: 21.7051, lng: 72.9959, landmarks: ["Zadeshwar Road", "Narmada Riverfront"] },
  Vapi: { lat: 20.3893, lng: 72.9106, landmarks: ["Chala Main Road", "GIDC Residential Colony"] },
  Mehsana: { lat: 23.5880, lng: 72.3693, landmarks: ["Modhera Crossroads", "Radhanpur Road"] },
  Morbi: { lat: 22.8120, lng: 70.8236, landmarks: ["Sanala Road", "Ceramic Zone Ring Road"] },
  Bhuj: { lat: 23.2420, lng: 69.6669, landmarks: ["Mirzapar Road", "Hamirsar Lakefront"] },
  Navsari: { lat: 20.9500, lng: 72.9328, landmarks: ["Lunsikui Ground", "Station Road"] },
};

const PROPERTY_TYPES = [
  "Villa", "Apartment", "Bungalow", "Penthouse", "Duplex", "Row House", "Plot", "Commercial",
];

// Initial mock buyer inquiries for the dealer CRM
const INITIAL_LEADS = [
  {
    id: 101,
    clientName: "Rajeshbhai Patel",
    phone: "+91 98250 12345",
    email: "rajesh.patel@gujaratcorp.in",
    property: "The Juniper Villa",
    location: "Bodakdev, Ahmedabad",
    budget: "₹2.50 Cr",
    mode: "buy",
    date: "Today, 11:30 AM",
    message: "Interested in site visit this Saturday. Verified buyer, pre-approved home loan.",
    status: "Site Visit Scheduled",
  },
  {
    id: 102,
    clientName: "Pooja & Amit Shah",
    phone: "+91 98981 54321",
    email: "pooja.shah@gmail.com",
    property: "Arcadia No. 4",
    location: "Vesu, Surat",
    budget: "₹1.20 Cr",
    mode: "buy",
    date: "Yesterday",
    message: "Looking for ready-to-move 2 BHK for family. Please share floor plans.",
    status: "New Lead",
  },
  {
    id: 103,
    clientName: "Dr. Vikram Desai",
    phone: "+91 94260 98765",
    email: "dr.vdesai@clinic.org",
    property: "Canyon Palm Residence",
    location: "Alkapuri, Vadodara",
    budget: "₹1.85 Cr",
    mode: "buy",
    date: "2 days ago",
    message: "Negotiating final booking amount. Waiting for structural inspection report.",
    status: "Under Negotiation",
  },
  {
    id: 104,
    clientName: "Mehul Mehta",
    phone: "+91 97277 88990",
    email: "mehul.m@techventures.io",
    property: "The Glass Penthouse",
    location: "S.G. Highway, Ahmedabad",
    budget: "₹95,000 / mo",
    mode: "rent",
    date: "3 days ago",
    message: "Corporate lease for senior VP. 2-year contract requested.",
    status: "Deal Closed",
  },
];

// Helper to format numeric price in Indian Crores / Lakhs
function formatIndianCurrency(num) {
  if (!num || isNaN(num)) return "INR 0";
  const val = Number(num);
  if (val >= 10000000) {
    const cr = (val / 10000000).toFixed(2);
    return `INR ${cr.replace(/\.00$/, "")} Cr`;
  }
  if (val >= 100000) {
    const lk = (val / 100000).toFixed(2);
    return `INR ${lk.replace(/\.00$/, "")} L`;
  }
  return `INR ${val.toLocaleString("en-IN")}`;
}

export default function AdminPage() {
  const router = useRouter();

  // Authentication & Guard State
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);

  // In-place admin login fallback for direct URL access
  const [loginEmail, setLoginEmail] = useState("admin@fieldhouse.re");
  const [loginPassword, setLoginPassword] = useState("admin123456");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Data State
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  // Filter & View State
  const [activeTab, setActiveTab] = useState("properties"); // 'properties' | 'leads' | 'analytics'
  const [modeFilter, setModeFilter] = useState("all"); // 'all' | 'buy' | 'rent' | 'short-term' | 'trending'
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'price-high' | 'price-low'
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'

  // Selected property for Right-Side Details Drawer (View 👁)
  const [selectedViewProperty, setSelectedViewProperty] = useState(null);

  // Modal State (Add / Edit) & Editor Tabs with Refresh Persistence
  const [isModalOpen, setIsModalOpen] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("fieldhouse_admin_modal_open") === "true";
      } catch (e) {}
    }
    return false;
  });
  const [modalMode, setModalMode] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("fieldhouse_admin_modal_mode") || "create";
      } catch (e) {}
    }
    return "create";
  });
  const [editingId, setEditingId] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("fieldhouse_admin_editing_id") || null;
      } catch (e) {}
    }
    return null;
  });
  const [submitting, setSubmitting] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("fieldhouse_admin_editor_tab") || "Information";
      } catch (e) {}
    }
    return "Information";
  });
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const getDefaultFormData = () => ({
    status: "Published",
    visibility: "Everyone",
    name: "",
    nameSub: "",
    state: "Gujarat",
    city: "Surat",
    area: "Vesu",
    streetAddress: "VIP Road, Near Lake View Road",
    address: "VIP Road, Near Lake View Road, Vesu, Surat",
    landmark: "Near Lake View Road",
    pincode: "395007",
    society: "Shree Residency",
    // Property Unit Details (Separated from Address!)
    plotNo: "P-24",
    surveyNo: "Survey 142/2",
    wing: "A Wing",
    floor: "5",
    flatNo: "502",
    villaNo: "Villa 12",
    isLocationConfirmed: false,
    mapLat: 21.1702,
    mapLng: 72.8311,
    mapUrl: "https://www.google.com/maps?q=21.1702,72.8311&z=18",
    type: "Apartment",
    layout: "3 BHK",
    size: 1850,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    roomNumber: "",
    builtDate: "2024",
    age: "Brand New Construction",
    moveInCondition: "Immediately",
    stories: "Ground + 2 Floors",
    furnishing: "Semi-Furnished",
    facing: "East (Vastu Compliant)",
    waterSupply: "24/7 Municipal Corporation + Borewell",
    powerBackup: "100% DG Power Backup",
    parkingSlots: "2 Covered Dedicated",
    // Plot specifics
    plotDimensions: "40 x 85 ft",
    boundaryWall: "Constructed Boundary Wall",
    roadWidth: "40 ft wide road",
    zoningApproval: "Residential NA (AUDA Approved)",
    // Commercial specifics
    suitableFor: "Corporate IT Office / Retail Showroom",
    powerLoad: "25 kVA",
    pantry: "Dry Pantry Available",
    washroomType: "Private Executive Washroom",
    commercialFloor: "2nd Floor (with 2 High-Speed Elevators)",
    // Apartment / Penthouse specifics
    unitFloor: "7th Floor",
    totalFloors: "14 Floors",
    carpetArea: "2,450 sq.ft",
    superBuiltupArea: "3,200 sq.ft",
    elevators: "2 High-Speed Passenger Lifts",
    // Villa / Bungalow specifics
    stories: "G+2 Floors",
    plotArea: "450 sq.yards",
    builtUpArea: "3,800 sq.ft",
    privateGarden: "Yes (Landscaped)",
    privateTerrace: "Yes (Open Skyline View)",
    carPorch: "Covered 2 Car Porch",
    // Media & Photos
    floorPlanUrl: "",
    description: "Exquisite luxury residence crafted with Italian marble, designer bathroom fittings, generous sunlight, and premier neighborhood connectivity.",
    mode: "buy",
    price: 24800000,
    priceLabel: "INR 2.48 Cr",
    image: PRESET_PHOTOS[0].url,
    galleryImages: PRESET_PHOTOS.slice(0, 5).map((p) => p.url),
    tag: "Trending",
    isTrending: true,
    amenities: [
      "Private Lawn",
      "Covered Parking",
      "24/7 Security & CCTV",
      "100% Vastu Compliant",
      "Power Backup",
      "Gated Society"
    ],
    // Fees & Pricing breakdown
    tokenAmount: 500000,
    stampDutyPct: 5.9,
    brokerageCommission: "1%",
    transferFee: 50000,
    monthlyRent: 45000,
    securityDeposit: "INR 1,35,000",
    maintenance: "INR 3,500 / mo",
    maintenanceIncluded: false,
    lockinPeriod: "11 Months",
    noticePeriod: "1 Month",
    nightlyRate: 6500,
    weekendSurcharge: 1500,
    cleaningFee: 1200,
    refundableDeposit: 5000,
    extraGuestFee: 750,
    cancellationPolicy: "Flexible (Full refund up to 48 hours before check-in)",
    // Terms
    possessionTimeline: "Immediate Possession (Ready to Move)",
    ownershipTitle: "Freehold Title (Clear & Marketable)",
    reraApproved: "RERA Approved",
    reraNumber: "PR/GJ/AHMEDABAD/AUDA/RAA09876/010124",
    priceNegotiability: "Slightly Negotiable",
    loanStatus: "Approved by SBI, HDFC, ICICI, Bank of Baroda",
    // DEALER INFORMATION (not pre-filled automatically)
    dealerId: null,
    dealerPhoto: "",
    dealerName: "",
    dealerAgency: "",
    dealerPhone: "",
    dealerEmail: "",
    dealerAddress: "",
    dealerCity: "",
    dealerType: "",
    dealerRera: "",
    dealerBio: "",
    dealerStatus: "Verified",
  });

  // Form State with Refresh Persistence
  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("fieldhouse_admin_form_data");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return getDefaultFormData();
  });
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Keep form data saved in sessionStorage so browser refresh doesn't lose data
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isModalOpen) {
        sessionStorage.setItem("fieldhouse_admin_modal_open", "true");
        sessionStorage.setItem("fieldhouse_admin_modal_mode", modalMode);
        sessionStorage.setItem("fieldhouse_admin_editing_id", editingId ? String(editingId) : "");
        sessionStorage.setItem("fieldhouse_admin_editor_tab", activeEditorTab);
        sessionStorage.setItem("fieldhouse_admin_form_data", JSON.stringify(formData));
      } else {
        sessionStorage.removeItem("fieldhouse_admin_modal_open");
        sessionStorage.removeItem("fieldhouse_admin_modal_mode");
        sessionStorage.removeItem("fieldhouse_admin_editing_id");
        sessionStorage.removeItem("fieldhouse_admin_editor_tab");
        sessionStorage.removeItem("fieldhouse_admin_form_data");
      }
    }
  }, [isModalOpen, modalMode, editingId, activeEditorTab, formData]);

  // Leads CRM State
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [newLeadData, setNewLeadData] = useState({
    clientName: "",
    phone: "",
    email: "",
    property: "",
    budget: "",
    message: "",
  });

  // Lock background page scroll whenever ANY modal or drawer is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      isModalOpen || isAddLeadModalOpen || selectedViewProperty || showSignOutConfirm
    );
    if (typeof document !== "undefined") {
      if (isAnyModalOpen) {
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
  }, [isModalOpen, isAddLeadModalOpen, selectedViewProperty, showSignOutConfirm]);

  // 1. Check Authentication on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("fieldhouse_user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setCurrentUser(parsed);
          const hasAdminRole =
            parsed.role === "admin" ||
            parsed.isDealer === true ||
            (parsed.email &&
              (parsed.email.toLowerCase().includes("admin") ||
                parsed.email.toLowerCase().includes("dealer") ||
                parsed.email.toLowerCase() === "admin@fieldhouse.re"));

          if (hasAdminRole) {
            setIsAdminAuthorized(true);
          } else {
            setIsAdminAuthorized(false);
          }
        } catch (e) {
          console.error("Failed to parse user session", e);
          setIsAdminAuthorized(false);
        }
      } else {
        setIsAdminAuthorized(false);
      }
      setAuthChecked(true);

      // Load saved leads if any
      const savedLeads = localStorage.getItem("fieldhouse_dealer_leads");
      if (savedLeads) {
        try {
          setLeads(JSON.parse(savedLeads));
        } catch (e) { }
      }
    }
  }, []);

  // Synchronize activeTab with Admin Navbar
  useEffect(() => {
    const handleSwitch = (e) => {
      if (e.detail && ["properties", "leads", "analytics"].includes(e.detail)) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener("fieldhouse_admin_tab_switch", handleSwitch);
    return () => window.removeEventListener("fieldhouse_admin_tab_switch", handleSwitch);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("fieldhouse_admin_tab_active", { detail: activeTab }));
  }, [activeTab]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get("tab");
      if (urlTab && ["properties", "leads", "analytics"].includes(urlTab)) {
        setActiveTab(urlTab);
      }
    }
  }, []);

  useEffect(() => {
    document.body.classList.add("admin-no-nav");
    return () => {
      document.body.classList.remove("admin-no-nav");
    };
  }, []);

  // 2. Load Properties
  const fetchPropertyList = async () => {
    setLoading(true);
    try {
      const res = await getProperties({ limit: 100 });
      if (res && res.data && res.data.length > 0) {
        setProperties(res.data);
      } else if (Array.isArray(res) && res.length > 0) {
        setProperties(res);
      } else {
        setProperties(FALLBACK_PROPERTIES);
      }
    } catch (err) {
      console.warn("Backend error fetching properties, using fallback dataset:", err);
      setProperties(FALLBACK_PROPERTIES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthorized) {
      fetchPropertyList();
    }
  }, [isAdminAuthorized]);

  // Toast Helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Direct login for unauthenticated visitors
  const handleDirectAdminLogin = async (e) => {
    e?.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await loginUser(loginEmail, loginPassword);
      const userData = res?.data?.user || res?.user;
      const tokenVal = res?.data?.token || res?.token?.value || res?.token;

      const adminUser = {
        name: userData?.fullName || "Fieldhouse Admin (Dealer)",
        email: userData?.email || loginEmail,
        role: "admin",
        isDealer: true,
        joined: "October 2026",
        token: tokenVal,
      };

      setCurrentUser(adminUser);
      setIsAdminAuthorized(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("fieldhouse_user", JSON.stringify(adminUser));
        document.cookie = `fieldhouse_user=${encodeURIComponent(JSON.stringify(adminUser))}; path=/; max-age=31536000; SameSite=Lax`;
        window.dispatchEvent(new Event("storage"));
      }
      showToast("Dealer Admin Session Authorized");
    } catch (err) {
      console.warn("Direct login error:", err);
      // Fallback: If credentials match default admin
      if (loginEmail.toLowerCase().includes("admin") || loginEmail.toLowerCase().includes("dealer")) {
        const fallbackAdmin = {
          name: "Fieldhouse Admin (Dealer)",
          email: loginEmail,
          role: "admin",
          isDealer: true,
          joined: "October 2026",
        };
        setCurrentUser(fallbackAdmin);
        setIsAdminAuthorized(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("fieldhouse_user", JSON.stringify(fallbackAdmin));
          document.cookie = `fieldhouse_user=${encodeURIComponent(JSON.stringify(fallbackAdmin))}; path=/; max-age=31536000; SameSite=Lax`;
          window.dispatchEvent(new Event("storage"));
        }
        showToast("Dealer Admin Session Authorized (Local Mode)");
      } else {
        setLoginError(err.message || "Invalid Admin Credentials");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("fieldhouse_user");
      document.cookie = "fieldhouse_user=; path=/; max-age=0; SameSite=Lax";
      window.dispatchEvent(new Event("storage"));
    }
    setCurrentUser(null);
    setIsAdminAuthorized(false);
    router.push("/login");
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingId(null);
    setActiveEditorTab("Information");
    setFormData(getDefaultFormData());
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (prop) => {
    setModalMode("edit");
    setEditingId(prop.id);
    setActiveEditorTab("Information");
    const defaultCity = prop.city || "Surat";
    const coords = CITY_COORDINATES[defaultCity] || { lat: 21.1702, lng: 72.8311 };
    const cityAreas = GUJARAT_CITY_AREAS[defaultCity] || [defaultCity === "Surat" ? "Katargam" : "Bodakdev"];
    let matchedArea = cityAreas[0];
    if (prop.location) {
      const found = cityAreas.find((a) => prop.location.toLowerCase().includes(a.toLowerCase()));
      if (found) matchedArea = found;
    }

    let targetLat = coords.lat;
    let targetLng = coords.lng;
    if (prop.mapUrl && prop.mapUrl.includes("?q=")) {
      const match = prop.mapUrl.match(/\?q=([0-9.-]+),([0-9.-]+)/);
      if (match) {
        targetLat = parseFloat(match[1]);
        targetLng = parseFloat(match[2]);
      }
    } else if (prop.mapLat && prop.mapLng) {
      targetLat = Number(prop.mapLat);
      targetLng = Number(prop.mapLng);
    }

    setFormData({
      ...getDefaultFormData(),
      name: prop.name || "",
      nameSub: prop.description?.slice(0, 60) || "",
      state: prop.state || "Gujarat",
      city: defaultCity,
      area: matchedArea,
      streetAddress: prop.streetAddress || prop.location || `${matchedArea}, ${defaultCity}`,
      address: prop.location || `${matchedArea}, ${defaultCity}, Gujarat`,
      location: prop.location || `${matchedArea}, ${defaultCity}`,
      society: prop.society || prop.name || "Shree Residency",
      plotNo: prop.plotNo || "P-24",
      surveyNo: prop.surveyNo || "",
      wing: prop.wing || "A Wing",
      floor: prop.floor || "5",
      flatNo: prop.flatNo || "502",
      villaNo: prop.villaNo || "Villa 12",
      pincode: (prop.pincode && prop.pincode !== "395007")
        ? prop.pincode
        : (getGujaratPincode(matchedArea, defaultCity) || prop.pincode || "395007"),
      isLocationConfirmed: Boolean(prop.mapLat && prop.mapLng),
      mapLat: targetLat,
      mapLng: targetLng,
      type: prop.type || "Apartment",
      layout: `${prop.bedrooms || 2} BHK`,
      size: prop.size || 2000,
      bedrooms: prop.bedrooms || 2,
      bathrooms: prop.bathrooms || 2,
      mode: prop.mode || "buy",
      price: prop.price || 0,
      priceLabel: prop.priceLabel || formatIndianCurrency(prop.price),
      image: prop.image || PRESET_PHOTOS[0].url,
      galleryImages: (prop.galleryImages && prop.galleryImages.length > 0)
        ? prop.galleryImages
        : PRESET_PHOTOS.slice(0, 5).map((p) => p.url),
      tag: prop.tag || "Verified",
      isTrending: Boolean(prop.isTrending),
      description: prop.description || "",
      mapUrl: prop.mapUrl || (prop.mapLat && prop.mapLng ? `https://www.google.com/maps?q=${prop.mapLat},${prop.mapLng}&z=18` : getGoogleMapsUrl(null, null, prop.location || prop.name)),
      // Dealer details (preserve existing if present, otherwise do not mock/pre-fill)
      dealerId: prop.dealerId || prop.dealer?.id || null,
      dealerPhoto: prop.dealer?.profilePhoto || prop.dealer?.avatar || "",
      dealerName: prop.dealer?.name || "",
      dealerAgency: prop.dealer?.agencyName || prop.dealer?.company || "",
      dealerPhone: prop.dealer?.phone || "",
      dealerEmail: prop.dealer?.email || "",
      dealerAddress: prop.dealer?.officeAddress || prop.dealer?.address || "",
      dealerCity: prop.dealer?.city || prop.city || "",
      dealerType: prop.dealer?.dealerType || "",
      dealerRera: prop.dealer?.reraNumber || prop.dealer?.rera || "",
      dealerBio: prop.dealer?.bio || "",
      dealerStatus: prop.dealer?.verificationStatus || "Verified",
    });
    setIsModalOpen(true);
  };

  // City change: dynamically update areas, pincode and map pin
  const handleCityChange = (newCity) => {
    const areas = GUJARAT_CITY_AREAS[newCity] || [newCity === "Surat" ? "Katargam" : "Bodakdev"];
    const firstArea = areas[0];
    const coords = CITY_COORDINATES[newCity] || { lat: 21.1702, lng: 72.8311 };
    const areaPincode = getGujaratPincode(firstArea, newCity);
    setFormData((prev) => ({
      ...prev,
      city: newCity,
      area: firstArea,
      pincode: areaPincode || prev.pincode,
      address: `${firstArea}, ${newCity}, Gujarat`,
      location: `${firstArea}, ${newCity}`,
      mapLat: coords.lat,
      mapLng: coords.lng,
      isLocationConfirmed: false,
      mapUrl: `https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=18`,
    }));
  };

  // Area change: update address, location, and auto-update pincode for the area
  const handleAreaChange = (newArea) => {
    const areaPincode = getGujaratPincode(newArea, formData.city);
    setFormData((prev) => ({
      ...prev,
      area: newArea,
      pincode: areaPincode || prev.pincode,
      location: `${newArea}, ${prev.city}`,
    }));
  };

  // Optional geocode on area blur or select
  const handleAreaGeocode = async (areaToGeocode) => {
    if (!areaToGeocode || !areaToGeocode.trim()) return;
    const verifiedPin = getGujaratPincode(areaToGeocode, formData.city);
    try {
      const geo = await searchLocation(areaToGeocode, formData.city);
      if (geo && geo.lat && geo.lng) {
        setFormData((prev) => ({
          ...prev,
          mapLat: geo.lat,
          mapLng: geo.lng,
          address: geo.address || `${areaToGeocode}, ${prev.city}, Gujarat`,
          pincode: verifiedPin || geo.pincode || prev.pincode,
          mapUrl: `https://www.google.com/maps?q=${geo.lat},${geo.lng}&z=18`,
        }));
      } else if (verifiedPin) {
        setFormData((prev) => ({
          ...prev,
          pincode: verifiedPin,
        }));
      }
    } catch (e) {
      console.warn("Area geocoding fallback", e);
      if (verifiedPin) {
        setFormData((prev) => ({
          ...prev,
          pincode: verifiedPin,
        }));
      }
    }
  };

  // Handle interactive pin location update from InteractiveMapPicker
  const handleMapLocationSelect = (loc) => {
    const pinLink = loc.mapUrl || (loc.lat && loc.lng ? `https://www.google.com/maps?q=${loc.lat},${loc.lng}&z=18` : "");
    setFormData((prev) => {
      const currentCity = loc.city || prev.city;
      // Detected area: prioritize loc.area if valid, never default to "City Center"
      const detectedArea = (loc.area && loc.area !== "City Center")
        ? loc.area
        : (prev.area && prev.area !== "City Center" ? prev.area : (currentCity === "Surat" ? "Katargam" : "Bodakdev"));
      const verifiedPin = getGujaratPincode(detectedArea, currentCity) || loc.pincode || prev.pincode;

      // Resolved street address avoiding duplication
      const rawStreet = loc.streetAddress || (loc.society && loc.society !== "Exact Pin Point" && loc.society !== currentCity ? loc.society : "") || (loc.road && loc.road !== currentCity ? loc.road : "") || "";
      const resolvedStreet = rawStreet || prev.streetAddress || detectedArea;

      // Clean address string avoiding duplicate "Surat, Surat"
      let cleanAddress = loc.address;
      if (!cleanAddress || cleanAddress.toLowerCase().includes(`${currentCity.toLowerCase()}, ${currentCity.toLowerCase()}`)) {
        cleanAddress = `${resolvedStreet ? resolvedStreet + ", " : ""}${detectedArea && detectedArea !== resolvedStreet ? detectedArea + ", " : ""}${currentCity}`;
      }

      return {
        ...prev,
        state: loc.state || prev.state || "Gujarat",
        mapLat: loc.lat,
        mapLng: loc.lng,
        mapUrl: pinLink || prev.mapUrl,
        streetAddress: resolvedStreet,
        address: cleanAddress,
        location: `${detectedArea}, ${currentCity}`,
        city: currentCity,
        area: detectedArea,
        pincode: verifiedPin,
        society: loc.society && loc.society !== "Exact Pin Point" ? loc.society : prev.society,
        isLocationConfirmed: Boolean(loc.isConfirmed !== undefined ? loc.isConfirmed : prev.isLocationConfirmed),
      };
    });
    if (loc.isConfirmed) {
      showToast(`🎯 Exact Location Confirmed: ${loc.lat?.toFixed(5)}, ${loc.lng?.toFixed(5)}`);
    } else {
      showToast(`📍 Location pinned: ${loc.area || loc.society || "Point updated"}`);
    }
  };

  // Auto-fetch Google Address from current input text or city/area
  const handleFetchGoogleAddress = async () => {
    const query = formData.address || `${formData.area}, ${formData.city}`;
    if (!query || !query.trim()) {
      showToast("Please enter a street, society or area name to search", "error");
      return;
    }

    setIsGeocoding(true);
    try {
      const res = await searchLocation(query, formData.city);
      if (res && res.lat && res.lng) {
        handleMapLocationSelect(res);
        showToast(`✓ Address resolved: ${res.society || res.address}`);
      } else {
        showToast(`Could not find "${query}". Try adding city name or road.`, "error");
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
      showToast("Failed to fetch address", "error");
    } finally {
      setIsGeocoding(false);
    }
  };

  // Photo file upload from device
  const handlePhotoFiles = (files) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setFormData((prev) => {
          const existing = prev.galleryImages || [];
          const nextGallery = [...existing, dataUrl];
          return {
            ...prev,
            galleryImages: nextGallery,
            image: prev.image || dataUrl,
          };
        });
      };
      reader.readAsDataURL(file);
    });
    showToast("Photo(s) uploaded successfully!");
  };

  // Remove photo from gallery
  const handleRemovePhoto = (index) => {
    setFormData((prev) => {
      const existing = prev.galleryImages || [];
      const targetImg = existing[index];
      const nextGallery = existing.filter((_, i) => i !== index);
      let nextCover = prev.image;
      if (prev.image === targetImg) {
        nextCover = nextGallery.length > 0 ? nextGallery[0] : PRESET_PHOTOS[0].url;
      }
      return {
        ...prev,
        galleryImages: nextGallery,
        image: nextCover,
      };
    });
  };

  // Set selected photo as primary cover
  const handleSetCoverPhoto = (imgUrl) => {
    setFormData((prev) => ({ ...prev, image: imgUrl }));
    showToast("Cover photo updated!");
  };

  // Form input changes & price auto-label
  const handleFormChange = (field, val) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: val };

      // Auto update priceLabel when price changes
      if (field === "price") {
        if (updated.mode === "rent") {
          const p = Number(val);
          updated.priceLabel = `INR ${p.toLocaleString("en-IN")} / mo`;
        } else if (updated.mode === "short-term") {
          const p = Number(val);
          updated.priceLabel = `INR ${p.toLocaleString("en-IN")} / night`;
        } else {
          updated.priceLabel = formatIndianCurrency(val);
        }
      }

      // Auto adjust presets when listing mode changes
      if (field === "mode") {
        if (val === "rent") {
          updated.price = 45000;
          updated.priceLabel = "INR 45,000 / mo";
        } else if (val === "short-term") {
          updated.price = 6500;
          updated.priceLabel = "INR 6,500 / night";
        } else {
          updated.price = 24800000;
          updated.priceLabel = "INR 2.48 Cr";
        }
      }

      // Auto update details summary
      if (field === "bedrooms" || field === "bathrooms") {
        updated.details = `${updated.bedrooms} BHK · ${updated.bathrooms} Baths`;
      }

      return updated;
    });
  };

  // Toggle amenity in features list
  const handleToggleAmenity = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities?.includes(amenity);
      const next = exists
        ? prev.amenities.filter((a) => a !== amenity)
        : [...(prev.amenities || []), amenity];
      return { ...prev, amenities: next };
    });
  };

  // Submit Add / Edit Form
  const handleSubmitProperty = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.name || !formData.name.trim()) {
      showToast("Please enter a property title / name in Information tab", "error");
      setActiveEditorTab("Information");
      return;
    }

    // Dealer fields validation (only if dealer information is provided)
    const hasAnyDealerInfo = Boolean(
      (formData.dealerName && formData.dealerName.trim()) ||
      (formData.dealerAgency && formData.dealerAgency.trim()) ||
      (formData.dealerPhone && formData.dealerPhone.trim()) ||
      (formData.dealerEmail && formData.dealerEmail.trim()) ||
      formData.dealerPhoto
    );

    if (hasAnyDealerInfo) {
      if (!formData.dealerName || !formData.dealerName.trim()) {
        showToast("Please enter Dealer Full Name in Dealer tab", "error");
        setActiveEditorTab("Dealer");
        return;
      }
    }

    setSubmitting(true);
    try {
      // Intelligently generate details summary tailored to property type
      let generatedDetails = "";
      if (formData.type === "Plot") {
        generatedDetails = `Plot: ${formData.size || 400} sq.yards · ${formData.facing} · ${formData.roadWidth || '40ft Road'}`;
      } else if (formData.type === "Commercial") {
        generatedDetails = `Commercial: ${formData.size || 2500} sq.ft · ${formData.suitableFor} · ${formData.furnishing}`;
      } else if (formData.type === "Villa" || formData.type === "Bungalow" || formData.type === "Row House") {
        generatedDetails = `${formData.bedrooms || 4} BHK Villa · ${formData.bathrooms || 4} Baths · ${formData.size || 3500} sq.ft · ${formData.stories || 'G+2'}`;
      } else if (formData.type === "Apartment" || formData.type === "Penthouse") {
        generatedDetails = `${formData.bedrooms || 3} BHK · ${formData.bathrooms || 3} Baths · ${formData.size || 2200} sq.ft · ${formData.unitFloor || 'Floor 5'}`;
      } else {
        generatedDetails = `${formData.bedrooms || 3} BHK · ${formData.bathrooms || 3} Baths · ${formData.size || 2000} sq.ft`;
      }

      const uploadedGallery = (formData.galleryImages && formData.galleryImages.length > 0)
        ? formData.galleryImages
        : PRESET_PHOTOS.slice(0, 5).map((p) => p.url);

      const dealerPayload = hasAnyDealerInfo ? {
        id: formData.dealerId || undefined,
        name: formData.dealerName.trim(),
        agencyName: formData.dealerAgency?.trim() || "",
        company: formData.dealerAgency?.trim() || "",
        phone: formData.dealerPhone?.trim() || "",
        email: formData.dealerEmail?.trim() || "",
        profilePhoto: formData.dealerPhoto || "",
        avatar: formData.dealerPhoto || "",
        officeAddress: formData.dealerAddress || "",
        city: formData.dealerCity || formData.city || "Surat",
        dealerType: formData.dealerType || "Individual Dealer",
        reraNumber: formData.dealerRera || "",
        bio: formData.dealerBio || "",
        verificationStatus: formData.dealerStatus || "Verified",
        verified: formData.dealerStatus === "Verified",
      } : null;

      const payload = {
        name: formData.name.trim(),
        city: formData.city || "Surat",
        location: formData.streetAddress
          ? `${formData.streetAddress}, ${formData.area}, ${formData.city}`
          : (formData.address || `${formData.area}, ${formData.city}`),
        mode: formData.mode || "buy",
        type: formData.type || "Apartment",
        price: Number(formData.price) || 0,
        priceLabel: formData.priceLabel || formatIndianCurrency(formData.price),
        size: Number(formData.size) || null,
        bedrooms: formData.type === "Plot" ? 0 : Number(formData.bedrooms) || 1,
        bathrooms: formData.type === "Plot" ? 0 : Number(formData.bathrooms) || 1,
        isTrending: Boolean(formData.isTrending),
        details: generatedDetails,
        image: formData.image || PRESET_PHOTOS[0].url,
        images: JSON.stringify(uploadedGallery),
        tag: formData.tag || "Trending",
        description: formData.description || "",
        mapUrl: formData.mapUrl || getGoogleMapsUrl(formData.mapLat, formData.mapLng, formData.streetAddress || formData.address),
        dealerId: formData.dealerId || undefined,
        dealer: dealerPayload,
      };

      let savedResult = null;
      if (modalMode === "create") {
        savedResult = await createProperty(payload);
        showToast(`✓ Property "${formData.name}" added successfully to database!`);
      } else {
        savedResult = await updateProperty(editingId, payload);
        showToast(`✓ Property "${formData.name}" updated successfully!`);
      }

      // Persist dealer profile & uploaded images locally for immediate frontend synchronization
      if (typeof window !== "undefined") {
        try {
          const stored = JSON.parse(localStorage.getItem("dealer_uploaded_property_images") || "{}");
          stored[formData.name.trim().toLowerCase()] = uploadedGallery;
          if (editingId) stored[String(editingId)] = uploadedGallery;
          if (savedResult?.id) stored[String(savedResult.id)] = uploadedGallery;
          localStorage.setItem("dealer_uploaded_property_images", JSON.stringify(stored));

          const storedDealers = JSON.parse(localStorage.getItem("property_dealer_profiles") || "{}");
          storedDealers[formData.name.trim().toLowerCase()] = dealerPayload;
          if (editingId) storedDealers[String(editingId)] = dealerPayload;
          if (savedResult?.id) storedDealers[String(savedResult.id)] = dealerPayload;
          localStorage.setItem("property_dealer_profiles", JSON.stringify(storedDealers));
        } catch (e) { }
      }

      setIsModalOpen(false);
      await fetchPropertyList();
    } catch (err) {
      console.error("Failed to save property:", err);
      showToast(err.message || "Failed to save property to database", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Fast Toggle Trending Status
  const handleToggleTrending = async (prop) => {
    try {
      const nextStatus = !prop.isTrending;
      await updateProperty(prop.id, { isTrending: nextStatus });
      setProperties((prev) =>
        prev.map((item) => (item.id === prop.id ? { ...item, isTrending: nextStatus } : item))
      );
      showToast(
        nextStatus
          ? `Marked "${prop.name}" as Trending on Homepage!`
          : `Removed Trending badge from "${prop.name}"`
      );
    } catch (err) {
      console.error("Toggle trending failed:", err);
      showToast("Failed to update trending status", "error");
    }
  };

  // Delete Property with Confirmation
  const handleDeleteProperty = async (prop) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${prop.name}"?`)) {
      return;
    }

    try {
      await deleteProperty(prop.id);
      setProperties((prev) => prev.filter((item) => item.id !== prop.id));
      showToast(`Deleted "${prop.name}" from your portfolio`);
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete property", "error");
    }
  };

  // Update Lead Status
  const handleLeadStatusChange = (leadId, newStatus) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l));
    setLeads(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("fieldhouse_dealer_leads", JSON.stringify(updated));
    }
    showToast(`Lead status updated to "${newStatus}"`);
  };

  // Add Manual Walk-In Lead
  const handleAddManualLead = (e) => {
    e.preventDefault();
    if (!newLeadData.clientName || !newLeadData.phone) {
      showToast("Client name and phone are required", "error");
      return;
    }

    const newLead = {
      id: Date.now(),
      clientName: newLeadData.clientName,
      phone: newLeadData.phone,
      email: newLeadData.email || "walkin@fieldhouse.re",
      property: newLeadData.property || "General Inquiry (Luxury Portfolio)",
      location: "Ahmedabad, Gujarat",
      budget: newLeadData.budget || "₹2.0 Cr",
      mode: "buy",
      date: "Just now",
      message: newLeadData.message || "Walk-in client inquiring about available properties.",
      status: "New Lead",
    };

    const updated = [newLead, ...leads];
    setLeads(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("fieldhouse_dealer_leads", JSON.stringify(updated));
    }
    setIsAddLeadModalOpen(false);
    setNewLeadData({ clientName: "", phone: "", email: "", property: "", budget: "", message: "" });
    showToast("New buyer lead logged successfully!");
  };

  // Computed KPI Metrics
  const stats = useMemo(() => {
    const total = properties.length;
    const forSale = properties.filter((p) => p.mode === "buy").length;
    const forRent = properties.filter((p) => p.mode === "rent").length;
    const shortTerm = properties.filter((p) => p.mode === "short-term").length;
    const trending = properties.filter((p) => p.isTrending).length;

    const totalValuation = properties.reduce((acc, curr) => {
      const price = Number(curr.price) || 0;
      return acc + (curr.mode === "buy" ? price : price * 12);
    }, 0);

    const avgPrice = total > 0 ? totalValuation / total : 0;

    return {
      total,
      forSale,
      forRent,
      shortTerm,
      trending,
      totalValuation: formatIndianCurrency(totalValuation),
      avgPrice: formatIndianCurrency(avgPrice),
      totalLeads: leads.length,
      activeVisits: leads.filter((l) => l.status === "Site Visit Scheduled").length,
    };
  }, [properties, leads]);

  // Filtered & Sorted Properties List
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Mode filter
        if (modeFilter === "trending") {
          if (!p.isTrending) return false;
        } else if (modeFilter !== "all" && p.mode !== modeFilter) {
          return false;
        }

        // City filter
        if (cityFilter !== "all" && p.city?.toLowerCase() !== cityFilter.toLowerCase()) {
          return false;
        }

        // Type filter
        if (typeFilter !== "all" && p.type?.toLowerCase() !== typeFilter.toLowerCase()) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name?.toLowerCase().includes(q);
          const matchLoc = p.location?.toLowerCase().includes(q);
          const matchCity = p.city?.toLowerCase().includes(q);
          const matchType = p.type?.toLowerCase().includes(q);
          if (!matchName && !matchLoc && !matchCity && !matchType) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-high") return Number(b.price) - Number(a.price);
        if (sortBy === "price-low") return Number(a.price) - Number(b.price);
        return Number(b.id) - Number(a.id); // newest by default
      });
  }, [properties, modeFilter, cityFilter, typeFilter, searchQuery, sortBy]);

  // City Analytics Breakdown
  const cityAnalytics = useMemo(() => {
    const map = {};
    properties.forEach((p) => {
      const c = p.city || "Other";
      if (!map[c]) {
        map[c] = { name: c, count: 0, totalVal: 0 };
      }
      map[c].count += 1;
      map[c].totalVal += Number(p.price) || 0;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [properties]);

  // =========================================================================
  // RENDER: Guard / Access Restricted Screen
  // =========================================================================
  if (!authChecked) {
    return (
      <div className="admin-guard-shell">
        <div style={{ textAlign: "center", color: "#78716c" }}>
          <RefreshCw className="animate-spin" size={32} style={{ margin: "0 auto 12px" }} />
          <p>Verifying Dealer Authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthorized) {
    return (
      <main
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
          background: "#faf9f5",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "520px",
            width: "100%",
            textAlign: "center",
            background: "#ffffff",
            padding: "48px 36px",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
            border: "1px solid #ebe9e0",
          }}
        >
          <div
            style={{
              fontSize: "88px",
              fontWeight: "900",
              lineHeight: "1",
              color: "#ee705b",
              letterSpacing: "-0.04em",
              marginBottom: "12px",
            }}
          >
            404
          </div>

          <h1
            style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#1d1e1a",
              margin: "0 0 10px",
            }}
          >
            Page Not Found
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "#77766f",
              lineHeight: "1.6",
              margin: "0 0 32px",
            }}
          >
            The page you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#ee705b",
                color: "#ffffff",
                textDecoration: "none",
                padding: "12px 24px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "700",
                boxShadow: "0 4px 12px rgba(238, 112, 91, 0.25)",
              }}
            >
              <Home size={16} />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/buy"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#f7f5f0",
                color: "#1d1e1a",
                textDecoration: "none",
                padding: "12px 24px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                border: "1px solid #e5e3dc",
              }}
            >
              <Search size={16} />
              <span>Browse Properties</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================================
  // RENDER: Full Dealer Admin Console
  // =========================================================================
  return (
    <div className="admin-shell">
      {/* Toast Alert */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle2 size={18} color="#22c55e" /> : <AlertCircle size={18} color="#ef4444" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="admin-container">
        {/* Modern Admin Dashboard Hero Section */}
        <div className="admin-dashboard-hero">
          <div className="admin-dashboard-hero-left">
            <h1 className="admin-dashboard-title">
              <span>Dealer Admin Console</span>
              <span className="admin-status-pill">
                <span className="status-dot-live"></span> Live DB
              </span>
            </h1>
            <p className="admin-dashboard-subtitle">
              Fieldhouse Premier Realty · Gujarat Real Estate Portfolio Management
            </p>
          </div>

          <div className="admin-dashboard-hero-actions">
            <button
              type="button"
              className="admin-btn-action-outline"
              onClick={() => {
                setRefreshing(true);
                fetchPropertyList();
              }}
              title="Refresh database records"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>

            <Link href="/buy" className="admin-btn-action-outline" target="_blank" title="Preview public website">
              <ExternalLink size={14} />
              <span>View Live Site ↗</span>
            </Link>

            <button
              type="button"
              className="admin-btn-add-primary"
              onClick={handleOpenCreate}
              id="admin-add-prop-btn"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Property</span>
            </button>

            <button
              type="button"
              className="admin-btn-action-outline danger"
              onClick={() => setShowSignOutConfirm(true)}
              title="Sign out of dealer session"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
        {/* KPI Executive Summary Grid */}
        <section className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon-wrap primary">
              <Building2 size={22} />
            </div>
            <div className="admin-kpi-details">
              <span className="admin-kpi-label">Active Portfolio</span>
              <span className="admin-kpi-value">{stats.total}</span>
              <span className="admin-kpi-sub">{stats.forSale} For Sale · {stats.forRent + stats.shortTerm} Rentals</span>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon-wrap success">
              <DollarSign size={22} />
            </div>
            <div className="admin-kpi-details">
              <span className="admin-kpi-label">Inventory Valuation</span>
              <span className="admin-kpi-value">{stats.totalValuation}</span>
              <span className="admin-kpi-sub">Avg ~ {stats.avgPrice} / listing</span>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon-wrap warning">
              <TrendingUp size={22} />
            </div>
            <div className="admin-kpi-details">
              <span className="admin-kpi-label">Trending on Live Site</span>
              <span className="admin-kpi-value">{stats.trending}</span>
              <span className="admin-kpi-sub">Featured in Homepage Showcase</span>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon-wrap info">
              <Users size={22} />
            </div>
            <div className="admin-kpi-details">
              <span className="admin-kpi-label">Buyer Leads & CRM</span>
              <span className="admin-kpi-value">{stats.totalLeads}</span>
              <span className="admin-kpi-sub">{stats.activeVisits} Site Visits Scheduled</span>
            </div>
          </div>
        </section>

        {/* Section Tabs */}
        <div className="admin-tabs-nav">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === "properties" ? "active" : ""}`}
            onClick={() => setActiveTab("properties")}
          >
            <Home size={16} />
            <span>Properties Portfolio</span>
            <span className="admin-tab-count">{properties.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === "leads" ? "active" : ""}`}
            onClick={() => setActiveTab("leads")}
          >
            <MessageSquare size={16} />
            <span>Buyer Inquiries & Leads</span>
            <span className="admin-tab-count">{leads.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <Layers size={16} />
            <span>City & Market Distribution</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: PROPERTIES PORTFOLIO MANAGEMENT */}
        {/* ================================================================= */}
        <div
          className={`admin-tab-panel ${activeTab === "properties" ? "active" : ""}`}
          style={{ display: activeTab === "properties" ? "block" : "none" }}
        >
          <div>
            {/* Filter & Search Toolbar */}
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
                {/* Search Bar */}
                <div className="admin-search-wrap">
                  <Search size={16} className="admin-search-icon" />
                  <input
                    type="text"
                    className="admin-search-input"
                    placeholder="Search name, locality, or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#a8a29e", cursor: "pointer" }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Mode Filter */}
                <select
                  className="admin-filter-select"
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  aria-label="Filter by listing mode"
                >
                  <option value="all">All Modes (Buy, Rent, Stay)</option>
                  <option value="buy">For Sale Only</option>
                  <option value="rent">Long-term Rentals</option>
                  <option value="short-term">Short-term Stays</option>
                  <option value="trending">⭐ Trending Listings Only</option>
                </select>

                {/* City Filter */}
                <select
                  className="admin-filter-select"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  aria-label="Filter by city"
                >
                  <option value="all">All Gujarat Cities</option>
                  {GUJARAT_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* Type Filter */}
                <select
                  className="admin-filter-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  aria-label="Filter by property type"
                >
                  <option value="all">All Property Types</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="admin-toolbar-right">
                {/* Sort dropdown */}
                <select
                  className="admin-filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort properties"
                >
                  <option value="newest">Sort: Newest Added</option>
                  <option value="price-high">Sort: Price (High to Low)</option>
                  <option value="price-low">Sort: Price (Low to High)</option>
                </select>

                {/* View switcher */}
                <div className="admin-view-toggle">
                  <button
                    type="button"
                    className={`admin-view-btn ${viewMode === "table" ? "active" : ""}`}
                    onClick={() => setViewMode("table")}
                    title="Table Spreadsheet View"
                  >
                    <List size={16} />
                  </button>
                  <button
                    type="button"
                    className={`admin-view-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => setViewMode("grid")}
                    title="Visual Card Grid View"
                  >
                    <LayoutGrid size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Counter & Active Filters Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", fontSize: "13px", color: "#78716c" }}>
              <span>
                Showing <strong>{filteredProperties.length}</strong> of {properties.length} properties
              </span>
              {(modeFilter !== "all" || cityFilter !== "all" || typeFilter !== "all" || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setModeFilter("all");
                    setCityFilter("all");
                    setTypeFilter("all");
                    setSearchQuery("");
                  }}
                  style={{ background: "none", border: "none", color: "#ee705b", cursor: "pointer", fontWeight: "600" }}
                >
                  Reset All Filters ✕
                </button>
              )}
            </div>

            {/* Loading Skeleton */}
            {loading && properties.length === 0 ? (
              <div style={{ background: "#ffffff", padding: "60px", textAlign: "center", borderRadius: "12px", border: "1px solid #e7e5e4" }}>
                <RefreshCw size={28} className="animate-spin" style={{ margin: "0 auto 12px", color: "#ee705b" }} />
                <p style={{ color: "#78716c", margin: 0 }}>Syncing properties from database...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              /* Empty state */
              <div style={{ background: "#ffffff", padding: "60px", textAlign: "center", borderRadius: "12px", border: "1px solid #e7e5e4" }}>
                <Building2 size={40} style={{ margin: "0 auto 12px", color: "#a8a29e" }} />
                <h3 style={{ fontSize: "18px", color: "#1d1e1a", margin: "0 0 8px" }}>No matching properties found</h3>
                <p style={{ color: "#78716c", maxWidth: "400px", margin: "0 auto 20px" }}>
                  Try changing your search terms or filters, or add a brand new property listing to your portfolio.
                </p>
                <button type="button" className="admin-btn-primary" onClick={handleOpenCreate}>
                  <Plus size={16} />
                  <span>Add First Property</span>
                </button>
              </div>
            ) : viewMode === "table" ? (
              /* ============================================================= */
              /* TABLE VIEW */
              /* ============================================================= */
              <div className="admin-table-container">
                <div className="admin-table-scroll">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Property & Locality</th>
                        <th>City</th>
                        <th>Mode</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Specs</th>
                        <th>Trending</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProperties.map((prop) => {
                        const coords = resolvePropertyCoordinates(prop);
                        const googleMapsPinUrl = getGoogleMapsPinUrl(coords.lat, coords.lng, prop.name);
                        return (
                          <tr key={prop.id}>
                            <td>
                              <div className="admin-prop-preview">
                                <img
                                  src={prop.image || PRESET_PHOTOS[0].url}
                                  alt={prop.name}
                                  className="admin-prop-thumb"
                                  onError={(e) => {
                                    e.target.src = PRESET_PHOTOS[0].url;
                                  }}
                                />
                                <div>
                                  <div className="admin-prop-title">{prop.name}</div>
                                  <div className="admin-prop-locality">
                                    <MapPin size={12} />
                                    <span>{prop.location || prop.city}</span>
                                    <a
                                      href={googleMapsPinUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="admin-prop-map-link"
                                      title={`Open exact marked pin for ${prop.name} on Google Maps`}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink size={10} />
                                      <span>Google Maps</span>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span style={{ fontWeight: "600", color: "#44403c" }}>{prop.city}</span>
                            </td>
                            <td>
                              <span className={`admin-mode-pill ${prop.mode || "buy"}`}>
                                {prop.mode === "buy" ? "For Sale" : prop.mode === "rent" ? "For Rent" : "Short-term"}
                              </span>
                            </td>
                            <td>
                              <span className="admin-tag-pill">{prop.type || "Villa"}</span>
                            </td>
                            <td>
                              <span className="admin-prop-price">
                                {prop.priceLabel || formatIndianCurrency(prop.price)}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: "12.5px", color: "#57534e" }}>
                                {prop.bedrooms ? `${prop.bedrooms} BHK` : ""}
                                {prop.bathrooms ? ` · ${prop.bathrooms} Ba` : ""}
                                {prop.size ? ` · ${prop.size} sq.ft` : ""}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className={`admin-trending-toggle ${prop.isTrending ? "active" : "inactive"}`}
                                onClick={() => handleToggleTrending(prop)}
                                title={prop.isTrending ? "Click to remove from homepage trending" : "Click to mark as trending on homepage"}
                              >
                                <Sparkles size={13} />
                                <span>{prop.isTrending ? "Trending" : "Standard"}</span>
                              </button>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div className="admin-action-btn-group" style={{ justifyContent: "flex-end" }}>
                                <button
                                  type="button"
                                  className="admin-icon-btn view"
                                  onClick={() => setSelectedViewProperty(prop)}
                                  title="View Property Details (Drawer)"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  type="button"
                                  className="admin-icon-btn"
                                  onClick={() => handleOpenEdit(prop)}
                                  title="Edit Property Details"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  type="button"
                                  className="admin-icon-btn delete"
                                  onClick={() => handleDeleteProperty(prop)}
                                  title="Delete Property Permanently"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* ============================================================= */
              /* GRID CARD VIEW */
              /* ============================================================= */
              <div className="admin-grid-container">
                {filteredProperties.map((prop) => {
                  const coords = resolvePropertyCoordinates(prop);
                  const googleMapsPinUrl = getGoogleMapsPinUrl(coords.lat, coords.lng, prop.name);
                  return (
                    <div key={prop.id} className="admin-grid-card">
                      <div className="admin-grid-img-wrap">
                        <img
                          src={prop.image || PRESET_PHOTOS[0].url}
                          alt={prop.name}
                          className="admin-grid-img"
                          onError={(e) => {
                            e.target.src = PRESET_PHOTOS[0].url;
                          }}
                        />
                        <div className="admin-grid-badges">
                          <span className={`admin-mode-pill ${prop.mode || "buy"}`}>
                            {prop.mode === "buy" ? "For Sale" : prop.mode === "rent" ? "For Rent" : "Short-term"}
                          </span>
                          {prop.isTrending && (
                            <span style={{ background: "rgba(18, 22, 25, 0.85)", color: "#fef08a", padding: "3px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <Sparkles size={11} /> Trending
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="admin-grid-body">
                        <div className="admin-grid-price-row">
                          <span className="admin-grid-price">
                            {prop.priceLabel || formatIndianCurrency(prop.price)}
                          </span>
                          <span className="admin-tag-pill">{prop.type}</span>
                        </div>

                        <h3 className="admin-grid-name">{prop.name}</h3>

                        <div className="admin-grid-location">
                          <MapPin size={13} />
                          <span>{prop.location || prop.city}</span>
                          <a
                            href={googleMapsPinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-prop-map-link"
                            title={`Open exact marked pin for ${prop.name} on Google Maps`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={11} />
                            <span>Google Maps</span>
                          </a>
                        </div>

                        <div className="admin-grid-specs">
                          <span>{prop.bedrooms} Bedrooms</span>
                          <span>·</span>
                          <span>{prop.bathrooms} Baths</span>
                          {prop.size && (
                            <>
                              <span>·</span>
                              <span>{prop.size} sq.ft</span>
                            </>
                          )}
                        </div>

                        <div className="admin-grid-footer">
                          <button
                            type="button"
                            className={`admin-trending-toggle ${prop.isTrending ? "active" : "inactive"}`}
                            onClick={() => handleToggleTrending(prop)}
                          >
                            <Sparkles size={13} />
                            <span>{prop.isTrending ? "Featured" : "Not Featured"}</span>
                          </button>

                          <div className="admin-action-btn-group">
                            <button
                              type="button"
                              className="admin-icon-btn view"
                              onClick={() => setSelectedViewProperty(prop)}
                              title="View Property Details (Drawer)"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              className="admin-icon-btn"
                              onClick={() => handleOpenEdit(prop)}
                              title="Edit Property"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              type="button"
                              className="admin-icon-btn delete"
                              onClick={() => handleDeleteProperty(prop)}
                              title="Delete Property"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* TAB 2: BUYER INQUIRIES & LEADS CRM */}
        {/* ================================================================= */}
        <div
          className={`admin-tab-panel ${activeTab === "leads" ? "active" : ""}`}
          style={{ display: activeTab === "leads" ? "block" : "none" }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 4px", color: "#1d1e1a" }}>
                  Client Inquiries & Deal Pipeline
                </h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#78716c" }}>
                  Incoming buyer requests, visit schedules, and transaction stages for your properties.
                </p>
              </div>

              <button
                type="button"
                className="admin-btn-primary"
                onClick={() => setIsAddLeadModalOpen(true)}
              >
                <Plus size={16} />
                <span>Log Walk-in Lead</span>
              </button>
            </div>

            <div className="admin-leads-grid">
              {leads.map((lead) => (
                <div key={lead.id} className="admin-lead-card">
                  <div className="admin-lead-header">
                    <div>
                      <h4 className="admin-lead-client-name">{lead.clientName}</h4>
                      <div className="admin-lead-time">{lead.date}</div>
                    </div>
                    <span className={`admin-mode-pill ${lead.mode === "rent" ? "rent" : "buy"}`}>
                      {lead.budget}
                    </span>
                  </div>

                  <div className="admin-lead-prop-tag">
                    <Home size={14} style={{ color: "#ee705b" }} />
                    <span style={{ fontWeight: "600" }}>{lead.property}</span>
                  </div>

                  <p className="admin-lead-msg">&ldquo;{lead.message}&rdquo;</p>

                  <div className="admin-lead-actions">
                    <select
                      className="admin-lead-status-select"
                      value={lead.status}
                      onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                    >
                      <option value="New Lead">🔵 New Lead</option>
                      <option value="Site Visit Scheduled">🟠 Visit Scheduled</option>
                      <option value="Under Negotiation">🟣 Under Negotiation</option>
                      <option value="Deal Closed">🟢 Deal Closed / Won</option>
                      <option value="Cold / Dropped">⚪ Cold / Dropped</option>
                    </select>

                    <div className="admin-lead-contact-btns">
                      <a href={`tel:${lead.phone}`} className="admin-lead-contact-btn call" title="Call Buyer">
                        <Phone size={12} />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(lead.clientName)},%20thank%20you%20for%20inquiring%20about%20${encodeURIComponent(lead.property)}%20with%20Fieldhouse%20Realty.`}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-lead-contact-btn wa"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare size={12} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* TAB 3: CITY & VALUATION ANALYTICS */}
        {/* ================================================================= */}
        <div
          className={`admin-tab-panel ${activeTab === "analytics" ? "active" : ""}`}
          style={{ display: activeTab === "analytics" ? "block" : "none" }}
        >
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 4px", color: "#1d1e1a" }}>
                Gujarat Market Distribution
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#78716c" }}>
                Portfolio inventory concentration, asset valuation, and average rates across major real estate hubs.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
              {cityAnalytics.map((c) => (
                <div key={c.name} style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e7e5e4", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "32px", height: "32px", background: "#fef3c7", color: "#d97706", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <MapPin size={16} />
                      </div>
                      <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1d1e1a" }}>{c.name}</h4>
                    </div>
                    <span style={{ background: "#f5f5f4", padding: "3px 9px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", color: "#44403c" }}>
                      {c.count} {c.count === 1 ? "Listing" : "Listings"}
                    </span>
                  </div>

                  <div style={{ borderTop: "1px solid #f0eee9", paddingTop: "12px", marginTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "#78716c" }}>Combined Valuation:</span>
                    <strong style={{ color: "#1d1e1a" }}>{formatIndianCurrency(c.totalVal)}</strong>
                  </div>

                  <div style={{ marginTop: "12px", background: "#f5f5f4", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        background: "#ee705b",
                        height: "100%",
                        width: `${Math.min(100, (c.count / properties.length) * 100)}%`,
                        borderRadius: "3px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ENTERPRISE PROPERTY EDITOR (MATCHING SCREENSHOT UI) */}
      {/* ===================================================================== */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box property-editor-modal" onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={handleSubmitProperty}
              onKeyDown={(e) => {
                // Prevent accidental Enter key press in any text input from submitting and closing modal
                if (e.key === "Enter" && e.target.tagName === "INPUT") {
                  e.preventDefault();
                }
              }}
              style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}
            >
              {/* TOP HEADER & TABS BAR */}
              <div className="admin-editor-top-nav">
                <div className="admin-editor-title-row">
                  <h2>
                    <span>{modalMode === "create" ? "Add property" : "Edit property"}</span>
                    <span className="admin-editor-title-badge">{formData.status}</span>
                  </h2>

                  <div className="admin-editor-top-actions">
                    <button
                      type="button"
                      className="admin-editor-icon-btn"
                      title="Close window"
                      onClick={() => {
                        setIsModalOpen(false);
                        if (typeof window !== "undefined") {
                          sessionStorage.removeItem("fieldhouse_admin_modal_open");
                          sessionStorage.removeItem("fieldhouse_admin_modal_mode");
                          sessionStorage.removeItem("fieldhouse_admin_editing_id");
                          sessionStorage.removeItem("fieldhouse_admin_editor_tab");
                          sessionStorage.removeItem("fieldhouse_admin_form_data");
                        }
                      }}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", width: "auto", padding: "0 14px", height: "36px" }}
                    >
                      <X size={16} />
                      <span style={{ fontSize: "12.5px", fontWeight: "600" }}>Close</span>
                    </button>
                  </div>
                </div>

                {/* TABS ROW (FIXED NON-SCROLLING HEADER TABS) */}
                <div className="admin-editor-tabs-bar">
                  <div className="admin-editor-tabs-list">
                    {[
                      "Information",
                      "Files",
                      "Location",
                      "Terms",
                      "Features",
                      "Fees",
                      "Dealer",
                    ].map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        className={`admin-tab-item-btn ${activeEditorTab === tab ? "active" : ""}`}
                        onClick={() => setActiveEditorTab(tab)}
                      >
                        {tab === "Dealer" ? "👤 Dealer Information" : tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TAB CONTENT BODY */}
              <div className="admin-editor-body">
                {/* ------------------------------------------------------------- */}
                {/* TAB 1: INFORMATION (1. BASIC DETAILS -> 2. UNIT DETAILS -> 3. SPECS) */}
                {/* ------------------------------------------------------------- */}
                {activeEditorTab === "Information" && (
                  <div className="admin-saas-grid-3col">
                    {/* Primary Row: Listing Mode Selector (Buy / Rent / Short-Term) */}
                    <div className="admin-saas-field col-span-3 admin-listing-mode-wrapper">
                      <div className="admin-listing-mode-header">
                        <label htmlFor="field-listing-mode-select" className="admin-listing-mode-label">
                          <Tag size={15} style={{ color: "#2563eb" }} />
                          <span>Listing Mode <span className="required-dot">*</span></span>
                        </label>
                        <span className="admin-listing-mode-tag">
                          Step 1: Choose Listing Purpose
                        </span>
                      </div>

                      {/* Interactive Visual Selector Cards */}
                      <div className="admin-listing-mode-cards-grid">
                        <button
                          type="button"
                          className={`admin-mode-card-btn ${formData.mode === "buy" ? "active" : ""}`}
                          onClick={() => handleFormChange("mode", "buy")}
                        >
                          <div className="admin-mode-card-icon">🏷️</div>
                          <div className="admin-mode-card-text">
                            <span className="mode-card-title">For Sale (Buy)</span>
                            <span className="mode-card-sub">Outright purchase, resale & projects</span>
                          </div>
                          {formData.mode === "buy" && <span className="mode-card-check">✓ Active</span>}
                        </button>

                        <button
                          type="button"
                          className={`admin-mode-card-btn ${formData.mode === "rent" ? "active" : ""}`}
                          onClick={() => handleFormChange("mode", "rent")}
                        >
                          <div className="admin-mode-card-icon">🔑</div>
                          <div className="admin-mode-card-text">
                            <span className="mode-card-title">For Rent</span>
                            <span className="mode-card-sub">Monthly lease & rental contracts</span>
                          </div>
                          {formData.mode === "rent" && <span className="mode-card-check">✓ Active</span>}
                        </button>

                        <button
                          type="button"
                          className={`admin-mode-card-btn ${formData.mode === "short-term" ? "active" : ""}`}
                          onClick={() => handleFormChange("mode", "short-term")}
                        >
                          <div className="admin-mode-card-icon">🌴</div>
                          <div className="admin-mode-card-text">
                            <span className="mode-card-title">Short-Term Stay</span>
                            <span className="mode-card-sub">Vacation villas & nightly tariffs</span>
                          </div>
                          {formData.mode === "short-term" && <span className="mode-card-check">✓ Active</span>}
                        </button>
                      </div>

                      {/* Sync Select Input for Accessibility / Form Submit */}
                      <select
                        id="field-listing-mode-select"
                        value={formData.mode}
                        onChange={(e) => handleFormChange("mode", e.target.value)}
                        style={{ display: "none" }}
                      >
                        <option value="buy">For Sale (Buy)</option>
                        <option value="rent">For Rent</option>
                        <option value="short-term">Short-Term Stay</option>
                      </select>
                    </div>

                    {/* Property Title / Name */}
                    <div className="admin-saas-field col-span-2">
                      <label htmlFor="field-prop-name">
                        <span>Property Title / Headline <span className="required-dot">*</span></span>
                      </label>
                      <input
                        id="field-prop-name"
                        type="text"
                        className="admin-saas-input"
                        placeholder="e.g. The Grand Juniper Villa or Skyline Horizon Luxury Apartment"
                        value={formData.name}
                        onChange={(e) => handleFormChange("name", e.target.value)}
                        required
                      />
                      <span className="admin-saas-subtext">Official headline title displayed to buyers and investors</span>
                    </div>

                    {/* Property Type */}
                    <div className="admin-saas-field">
                      <label htmlFor="field-type-main">
                        <span>Property Type <span className="required-dot">*</span></span>
                      </label>
                      <select
                        id="field-type-main"
                        className="admin-saas-select"
                        value={formData.type}
                        onChange={(e) => handleFormChange("type", e.target.value)}
                      >
                        {PROPERTY_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <span className="admin-saas-subtext">Determines unit details & layout options below</span>
                    </div>

                    {/* Project / Society Name */}
                    <div className="admin-saas-field col-span-2">
                      <label htmlFor="field-prop-society">
                        <span>Project / Society Name <span className="required-dot">*</span></span>
                      </label>
                      <input
                        id="field-prop-society"
                        type="text"
                        className="admin-saas-input"
                        placeholder="e.g. Shree Residency, Godrej Garden City, or Palm Meadows"
                        value={formData.society}
                        onChange={(e) => handleFormChange("society", e.target.value)}
                      />
                      <span className="admin-saas-subtext">Master residential scheme or commercial complex name</span>
                    </div>

                    {/* Listing Status */}
                    <div className="admin-saas-field">
                      <label htmlFor="field-status-main">Listing Status</label>
                      <select
                        id="field-status-main"
                        className="admin-saas-select"
                        value={formData.status}
                        onChange={(e) => handleFormChange("status", e.target.value)}
                      >
                        <option value="Published">Published (Active Online)</option>
                        <option value="Draft">Draft (Internal Only)</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Archived">Archived / Sold</option>
                      </select>
                    </div>

                    {/* Subtitle / Tagline */}
                    <div className="admin-saas-field col-span-2">
                      <label htmlFor="field-name-sub">Marketing Tagline / Subtitle</label>
                      <input
                        id="field-name-sub"
                        type="text"
                        className="admin-saas-input"
                        placeholder="e.g. Ultra-luxury residence overlooking central garden with private deck"
                        value={formData.nameSub}
                        onChange={(e) => handleFormChange("nameSub", e.target.value)}
                      />
                      <span className="admin-saas-subtext">Brief highlighted subtitle shown beneath the property title</span>
                    </div>

                    {/* Visibility */}
                    <div className="admin-saas-field">
                      <label htmlFor="field-visibility-select">Visibility</label>
                      <select
                        id="field-visibility-select"
                        className="admin-saas-select"
                        value={formData.visibility}
                        onChange={(e) => handleFormChange("visibility", e.target.value)}
                      >
                        <option value="Everyone">Everyone (Publicly Searchable)</option>
                        <option value="Registered Only">Registered Dealers & Buyers Only</option>
                        <option value="Private">Private / Direct Access Link</option>
                      </select>
                    </div>

                    {/* ========================================================= */}
                    {/* 2. PROPERTY UNIT DETAILS (DYNAMIC BY PROPERTY TYPE) */}
                    {/* Kept strictly separate from geographic address */}
                    {/* ========================================================= */}
                    <div className="col-span-3" style={{ margin: "14px 0 4px" }}>
                      <div className="admin-location-section-header">
                        <div className="admin-location-header-left">
                          <span className="admin-location-step-badge" style={{ background: "#0284c7" }}>Step 2</span>
                          <div>
                            <h4 className="admin-location-header-title">Property Unit Identification</h4>
                            <p className="admin-location-header-desc">
                              Internal unit details (Plot / Flat / Wing / Floor) — separated from geographic address for clean records
                            </p>
                          </div>
                        </div>
                        <span className="admin-hub-badge" style={{ background: "#f0f9ff", color: "#0369a1", borderColor: "#bae6fd" }}>
                          Type: {formData.type}
                        </span>
                      </div>
                    </div>

                    {/* DYNAMIC UNIT FIELDS: Plot / Land */}
                    {(formData.type === "Plot" || formData.type === "Land") && (
                      <>
                        <div className="admin-saas-field">
                          <label htmlFor="field-unit-plotno">
                            <span>Plot No. <span className="required-dot">*</span></span>
                          </label>
                          <input
                            id="field-unit-plotno"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. P-24 or Plot 108"
                            value={formData.plotNo}
                            onChange={(e) => handleFormChange("plotNo", e.target.value)}
                          />
                          <span className="admin-saas-subtext">Plot identification number inside layout</span>
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-unit-surveyno">
                            <span>Survey / Khasra No. (Optional)</span>
                          </label>
                          <input
                            id="field-unit-surveyno"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. Survey 142/2 or Revenue Survey 88"
                            value={formData.surveyNo}
                            onChange={(e) => handleFormChange("surveyNo", e.target.value)}
                          />
                          <span className="admin-saas-subtext">Government land registry record number</span>
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-plot-dimensions">Plot Dimensions</label>
                          <input
                            id="field-plot-dimensions"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. 40 x 85 ft"
                            value={formData.plotDimensions}
                            onChange={(e) => handleFormChange("plotDimensions", e.target.value)}
                          />
                          <span className="admin-saas-subtext">Frontage x depth dimensions</span>
                        </div>
                      </>
                    )}

                    {/* DYNAMIC UNIT FIELDS: Flat / Apartment / Penthouse / Studio */}
                    {(formData.type === "Apartment" || formData.type === "Penthouse" || formData.type === "Studio" || formData.type === "Duplex") && (
                      <>
                        <div className="admin-saas-field">
                          <label htmlFor="field-unit-wing">
                            <span>Wing / Block <span className="required-dot">*</span></span>
                          </label>
                          <input
                            id="field-unit-wing"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. A Wing or Block B"
                            value={formData.wing}
                            onChange={(e) => handleFormChange("wing", e.target.value)}
                          />
                          <span className="admin-saas-subtext">Tower wing or block letter</span>
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-unit-floor">
                            <span>Floor No. <span className="required-dot">*</span></span>
                          </label>
                          <input
                            id="field-unit-floor"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. 5 or 7th Floor"
                            value={formData.floor}
                            onChange={(e) => handleFormChange("floor", e.target.value)}
                          />
                          <span className="admin-saas-subtext">Floor level in the building</span>
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-unit-flatno">
                            <span>Unit / Flat No. <span className="required-dot">*</span></span>
                          </label>
                          <input
                            id="field-unit-flatno"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. 502 or Flat 4B"
                            value={formData.flatNo}
                            onChange={(e) => handleFormChange("flatNo", e.target.value)}
                          />
                          <span className="admin-saas-subtext">Individual flat or door number</span>
                        </div>
                      </>
                    )}

                    {/* DYNAMIC UNIT FIELDS: Villa / Bungalow / Row House */}
                    {(formData.type === "Villa" || formData.type === "Bungalow" || formData.type === "Row House") && (
                      <>
                        <div className="admin-saas-field">
                          <label htmlFor="field-unit-villano">
                            <span>House / Villa No. <span className="required-dot">*</span></span>
                          </label>
                          <input
                            id="field-unit-villano"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. Villa 12 or House #24"
                            value={formData.villaNo}
                            onChange={(e) => handleFormChange("villaNo", e.target.value)}
                          />
                          <span className="admin-saas-subtext">Individual villa or bungalow number</span>
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-unit-stories">Stories / Levels</label>
                          <select
                            id="field-unit-stories"
                            className="admin-saas-select"
                            value={formData.stories}
                            onChange={(e) => handleFormChange("stories", e.target.value)}
                          >
                            <option value="Ground Only">Ground Only (Single Floor)</option>
                            <option value="G+1 Floor">G+1 Floor (Duplex)</option>
                            <option value="G+2 Floors">G+2 Floors (Triplex)</option>
                            <option value="G+3 Floors">G+3 Floors</option>
                          </select>
                          <span className="admin-saas-subtext">Elevation levels of the villa</span>
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-unit-plotarea">Plot Area (sq.yards)</label>
                          <input
                            id="field-unit-plotarea"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. 450 sq.yards"
                            value={formData.plotArea}
                            onChange={(e) => handleFormChange("plotArea", e.target.value)}
                          />
                          <span className="admin-saas-subtext">Total private land parcel</span>
                        </div>
                      </>
                    )}

                    {/* DYNAMIC UNIT FIELDS: Commercial / Office / Shop */}
                    {(formData.type === "Commercial" || formData.type === "Office" || formData.type === "Shop") && (
                      <>
                        <div className="admin-saas-field">
                          <label htmlFor="field-unit-wing-comm">Tower / Block</label>
                          <input
                            id="field-unit-wing-comm"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. Tower B or East Wing"
                            value={formData.wing}
                            onChange={(e) => handleFormChange("wing", e.target.value)}
                          />
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-unit-floor-comm">Floor No.</label>
                          <input
                            id="field-unit-floor-comm"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. 3rd Floor"
                            value={formData.floor}
                            onChange={(e) => handleFormChange("floor", e.target.value)}
                          />
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-unit-flatno-comm">
                            <span>Unit / Shop / Office No. <span className="required-dot">*</span></span>
                          </label>
                          <input
                            id="field-unit-flatno-comm"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. Unit 304 or Shop 12"
                            value={formData.flatNo}
                            onChange={(e) => handleFormChange("flatNo", e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    {/* ========================================================= */}
                    {/* STANDARD PROPERTY SPECIFICATIONS (NORMAL OPTIONS) */}
                    {/* ========================================================= */}
                    <div className="col-span-3" style={{ margin: "6px 0 2px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
                        <Home size={15} style={{ color: "#0369a1" }} />
                        <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#0f172a" }}>Property Specifications</span>
                      </div>
                    </div>

                    {/* Bedrooms (BHK) */}
                    <div className="admin-saas-field">
                      <label htmlFor="field-common-bhk">Bedrooms (BHK)</label>
                      <select
                        id="field-common-bhk"
                        className="admin-saas-select"
                        value={formData.bedrooms}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 1;
                          handleFormChange("bedrooms", val);
                          handleFormChange("layout", `${val} BHK`);
                        }}
                      >
                        <option value="1">1 BHK / 1 Bed</option>
                        <option value="2">2 BHK / 2 Bed</option>
                        <option value="3">3 BHK / 3 Bed</option>
                        <option value="4">4 BHK / 4 Bed</option>
                        <option value="5">5+ BHK / 5 Bed</option>
                      </select>
                    </div>

                    {/* Bathrooms */}
                    <div className="admin-saas-field">
                      <label htmlFor="field-common-bathrooms">Bathrooms</label>
                      <select
                        id="field-common-bathrooms"
                        className="admin-saas-select"
                        value={formData.bathrooms}
                        onChange={(e) => handleFormChange("bathrooms", Number(e.target.value) || 1)}
                      >
                        <option value="1">1 Bathroom</option>
                        <option value="2">2 Bathrooms</option>
                        <option value="3">3 Bathrooms</option>
                        <option value="4">4 Bathrooms</option>
                        <option value="5">5+ Bathrooms</option>
                      </select>
                    </div>

                    {/* Balconies */}
                    <div className="admin-saas-field">
                      <label htmlFor="field-common-balconies">Balconies</label>
                      <select
                        id="field-common-balconies"
                        className="admin-saas-select"
                        value={formData.balconies}
                        onChange={(e) => handleFormChange("balconies", e.target.value)}
                      >
                        <option value="0">No Balcony</option>
                        <option value="1">1 Balcony</option>
                        <option value="2">2 Balconies</option>
                        <option value="3">3+ Balconies</option>
                      </select>
                    </div>

                    {/* Built-up Area */}
                    <div className="admin-saas-field">
                      <label htmlFor="field-common-size">Built-up Area (sq. ft) <span className="required-dot">*</span></label>
                      <input
                        id="field-common-size"
                        type="number"
                        className="admin-saas-input"
                        placeholder="e.g. 1850"
                        value={formData.size}
                        onChange={(e) => handleFormChange("size", e.target.value)}
                        required
                      />
                    </div>

                    {/* Furnishing */}
                    <div className="admin-saas-field">
                      <label htmlFor="field-common-furnishing">Furnishing Status</label>
                      <select
                        id="field-common-furnishing"
                        className="admin-saas-select"
                        value={formData.furnishing}
                        onChange={(e) => handleFormChange("furnishing", e.target.value)}
                      >
                        <option value="Unfurnished">Unfurnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Fully Furnished">Fully Furnished</option>
                      </select>
                    </div>

                    {/* Floor */}
                    <div className="admin-saas-field">
                      <label htmlFor="field-common-floor">Floor</label>
                      <input
                        id="field-common-floor"
                        type="text"
                        className="admin-saas-input"
                        placeholder="e.g. 4th Floor / Ground Floor"
                        value={formData.floor}
                        onChange={(e) => handleFormChange("floor", e.target.value)}
                      />
                    </div>

                    {/* Parking */}
                    <div className="admin-saas-field">
                      <label htmlFor="field-common-parking">Dedicated Parking</label>
                      <select
                        id="field-common-parking"
                        className="admin-saas-select"
                        value={formData.parkingSlots}
                        onChange={(e) => handleFormChange("parkingSlots", e.target.value)}
                      >
                        <option value="1 Covered Dedicated">1 Covered Parking</option>
                        <option value="2 Covered Dedicated">2 Covered Parking</option>
                        <option value="Open Parking">Open Parking</option>
                        <option value="No Parking">No Parking</option>
                      </select>
                    </div>

                    {/* Common Quality Features (For all properties) */}
                    <div className="admin-saas-field">
                      <label htmlFor="field-common-condition">Construction Condition / Age</label>
                      <select
                        id="field-common-condition"
                        className="admin-saas-select"
                        value={formData.moveInCondition}
                        onChange={(e) => handleFormChange("moveInCondition", e.target.value)}
                      >
                        <option value="Ready to Move">Ready to Move (Immediate Handover)</option>
                        <option value="Under Construction">Under Construction</option>
                        <option value="Brand New Launch">Brand New Launch (Pre-Booking)</option>
                        <option value="Resale Ready">Resale Ready</option>
                      </select>
                    </div>

                    <div className="admin-saas-field">
                      <label htmlFor="field-common-facing">Vastu / Facing Orientation</label>
                      <select
                        id="field-common-facing"
                        className="admin-saas-select"
                        value={formData.facing}
                        onChange={(e) => handleFormChange("facing", e.target.value)}
                      >
                        <option value="East (Vastu Compliant)">East Facing (100% Vastu Compliant)</option>
                        <option value="North (Prosperity Facing)">North Facing</option>
                        <option value="North-East (Ishan Corner)">North-East Corner</option>
                        <option value="West Facing">West Facing</option>
                        <option value="South Facing">South Facing</option>
                      </select>
                    </div>

                    <div className="admin-saas-field">
                      <label htmlFor="field-common-water">Water Supply System</label>
                      <select
                        id="field-common-water"
                        className="admin-saas-select"
                        value={formData.waterSupply}
                        onChange={(e) => handleFormChange("waterSupply", e.target.value)}
                      >
                        <option value="24/7 Municipal Corporation + Borewell">24/7 Municipal Corporation + Borewell</option>
                        <option value="Municipal Corporation Only">Municipal Corporation Connection Only</option>
                        <option value="Borewell + RO Water Treatment Plant">Borewell + RO Water Treatment Plant</option>
                      </select>
                    </div>

                    <div className="admin-saas-field col-span-3">
                      <label htmlFor="field-common-desc">Detailed Property Overview & Description</label>
                      <textarea
                        id="field-common-desc"
                        rows={3}
                        className="admin-saas-textarea"
                        placeholder="Highlight architectural excellence, premium Italian finishes, surrounding lifestyle conveniences, and investment potential..."
                        value={formData.description}
                        onChange={(e) => handleFormChange("description", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 2: FILES & REAL PHOTO UPLOAD FROM DEVICE */}
                {/* ------------------------------------------------------------- */}
                {activeEditorTab === "Files" && (
                  <div>
                    <div style={{ marginBottom: "20px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 4px", color: "#111827" }}>
                        Property Media & Photo Gallery
                      </h3>
                      <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                        Upload real photographs directly from your computer, set your primary cover image, or pick from architectural presets.
                      </p>
                    </div>

                    {/* Drag & Drop Photo Upload Zone */}
                    <div
                      className={`admin-photo-upload-dropzone ${isDragging ? "dragover" : ""}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        handlePhotoFiles(e.dataTransfer.files);
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={(e) => handlePhotoFiles(e.target.files)}
                      />
                      <div className="admin-upload-icon-circle">
                        <UploadCloud size={26} />
                      </div>
                      <div className="admin-upload-prompt-text">
                        <span>Click to browse photo files</span> or drag and drop images here
                      </div>
                      <div className="admin-upload-subtext">
                        Supports PNG, JPG, JPEG, WEBP, AVIF (Multiple files supported simultaneously)
                      </div>
                    </div>

                    {/* Gallery Thumbnails Grid */}
                    {(formData.galleryImages || []).length > 0 && (
                      <div style={{ marginTop: "24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: "#1f2937" }}>
                            Active Photo Gallery ({(formData.galleryImages || []).length} Photos)
                          </span>
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>
                            Hover over any image to set it as Cover or Delete
                          </span>
                        </div>

                        <div className="admin-gallery-preview-grid">
                          {(formData.galleryImages || []).map((imgUrl, idx) => {
                            const isCover = formData.image === imgUrl;
                            return (
                              <div key={idx} className={`admin-gallery-thumb-item ${isCover ? "is-cover" : ""}`}>
                                <img src={imgUrl} alt={`Photo ${idx + 1}`} className="admin-gallery-thumb-img" />
                                {isCover && (
                                  <span className="admin-gallery-cover-badge">★ Cover</span>
                                )}
                                <div className="admin-gallery-thumb-actions">
                                  {!isCover && (
                                    <button
                                      type="button"
                                      className="admin-thumb-action-btn"
                                      onClick={() => handleSetCoverPhoto(imgUrl)}
                                      title="Set as Cover Photo"
                                    >
                                      Set Cover
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    className="admin-thumb-action-btn delete"
                                    onClick={() => handleRemovePhoto(idx)}
                                    title="Delete Photo"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Curated Presets */}
                    <div style={{ marginTop: "26px" }}>
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" }}>
                        Or choose from curated architectural photography presets:
                      </label>
                      <div className="admin-preset-photos">
                        {PRESET_PHOTOS.map((p, idx) => (
                          <img
                            key={idx}
                            src={p.url}
                            alt={p.label}
                            title={`${p.label} (Click to set as cover)`}
                            className={`admin-preset-thumb ${formData.image === p.url ? "active" : ""}`}
                            onClick={() => {
                              handleSetCoverPhoto(p.url);
                              if (!formData.galleryImages?.includes(p.url)) {
                                setFormData((prev) => ({
                                  ...prev,
                                  galleryImages: [...(prev.galleryImages || []), p.url],
                                }));
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Direct URL Input */}
                    <div className="admin-saas-field" style={{ marginTop: "20px" }}>
                      <label htmlFor="prop-image-input-url">Direct High-Resolution Photo Web URL</label>
                      <input
                        id="prop-image-input-url"
                        type="url"
                        className="admin-saas-input"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.image}
                        onChange={(e) => handleFormChange("image", e.target.value)}
                      />
                    </div>

                    {/* Live Preview */}
                    {formData.image && (
                      <div style={{ marginTop: "18px" }}>
                        <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                          Active Cover Photo Live Preview:
                        </span>
                        <div style={{ height: "230px", borderRadius: "10px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
                          <img
                            src={formData.image}
                            alt="Cover Preview"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => { e.target.src = PRESET_PHOTOS[0].url; }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 3: TERMS (PURE LEGAL, POSSESSION, & CONTRACT TERMS) */}
                {/* ------------------------------------------------------------- */}
                {activeEditorTab === "Terms" && (
                  <div className="admin-saas-grid-3col">
                    <div className="admin-saas-field">
                      <label htmlFor="field-terms-mode">Listing Mode</label>
                      <select
                        id="field-terms-mode"
                        className="admin-saas-select"
                        value={formData.mode}
                        onChange={(e) => handleFormChange("mode", e.target.value)}
                      >
                        <option value="buy">For Sale (Outright Purchase)</option>
                        <option value="rent">Rental (Monthly Lease)</option>
                        <option value="short-term">Short-term Stay (Per Night)</option>
                      </select>
                      <span className="admin-saas-subtext">Determines contractual terms & pricing fee structures</span>
                    </div>

                    <div className="admin-saas-field">
                      <label htmlFor="field-terms-possession">Possession Timeline</label>
                      <select
                        id="field-terms-possession"
                        className="admin-saas-select"
                        value={formData.possessionTimeline}
                        onChange={(e) => handleFormChange("possessionTimeline", e.target.value)}
                      >
                        <option value="Immediate Possession (Ready to Move)">Immediate Possession (Ready to Move)</option>
                        <option value="Within 30 to 60 Days">Within 30 to 60 Days</option>
                        <option value="Under Construction (Possession in 6 Months)">Under Construction (Possession in 6 Months)</option>
                        <option value="Possession in 1 Year">Possession in 1 Year</option>
                        <option value="New Project Launch (2-3 Years)">New Project Launch (2-3 Years)</option>
                      </select>
                    </div>

                    <div className="admin-saas-field">
                      <label htmlFor="field-terms-title">Ownership Title Status</label>
                      <select
                        id="field-terms-title"
                        className="admin-saas-select"
                        value={formData.ownershipTitle}
                        onChange={(e) => handleFormChange("ownershipTitle", e.target.value)}
                      >
                        <option value="Freehold Title (Clear & Marketable)">Freehold Title (Clear & Marketable)</option>
                        <option value="Leasehold (99-Year Authority Lease)">Leasehold (99-Year Authority Lease)</option>
                        <option value="Co-operative Housing Society (Share Certificate)">Co-operative Housing Society (Share Certificate)</option>
                        <option value="Power of Attorney">Power of Attorney</option>
                      </select>
                    </div>

                    <div className="admin-saas-field">
                      <label htmlFor="field-terms-rera-status">RERA Registration Status</label>
                      <select
                        id="field-terms-rera-status"
                        className="admin-saas-select"
                        value={formData.reraApproved}
                        onChange={(e) => handleFormChange("reraApproved", e.target.value)}
                      >
                        <option value="RERA Approved & Registered">RERA Approved & Registered</option>
                        <option value="RERA Applied / Registration in Progress">RERA Applied / Registration in Progress</option>
                        <option value="RERA Exempted (Completed prior to act)">RERA Exempted (Completed prior to act)</option>
                      </select>
                    </div>

                    <div className="admin-saas-field col-span-2">
                      <label htmlFor="field-terms-rera-num">RERA Registration Number</label>
                      <input
                        id="field-terms-rera-num"
                        type="text"
                        className="admin-saas-input"
                        placeholder="e.g. PR/GJ/AHMEDABAD/AUDA/RAA09876/010124"
                        value={formData.reraNumber}
                        onChange={(e) => handleFormChange("reraNumber", e.target.value)}
                      />
                      <span className="admin-saas-subtext">Gujarat RERA portal verified registration identifier</span>
                    </div>

                    <div className="admin-saas-field">
                      <label htmlFor="field-terms-negotiability">Price Negotiability</label>
                      <select
                        id="field-terms-negotiability"
                        className="admin-saas-select"
                        value={formData.priceNegotiability}
                        onChange={(e) => handleFormChange("priceNegotiability", e.target.value)}
                      >
                        <option value="Slightly Negotiable">Slightly Negotiable</option>
                        <option value="Fixed Price / Non-negotiable">Fixed Price / Non-negotiable</option>
                        <option value="Negotiable across the table for quick closing">Negotiable across the table for quick closing</option>
                      </select>
                    </div>

                    <div className="admin-saas-field col-span-2">
                      <label htmlFor="field-terms-loan">Approved Home Loan Institutions</label>
                      <input
                        id="field-terms-loan"
                        type="text"
                        className="admin-saas-input"
                        placeholder="e.g. Approved by SBI, HDFC, ICICI, Bank of Baroda, Axis Bank"
                        value={formData.loanStatus}
                        onChange={(e) => handleFormChange("loanStatus", e.target.value)}
                      />
                      <span className="admin-saas-subtext">List banks with active APF / pre-approved home loan numbers</span>
                    </div>

                    <div className="admin-saas-field">
                      <label htmlFor="field-terms-built">Year of Construction</label>
                      <input
                        id="field-terms-built"
                        type="text"
                        className="admin-saas-input"
                        placeholder="e.g. 2024"
                        value={formData.builtDate}
                        onChange={(e) => handleFormChange("builtDate", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 4: FEES (DYNAMICALLY RENDERED BASED ON LISTING MODE) */}
                {/* ------------------------------------------------------------- */}
                {activeEditorTab === "Fees" && (
                  <div className="admin-saas-grid-3col">
                    {/* Header badge showing current mode */}
                    <div className="admin-type-specific-header">
                      <span className="admin-type-header-title">
                        <DollarSign size={16} style={{ color: "#15803d" }} />
                        {formData.mode === "buy" ? "For Sale: Purchase & Transaction Fee Breakdown" :
                          formData.mode === "rent" ? "Rental: Monthly Lease & Move-in Fee Structure" :
                            "Short-Term Stay: Nightly Tariff & Guest Fee Breakdown"}
                      </span>
                      <span className="admin-type-header-badge" style={{ background: "#dcfce7", color: "#15803d" }}>
                        Mode: {formData.mode.toUpperCase()}
                      </span>
                    </div>

                    {/* CASE A: FOR SALE (BUY) */}
                    {formData.mode === "buy" && (
                      <>
                        <div className="admin-saas-field">
                          <label htmlFor="field-buy-price">
                            <span>Base Property Sale Price (INR) <span className="required-dot">*</span></span>
                            <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "700" }}>{formData.priceLabel}</span>
                          </label>
                          <input
                            id="field-buy-price"
                            type="number"
                            className="admin-saas-input"
                            value={formData.price}
                            onChange={(e) => handleFormChange("price", e.target.value)}
                            required
                          />
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-buy-token">Booking / Token Advance Amount (INR)</label>
                          <input
                            id="field-buy-token"
                            type="number"
                            className="admin-saas-input"
                            placeholder="e.g. 500000"
                            value={formData.tokenAmount}
                            onChange={(e) => handleFormChange("tokenAmount", e.target.value)}
                          />
                          <span className="admin-saas-subtext">Initial earnest money deposit to block the unit</span>
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-buy-stamp">Gujarat Stamp Duty & Reg. Rate (%)</label>
                          <input
                            id="field-buy-stamp"
                            type="number"
                            step="0.1"
                            className="admin-saas-input"
                            value={formData.stampDutyPct}
                            onChange={(e) => handleFormChange("stampDutyPct", e.target.value)}
                          />
                          <span className="admin-saas-subtext">Standard Gujarat govt charges ~4.9% stamp + 1% registration</span>
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-buy-brokerage">Dealer Brokerage / Agency Fee</label>
                          <select
                            id="field-buy-brokerage"
                            className="admin-saas-select"
                            value={formData.brokerageCommission}
                            onChange={(e) => handleFormChange("brokerageCommission", e.target.value)}
                          >
                            <option value="1%">1% Standard Dealer Brokerage</option>
                            <option value="2%">2% Comprehensive Advisory Fee</option>
                            <option value="Zero Brokerage">Zero Brokerage (Builder Direct Deal)</option>
                          </select>
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-buy-transfer">Society Transfer & Legal Charges (INR)</label>
                          <input
                            id="field-buy-transfer"
                            type="number"
                            className="admin-saas-input"
                            value={formData.transferFee}
                            onChange={(e) => handleFormChange("transferFee", e.target.value)}
                          />
                          <span className="admin-saas-subtext">Estimated advocate legal search title report & society NOC</span>
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-buy-pricelabel">Display Price Label on Public Site</label>
                          <input
                            id="field-buy-pricelabel"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. INR 2.48 Cr"
                            value={formData.priceLabel}
                            onChange={(e) => handleFormChange("priceLabel", e.target.value)}
                          />
                        </div>

                        {/* ESTIMATED TOTAL INVESTMENT BREAKDOWN CARD */}
                        <div className="admin-pricing-card">
                          <div className="admin-pricing-card-title">
                            <Percent size={15} style={{ color: "#ee705b" }} />
                            <span>Estimated Total Acquisition Investment Breakdown (Gujarat Standard)</span>
                          </div>
                          <div className="admin-pricing-grid">
                            <div className="admin-pricing-item">
                              <div className="admin-pricing-item-label">Property Base Price</div>
                              <div className="admin-pricing-item-val">{formatIndianCurrency(formData.price)}</div>
                            </div>
                            <div className="admin-pricing-item">
                              <div className="admin-pricing-item-label">Stamp Duty & Registration (~{formData.stampDutyPct || 5.9}%)</div>
                              <div className="admin-pricing-item-val">{formatIndianCurrency((Number(formData.price) || 0) * ((Number(formData.stampDutyPct) || 5.9) / 100))}</div>
                            </div>
                            <div className="admin-pricing-item">
                              <div className="admin-pricing-item-label">Brokerage Commission (1%)</div>
                              <div className="admin-pricing-item-val">{formatIndianCurrency((Number(formData.price) || 0) * 0.01)}</div>
                            </div>
                            <div className="admin-pricing-item">
                              <div className="admin-pricing-item-label">Legal / Transfer NOC</div>
                              <div className="admin-pricing-item-val">INR {Number(formData.transferFee || 50000).toLocaleString("en-IN")}</div>
                            </div>
                            <div className="admin-pricing-item" style={{ background: "#ecfdf5", borderColor: "#a7f3d0" }}>
                              <div className="admin-pricing-item-label" style={{ color: "#065f46" }}>Grand Total Outlay</div>
                              <div className="admin-pricing-item-val highlight">
                                {formatIndianCurrency(
                                  (Number(formData.price) || 0) * (1 + ((Number(formData.stampDutyPct) || 5.9) / 100) + 0.01) + Number(formData.transferFee || 50000)
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* CASE B: RENTAL (RENT) */}
                    {formData.mode === "rent" && (
                      <>
                        <div className="admin-saas-field">
                          <label htmlFor="field-rent-price">
                            <span>Monthly Rent (INR / month) <span className="required-dot">*</span></span>
                            <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: "700" }}>{formData.priceLabel}</span>
                          </label>
                          <input
                            id="field-rent-price"
                            type="number"
                            className="admin-saas-input"
                            value={formData.price}
                            onChange={(e) => {
                              handleFormChange("price", e.target.value);
                              handleFormChange("monthlyRent", e.target.value);
                            }}
                            required
                          />
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-rent-deposit">Refundable Security Deposit (INR)</label>
                          <input
                            id="field-rent-deposit"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. INR 1,35,000 (3 Months Rent)"
                            value={formData.securityDeposit}
                            onChange={(e) => handleFormChange("securityDeposit", e.target.value)}
                          />
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-rent-maintenance">Monthly Society Maintenance Fee</label>
                          <input
                            id="field-rent-maintenance"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. INR 3,500 / mo"
                            value={formData.maintenance}
                            onChange={(e) => handleFormChange("maintenance", e.target.value)}
                          />
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-rent-lockin">Lock-in Period</label>
                          <select
                            id="field-rent-lockin"
                            className="admin-saas-select"
                            value={formData.lockinPeriod}
                            onChange={(e) => handleFormChange("lockinPeriod", e.target.value)}
                          >
                            <option value="6 Months">6 Months</option>
                            <option value="11 Months">11 Months (Standard Registered Agreement)</option>
                            <option value="1 Year">1 Year</option>
                            <option value="2 Years">2 Years (Corporate Lease)</option>
                          </select>
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-rent-notice">Notice Period</label>
                          <select
                            id="field-rent-notice"
                            className="admin-saas-select"
                            value={formData.noticePeriod}
                            onChange={(e) => handleFormChange("noticePeriod", e.target.value)}
                          >
                            <option value="1 Month">1 Month Notice</option>
                            <option value="2 Months">2 Months Notice</option>
                            <option value="3 Months">3 Months Notice</option>
                          </select>
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-rent-pricelabel">Display Rate on Website</label>
                          <input
                            id="field-rent-pricelabel"
                            type="text"
                            className="admin-saas-input"
                            placeholder="e.g. INR 45,000 / mo"
                            value={formData.priceLabel}
                            onChange={(e) => handleFormChange("priceLabel", e.target.value)}
                          />
                        </div>

                        {/* RENTAL MOVE-IN INITIAL OUTLAY CARD */}
                        <div className="admin-pricing-card">
                          <div className="admin-pricing-card-title">
                            <Clock size={15} style={{ color: "#1d4ed8" }} />
                            <span>Estimated Move-In Capital Outlay for Tenant</span>
                          </div>
                          <div className="admin-pricing-grid">
                            <div className="admin-pricing-item">
                              <div className="admin-pricing-item-label">1st Month Rent Advance</div>
                              <div className="admin-pricing-item-val">{formatIndianCurrency(formData.price)}</div>
                            </div>
                            <div className="admin-pricing-item">
                              <div className="admin-pricing-item-label">Security Deposit (Approx 3x)</div>
                              <div className="admin-pricing-item-val">{formData.securityDeposit || formatIndianCurrency((Number(formData.price) || 0) * 3)}</div>
                            </div>
                            <div className="admin-pricing-item">
                              <div className="admin-pricing-item-label">Dealer Brokerage (1 Month)</div>
                              <div className="admin-pricing-item-val">{formatIndianCurrency(formData.price)}</div>
                            </div>
                            <div className="admin-pricing-item" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                              <div className="admin-pricing-item-label" style={{ color: "#1e40af" }}>Initial Move-In Sum</div>
                              <div className="admin-pricing-item-val highlight" style={{ color: "#1d4ed8" }}>
                                {formatIndianCurrency((Number(formData.price) || 0) * 5)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* CASE C: SHORT-TERM STAY */}
                    {formData.mode === "short-term" && (
                      <>
                        <div className="admin-saas-field">
                          <label htmlFor="field-st-nightly">
                            <span>Base Nightly Rate (INR / night) <span className="required-dot">*</span></span>
                            <span style={{ fontSize: "11px", color: "#7e22ce", fontWeight: "700" }}>{formData.priceLabel}</span>
                          </label>
                          <input
                            id="field-st-nightly"
                            type="number"
                            className="admin-saas-input"
                            value={formData.price}
                            onChange={(e) => {
                              handleFormChange("price", e.target.value);
                              handleFormChange("nightlyRate", e.target.value);
                            }}
                            required
                          />
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-st-weekend">Weekend Night Surcharge (INR)</label>
                          <input
                            id="field-st-weekend"
                            type="number"
                            className="admin-saas-input"
                            placeholder="e.g. 1500"
                            value={formData.weekendSurcharge}
                            onChange={(e) => handleFormChange("weekendSurcharge", e.target.value)}
                          />
                          <span className="admin-saas-subtext">Additional fee per night on Friday & Saturday</span>
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-st-cleaning">One-Time Professional Cleaning Fee (INR)</label>
                          <input
                            id="field-st-cleaning"
                            type="number"
                            className="admin-saas-input"
                            placeholder="e.g. 1200"
                            value={formData.cleaningFee}
                            onChange={(e) => handleFormChange("cleaningFee", e.target.value)}
                          />
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-st-deposit">Refundable Security Deposit (INR)</label>
                          <input
                            id="field-st-deposit"
                            type="number"
                            className="admin-saas-input"
                            placeholder="e.g. 5000"
                            value={formData.refundableDeposit}
                            onChange={(e) => handleFormChange("refundableDeposit", e.target.value)}
                          />
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-st-extra">Extra Guest Fee (INR / person / night)</label>
                          <input
                            id="field-st-extra"
                            type="number"
                            className="admin-saas-input"
                            placeholder="e.g. 750"
                            value={formData.extraGuestFee}
                            onChange={(e) => handleFormChange("extraGuestFee", e.target.value)}
                          />
                        </div>

                        <div className="admin-saas-field">
                          <label htmlFor="field-st-cancel">Cancellation Policy</label>
                          <select
                            id="field-st-cancel"
                            className="admin-saas-select"
                            value={formData.cancellationPolicy}
                            onChange={(e) => handleFormChange("cancellationPolicy", e.target.value)}
                          >
                            <option value="Flexible (Full refund up to 48 hours before check-in)">Flexible (Full refund up to 48 hours prior)</option>
                            <option value="Moderate (Full refund up to 5 days before check-in)">Moderate (Full refund up to 5 days prior)</option>
                            <option value="Strict (50% refund up to 7 days before check-in)">Strict (50% refund up to 7 days prior)</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 5: LOCATION & LIVE INTERACTIVE MAP SELECTION */}
                {/* ------------------------------------------------------------- */}
                {/* ------------------------------------------------------------- */}
                {/* TAB: LOCATION (1. PROPERTY LOCATION -> 2. PROPERTY ADDRESS -> 3. EXACT GOOGLE MAP) */}
                {/* ------------------------------------------------------------- */}
                {activeEditorTab === "Location" && (
                  <div className="admin-saas-grid-3col">
                    {/* SECTION 1: PROPERTY LOCATION */}
                    <div className="col-span-3 admin-location-section-header">
                      <div className="admin-location-header-left">
                        <span className="admin-location-step-badge">1. Location</span>
                        <div>
                          <h4 className="admin-location-header-title">1. Property Location</h4>
                          <p className="admin-location-header-desc">
                            Select State, Gujarat City, Locality, and 6-digit Postal PIN Code
                          </p>
                        </div>
                      </div>
                      <span className="admin-hub-badge">Default State: Gujarat</span>
                    </div>

                    {/* State: Dropdown (Default Gujarat) */}
                    <div className="admin-saas-field">
                      <label htmlFor="field-loc-state">
                        <span>State <span className="required-dot">*</span></span>
                        <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "600" }}>Active Hub</span>
                      </label>
                      <select
                        id="field-loc-state"
                        className="admin-saas-select"
                        value={formData.state || "Gujarat"}
                        onChange={(e) => handleFormChange("state", e.target.value)}
                      >
                        <option value="Gujarat">Gujarat</option>
                      </select>
                      <span className="admin-saas-subtext">Currently all properties belong to Gujarat State</span>
                    </div>

                    {/* City: Dropdown (Gujarat Cities) */}
                    <div className="admin-saas-field">
                      <label htmlFor="field-loc-city">
                        <span>City (Gujarat) <span className="required-dot">*</span></span>
                        <span style={{ fontSize: "11px", color: "#ee705b", fontWeight: "600" }}>Select City</span>
                      </label>
                      <select
                        id="field-loc-city"
                        className="admin-saas-select"
                        style={{ border: "1.5px solid #ee705b", background: "#fffaf9" }}
                        value={formData.city}
                        onChange={(e) => handleCityChange(e.target.value)}
                      >
                        {GUJARAT_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <span className="admin-saas-subtext">Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, etc.</span>
                    </div>

                    {/* Area / Locality: Searchable dropdown/input */}
                    <div className="admin-saas-field">
                      <label htmlFor="field-loc-area">
                        <span>Area / Locality in {formData.city} <span className="required-dot">*</span></span>
                      </label>
                      <input
                        type="text"
                        id="field-loc-area"
                        list="area-suggestions-list"
                        className="admin-saas-input"
                        placeholder="e.g. Vesu, Adajan, Pal, Althan..."
                        value={formData.area}
                        onChange={(e) => handleAreaChange(e.target.value)}
                        onBlur={() => handleAreaGeocode(formData.area)}
                      />
                      <datalist id="area-suggestions-list">
                        {(GUJARAT_CITY_AREAS[formData.city] || [formData.city === "Surat" ? "Katargam" : "Bodakdev"]).map((loc) => {
                          const pin = getGujaratPincode(loc, formData.city);
                          return (
                            <option key={loc} value={loc} label={pin ? `${loc} (${pin})` : loc} />
                          );
                        })}
                        {formData.area && !(GUJARAT_CITY_AREAS[formData.city] || []).includes(formData.area) && (
                          <option value={formData.area} />
                        )}
                      </datalist>
                      <span className="admin-saas-subtext">Select from suggestions or type any custom area name</span>
                    </div>

                    {/* Pincode: 6-digit numeric input with validation */}
                    {(() => {
                      const expectedPincode = getGujaratPincode(formData.area, formData.city);
                      return (
                        <div className="admin-saas-field">
                          <label htmlFor="field-loc-pincode">
                            <span>Pincode (6-digit) <span className="required-dot">*</span></span>
                            {expectedPincode && formData.pincode === expectedPincode && (
                              <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "600" }}>✓ Matches {formData.area}</span>
                            )}
                          </label>
                          <input
                            id="field-loc-pincode"
                            type="text"
                            maxLength={6}
                            className="admin-saas-input"
                            placeholder="e.g. 395007 or 380054"
                            value={formData.pincode}
                            onChange={(e) => {
                              const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
                              handleFormChange("pincode", digitsOnly);
                            }}
                          />
                          <div className="admin-saas-subtext" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                            {formData.pincode?.length === 6 ? (
                              expectedPincode && formData.pincode !== expectedPincode ? (
                                <span style={{ color: "#d97706", fontSize: "11.5px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                  <span>⚠️ Standard Pincode for {formData.area} is <strong>{expectedPincode}</strong></span>
                                  <button
                                    type="button"
                                    onClick={() => handleFormChange("pincode", expectedPincode)}
                                    style={{
                                      background: "#fef3c7",
                                      border: "1px solid #fde68a",
                                      color: "#b45309",
                                      borderRadius: "4px",
                                      padding: "1px 6px",
                                      cursor: "pointer",
                                      fontSize: "11px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Apply {expectedPincode}
                                  </button>
                                </span>
                              ) : (
                                <span style={{ color: "#16a34a", fontWeight: "600" }}>✓ Valid Pincode for {formData.area || formData.city}</span>
                              )
                            ) : (
                              <span>
                                Must be exactly 6 digits
                                {expectedPincode && (
                                  <button
                                    type="button"
                                    onClick={() => handleFormChange("pincode", expectedPincode)}
                                    style={{
                                      marginLeft: "6px",
                                      color: "#2563eb",
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      fontSize: "11px",
                                      textDecoration: "underline",
                                      padding: 0,
                                    }}
                                  >
                                    Auto-fill {expectedPincode}
                                  </button>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* SECTION 2: PROPERTY ADDRESS */}
                    <div className="col-span-3 admin-location-section-header" style={{ marginTop: "12px" }}>
                      <div className="admin-location-header-left">
                        <span className="admin-location-step-badge" style={{ background: "#f59e0b" }}>2. Address</span>
                        <div>
                          <h4 className="admin-location-header-title">2. Property Street Address</h4>
                          <p className="admin-location-header-desc">
                            Street / Road address (e.g. VIP Road, Near Lake View Road). Road, society surroundings, landmark details.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="admin-address-fetch-btn"
                        onClick={handleFetchGoogleAddress}
                        disabled={isGeocoding}
                        title="Search and resolve exact street address on Google Maps"
                      >
                        {isGeocoding ? "Searching..." : "⚡ Auto-Fetch Address"}
                      </button>
                    </div>

                    {/* Street Address Input */}
                    <div className="admin-saas-field col-span-3">
                      <label htmlFor="field-loc-street">
                        <span>Street / Road Address <span className="required-dot">*</span></span>
                      </label>
                      <input
                        id="field-loc-street"
                        type="text"
                        className="admin-saas-input"
                        placeholder="e.g. VIP Road, Near Lake View Road"
                        value={formData.streetAddress || formData.address}
                        onChange={(e) => {
                          handleFormChange("streetAddress", e.target.value);
                          handleFormChange("address", e.target.value);
                        }}
                      />
                      <span className="admin-saas-subtext">
                        Road, highway, or society surroundings. Keep Plot/Flat/Wing separate in Property Unit Details.
                      </span>
                    </div>

                    {/* SECTION 3: EXACT MAP LOCATION */}
                    <div className="col-span-3 admin-location-section-header" style={{ marginTop: "12px" }}>
                      <div className="admin-location-header-left">
                        <span className="admin-location-step-badge" style={{ background: "#dc2626" }}>3. Exact Map</span>
                        <div>
                          <h4 className="admin-location-header-title">3. Google Map — Exact Property Location</h4>
                          <p className="admin-location-header-desc">
                            Search location, drag red pin 📍 to exact building or plot, and click [ Confirm Exact Location ]
                          </p>
                        </div>
                      </div>
                      {formData.isLocationConfirmed && (
                        <span className="admin-location-header-badge confirmed">
                          ✓ Exact Location Confirmed
                        </span>
                      )}
                    </div>

                    {/* Interactive Google Maps Hub */}
                    <div className="admin-map-preview-wrap col-span-3">
                      <InteractiveMapPicker
                        lat={formData.mapLat}
                        lng={formData.mapLng}
                        address={formData.streetAddress || formData.address}
                        cityName={formData.city}
                        areaName={formData.area}
                        onLocationSelect={handleMapLocationSelect}
                      />
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 6: FEATURES, AMENITIES & HOMEPAGE SHOWCASE */}
                {/* ------------------------------------------------------------- */}
                {activeEditorTab === "Features" && (
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 6px", color: "#111827" }}>
                      Luxury Amenities & Architectural Features
                    </h3>
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 18px" }}>
                      Select the verified amenities available for this property. Click to toggle.
                    </p>

                    <div className="admin-saas-chips-wrap">
                      {[
                        "Private Lawn",
                        "Swimming Pool",
                        "Covered Parking",
                        "24/7 Security & CCTV",
                        "High Speed Lift",
                        "100% Vastu Compliant",
                        "Gym & Clubhouse",
                        "100% Power Backup",
                        "Modular Kitchen",
                        "Servant Quarters",
                        "Terrace Garden",
                        "Central Air Conditioning",
                        "Piped Natural Gas (PNG)",
                        "EV Charging Station",
                        "Children Play Area",
                        "Rainwater Harvesting",
                      ].map((amenity) => {
                        const isSelected = formData.amenities?.includes(amenity);
                        return (
                          <div
                            key={amenity}
                            className={`admin-saas-chip ${isSelected ? "active" : ""}`}
                            onClick={() => handleToggleAmenity(amenity)}
                          >
                            {isSelected && <Check size={14} style={{ display: "inline", marginRight: 4, verticalAlign: "-2px" }} />}
                            {amenity}
                          </div>
                        );
                      })}
                    </div>

                    <div className="admin-saas-grid-3col" style={{ marginTop: "28px", borderTop: "1px solid #e5e7eb", paddingTop: "20px" }}>
                      <div className="admin-saas-field">
                        <label htmlFor="field-features-tag">Highlight / Badge Tag</label>
                        <input
                          id="field-features-tag"
                          type="text"
                          className="admin-saas-input"
                          placeholder="e.g. Trending, Luxury, Verified, Prime"
                          value={formData.tag}
                          onChange={(e) => handleFormChange("tag", e.target.value)}
                        />
                        <span className="admin-saas-subtext">Visual badge displayed on property cards</span>
                      </div>

                      <div className="admin-saas-field col-span-2">
                        <label>Homepage Showcase Carousel</label>
                        <label className="admin-checkbox-label" style={{ marginTop: "12px" }}>
                          <input
                            type="checkbox"
                            checked={formData.isTrending}
                            onChange={(e) => handleFormChange("isTrending", e.target.checked)}
                          />
                          <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1f2937" }}>
                            Feature this property in the Homepage &quot;Trending properties&quot; carousel
                          </span>
                        </label>
                        <span className="admin-saas-subtext" style={{ display: "block", marginTop: "4px" }}>
                          Enables premier placement in the curated top section on the public homepage
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 7: DEALER INFORMATION (ACCORDING TO USER REQUIREMENTS) */}
                {/* ------------------------------------------------------------- */}
                {activeEditorTab === "Dealer" && (
                  <div className="admin-dealer-section-wrapper">
                    <div className="admin-section-header-banner">
                      <div>
                        <h3 className="admin-section-title">DEALER INFORMATION</h3>
                        <p className="admin-section-subtitle">
                          Attach verified property dealer & real estate agency credentials for this listing.
                        </p>
                      </div>
                      <div className="admin-badge-verified-preview">
                        <span className="dealer-badge-check">✓</span>
                        <span>{formData.dealerStatus || "Verified"}</span>
                      </div>
                    </div>

                    {/* Top Row: Profile Photo Upload & Circular Avatar Live Preview */}
                    <div className="dealer-photo-upload-panel">
                      <div className="dealer-avatar-display-group">
                        <div className="dealer-avatar-circle-wrap">
                          {formData.dealerPhoto ? (
                            <img
                              src={formData.dealerPhoto}
                              alt={formData.dealerName || "Dealer"}
                              className="dealer-avatar-circle-img"
                            />
                          ) : (
                            <div className="dealer-avatar-circle-placeholder" style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                              <Users size={28} />
                            </div>
                          )}
                          {formData.dealerStatus === "Verified" && formData.dealerName && (
                            <span className="dealer-avatar-verified-tick" title="Verified Gujarat Dealer">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="dealer-avatar-details">
                          <h4 className="dealer-avatar-name">{formData.dealerName || "Dealer Name (Not Specified)"}</h4>
                          <p className="dealer-avatar-agency">{formData.dealerAgency || "Agency Not Specified"}</p>
                          <span className="dealer-avatar-phone">{formData.dealerPhone || "No Phone Added"}</span>
                        </div>
                      </div>

                      <div className="dealer-upload-controls">
                        <label className="admin-btn-secondary dealer-upload-btn">
                          <span>📷 Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  handleFormChange("dealerPhoto", ev.target.result);
                                  showToast("Dealer profile photo updated!");
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }
                            }}
                          />
                        </label>

                        <div className="dealer-preset-avatars-row">
                          <span className="dealer-preset-hint">Or pick verified avatar:</span>
                          <div className="dealer-preset-thumbs">
                            {DEALER_PRESET_AVATARS.map((avatar, idx) => (
                              <img
                                key={idx}
                                src={avatar.url}
                                alt={avatar.name}
                                title={avatar.name}
                                className={`dealer-preset-thumb ${formData.dealerPhoto === avatar.url ? "active" : ""}`}
                                onClick={() => {
                                  handleFormChange("dealerPhoto", avatar.url);
                                  if (!formData.dealerName) handleFormChange("dealerName", avatar.name);
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields Grid matching User Specification */}
                    <div className="admin-saas-grid-3col" style={{ marginTop: "10px" }}>
                      {/* Full Name */}
                      <div className="admin-saas-field">
                        <label htmlFor="field-dealer-name">
                          Full Name
                        </label>
                        <input
                          id="field-dealer-name"
                          type="text"
                          className="admin-saas-input"
                          placeholder="e.g. Rahul Patel"
                          value={formData.dealerName}
                          onChange={(e) => handleFormChange("dealerName", e.target.value)}
                        />
                        <span className="admin-saas-subtext">Principal real estate broker / agent name</span>
                      </div>

                      {/* Agency / Company Name */}
                      <div className="admin-saas-field">
                        <label htmlFor="field-dealer-agency">
                          Agency / Company Name
                        </label>
                        <input
                          id="field-dealer-agency"
                          type="text"
                          className="admin-saas-input"
                          placeholder="e.g. Patel Realty"
                          value={formData.dealerAgency}
                          onChange={(e) => handleFormChange("dealerAgency", e.target.value)}
                        />
                        <span className="admin-saas-subtext">Registered real estate firm or brokerage</span>
                      </div>

                      {/* Mobile Number */}
                      <div className="admin-saas-field">
                        <label htmlFor="field-dealer-phone">
                          Mobile Number
                        </label>
                        <input
                          id="field-dealer-phone"
                          type="text"
                          className="admin-saas-input"
                          placeholder="e.g. 98765 43210"
                          value={formData.dealerPhone}
                          onChange={(e) => handleFormChange("dealerPhone", e.target.value)}
                        />
                        <span className="admin-saas-subtext">Inquiries & WhatsApp calls route here</span>
                      </div>

                      {/* Email */}
                      <div className="admin-saas-field">
                        <label htmlFor="field-dealer-email">
                          Email
                        </label>
                        <input
                          id="field-dealer-email"
                          type="email"
                          className="admin-saas-input"
                          placeholder="e.g. rahul@patelrealty.com"
                          value={formData.dealerEmail}
                          onChange={(e) => handleFormChange("dealerEmail", e.target.value)}
                        />
                        <span className="admin-saas-subtext">Lead alerts and official communication</span>
                      </div>

                      {/* Office Address */}
                      <div className="admin-saas-field">
                        <label htmlFor="field-dealer-address">Office Address</label>
                        <input
                          id="field-dealer-address"
                          type="text"
                          className="admin-saas-input"
                          placeholder="e.g. Vesu, Surat, Gujarat"
                          value={formData.dealerAddress}
                          onChange={(e) => handleFormChange("dealerAddress", e.target.value)}
                        />
                        <span className="admin-saas-subtext">Physical office / branch location</span>
                      </div>

                      {/* City */}
                      <div className="admin-saas-field">
                        <label htmlFor="field-dealer-city">City</label>
                        <input
                          id="field-dealer-city"
                          type="text"
                          className="admin-saas-input"
                          placeholder="e.g. Surat"
                          value={formData.dealerCity}
                          onChange={(e) => handleFormChange("dealerCity", e.target.value)}
                        />
                        <span className="admin-saas-subtext">Primary operating city</span>
                      </div>

                      {/* Dealer Type */}
                      <div className="admin-saas-field">
                        <label htmlFor="field-dealer-type">Dealer Type</label>
                        <select
                          id="field-dealer-type"
                          className="admin-saas-select"
                          value={formData.dealerType}
                          onChange={(e) => handleFormChange("dealerType", e.target.value)}
                        >
                          <option value="">Select Dealer Type</option>
                          <option value="Individual Dealer">Individual Dealer</option>
                          <option value="Real Estate Agency">Real Estate Agency</option>
                          <option value="Builder / Developer Representative">Builder / Developer Representative</option>
                          <option value="Certified Gujarat Broker">Certified Gujarat Broker</option>
                          <option value="Exclusive Luxury Partner">Exclusive Luxury Partner</option>
                        </select>
                        <span className="admin-saas-subtext">Consultancy classification</span>
                      </div>

                      {/* RERA / Registration Number */}
                      <div className="admin-saas-field">
                        <label htmlFor="field-dealer-rera">RERA / Registration Number</label>
                        <input
                          id="field-dealer-rera"
                          type="text"
                          className="admin-saas-input"
                          placeholder="PR/GJ/SURAT/DEALER/2024/098 (Optional)"
                          value={formData.dealerRera}
                          onChange={(e) => handleFormChange("dealerRera", e.target.value)}
                        />
                        <span className="admin-saas-subtext">Optional GujRERA registration code</span>
                      </div>

                      {/* Verification Status */}
                      <div className="admin-saas-field">
                        <label htmlFor="field-dealer-status">Verification Status</label>
                        <select
                          id="field-dealer-status"
                          className="admin-saas-select"
                          value={formData.dealerStatus}
                          onChange={(e) => handleFormChange("dealerStatus", e.target.value)}
                        >
                          <option value="Verified">Verified</option>
                          <option value="Pending Review">Pending Review</option>
                          <option value="Top Rated Gujarat Dealer">Top Rated Gujarat Dealer</option>
                          <option value="Gold Partner">Gold Partner</option>
                        </select>
                        <span className="admin-saas-subtext">Authority badge displayed on profile</span>
                      </div>

                      {/* Bio / About Dealer */}
                      <div className="admin-saas-field col-span-3">
                        <label htmlFor="field-dealer-bio">Bio / About Dealer</label>
                        <textarea
                          id="field-dealer-bio"
                          className="admin-saas-textarea"
                          rows={3}
                          placeholder="Experienced property dealer in Surat specializing in luxury residences, villas, and prime plots across Gujarat..."
                          value={formData.dealerBio}
                          onChange={(e) => handleFormChange("dealerBio", e.target.value)}
                        />
                        <span className="admin-saas-subtext">Public biography shown on property detail page</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PROMINENT STICKY FOOTER ACTION BAR */}
              <div className="admin-editor-sticky-footer">
                <div className="admin-editor-footer-left">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                  <span>MySQL Database Active · {modalMode === "create" ? "New Listing" : `Editing ID #${editingId}`}</span>
                </div>
                <div className="admin-editor-footer-actions">
                  <button
                    type="submit"
                    className="admin-editor-submit-btn"
                    disabled={submitting}
                    id="property-editor-bottom-submit-btn"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : modalMode === "create" ? (
                      <>
                        <Plus size={16} strokeWidth={2.5} />
                        <span>Add Property</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} strokeWidth={2.5} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: LOG WALK-IN LEAD */}
      {/* ===================================================================== */}
      {isAddLeadModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddLeadModalOpen(false)}>
          <div className="admin-modal-box" style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>
                <Users size={18} style={{ color: "#ee705b" }} />
                <span>Log Walk-in Buyer Lead</span>
              </h2>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setIsAddLeadModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddManualLead}>
              <div className="admin-modal-body">
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#44403c", display: "block", marginBottom: "4px" }}>
                      Buyer Full Name *
                    </label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Nilesh Shah"
                      value={newLeadData.clientName}
                      onChange={(e) => setNewLeadData({ ...newLeadData, clientName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#44403c", display: "block", marginBottom: "4px" }}>
                      Phone / Mobile Number *
                    </label>
                    <input
                      type="tel"
                      className="admin-form-input"
                      placeholder="+91 98250 00000"
                      value={newLeadData.phone}
                      onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#44403c", display: "block", marginBottom: "4px" }}>
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      className="admin-form-input"
                      placeholder="client@gmail.com"
                      value={newLeadData.email}
                      onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#44403c", display: "block", marginBottom: "4px" }}>
                      Property of Interest
                    </label>
                    <select
                      className="admin-form-select"
                      value={newLeadData.property}
                      onChange={(e) => setNewLeadData({ ...newLeadData, property: e.target.value })}
                    >
                      <option value="">General Portfolio Inquiry</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.city} · {p.priceLabel})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#44403c", display: "block", marginBottom: "4px" }}>
                      Budget Estimate
                    </label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. ₹2.2 Cr - ₹2.8 Cr"
                      value={newLeadData.budget}
                      onChange={(e) => setNewLeadData({ ...newLeadData, budget: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#44403c", display: "block", marginBottom: "4px" }}>
                      Discussion Notes
                    </label>
                    <textarea
                      className="admin-form-textarea"
                      placeholder="Client looking for vastu-compliant villa with garden..."
                      value={newLeadData.message}
                      onChange={(e) => setNewLeadData({ ...newLeadData, message: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setIsAddLeadModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save Lead to CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SIGN OUT CONFIRMATION MODAL */}
      {/* ============================================================= */}
      {showSignOutConfirm && (
        <div className="admin-modal-overlay" onClick={() => setShowSignOutConfirm(false)}>
          <div
            className="admin-confirm-modal-box"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="admin-confirm-modal-icon">
              <LogOut size={26} color="#ee705b" />
            </div>
            <h3 className="admin-confirm-modal-title">Sign Out of Admin Console?</h3>
            <p className="admin-confirm-modal-desc">
              Are you sure you want to sign out? You will need to log in again to manage properties, inquiries, and dealer settings.
            </p>
            <div className="admin-confirm-modal-actions">
              <button
                type="button"
                className="admin-btn-action-outline"
                onClick={() => setShowSignOutConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn-danger-confirm"
                onClick={() => {
                  setShowSignOutConfirm(false);
                  handleLogout();
                }}
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* RIGHT-SIDE PROPERTY DETAILS DRAWER (VIEW 👁) */}
      {/* ============================================================= */}
      {selectedViewProperty && (
        <PropertyDetailsDrawer
          property={selectedViewProperty}
          onClose={() => setSelectedViewProperty(null)}
          onEdit={(propToEdit) => {
            setSelectedViewProperty(null);
            handleOpenEdit(propToEdit);
          }}
        />
      )}
    </div>
  );
}
