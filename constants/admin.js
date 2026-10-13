/**
 * Admin Dashboard & CRM Constants
 */

// Preset luxury photos for quick property creation
export const PRESET_PHOTOS = [
  { label: "Modern Luxury Villa", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85" },
  { label: "High-Rise Penthouse", url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85" },
  { label: "Serene Garden Bungalow", url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85" },
  { label: "Contemporary Apartment", url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=85" },
  { label: "Grand Estate Villa", url: "https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=1000&q=85" },
  { label: "Coastal Vacation Villa", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=85" },
];

// Preset broker avatars for dealer information section
export const DEALER_PRESET_AVATARS = [
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

export const GUJARAT_CITY_AREAS = {
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

export const GUJARAT_CITIES = Object.keys(GUJARAT_CITY_AREAS);

export const CITY_COORDINATES = {
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

export const PROPERTY_TYPES = [
  "Villa", "Apartment", "Bungalow", "Penthouse", "Duplex", "Row House", "Plot", "Commercial",
];

// Initial mock buyer inquiries for the dealer CRM
export const INITIAL_LEADS = [
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
export function formatIndianCurrency(num) {
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
