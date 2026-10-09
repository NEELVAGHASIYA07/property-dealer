// Gujarat Real Estate Verified Dealers Directory

export const VERIFIED_DEALERS = [
  {
    id: "dealer-rahul",
    name: "Rahul Patel",
    company: "Surat Elite Realty & Properties",
    phone: "+91 98251 44221",
    whatsapp: "919825144221",
    email: "rahul.patel@suratelite.com",
    city: "Surat",
    specialities: ["Luxury Apartments", "Villas in Vesu & Dumas", "Commercial"],
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    verified: true,
    rating: 4.9,
    reviewsCount: 52,
    totalProperties: 125,
    experienceYears: 12,
    role: "Senior Real Estate Consultant",
  },
  {
    id: "dealer-hardik",
    name: "Hardik Shah",
    company: "Amdavad Premier Estates",
    phone: "+91 98790 33145",
    whatsapp: "919879033145",
    email: "hardik@amdavadestates.in",
    city: "Ahmedabad",
    specialities: ["Bodakdev Villas", "Sindhu Bhavan Penthouses", "SG Highway"],
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    verified: true,
    rating: 4.8,
    reviewsCount: 64,
    totalProperties: 180,
    experienceYears: 15,
    role: "Principal Broker & Valuer",
  },
  {
    id: "dealer-priya",
    name: "Priya Desai",
    company: "Baroda Heritage Realty",
    phone: "+91 94260 88219",
    whatsapp: "919426088219",
    email: "priya@barodaheritage.com",
    city: "Vadodara",
    specialities: ["Alkapuri Bungalows", "Vasna-Bhayli Flats", "Heritage Homes"],
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    verified: true,
    rating: 4.9,
    reviewsCount: 41,
    totalProperties: 94,
    experienceYears: 9,
    role: "Founding Partner",
  },
  {
    id: "dealer-sanjay",
    name: "Sanjay Vaghani",
    company: "Diamond City Realtors",
    phone: "+91 98241 55670",
    whatsapp: "919824155670",
    email: "sanjay@diamondcityrealtors.com",
    city: "Surat",
    specialities: ["Katargam", "Varachha", "Mota Varachha Plots"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    verified: true,
    rating: 4.7,
    reviewsCount: 38,
    totalProperties: 110,
    experienceYears: 14,
    role: "Managing Director",
  },
  {
    id: "dealer-neha",
    name: "Neha Mehta",
    company: "Capital Region Advisors",
    phone: "+91 98255 12099",
    whatsapp: "919825512099",
    email: "neha@capitalregionadvisors.in",
    city: "Gandhinagar",
    specialities: ["GIFT City SEZ", "Kudasan High-Rises", "Government Enclaves"],
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    verified: true,
    rating: 4.9,
    reviewsCount: 47,
    totalProperties: 88,
    experienceYears: 10,
    role: "Senior Consultant",
  },
  {
    id: "dealer-amit",
    name: "Amit Trivedi",
    company: "Saurashtra Prime Properties",
    phone: "+91 98252 66780",
    whatsapp: "919825266780",
    email: "amit@saurashtraprime.com",
    city: "Rajkot",
    specialities: ["Kalawad Road", "University Road", "Industrial & Commercial"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    verified: true,
    rating: 4.8,
    reviewsCount: 29,
    totalProperties: 76,
    experienceYears: 11,
    role: "Broker & Property Manager",
  },
];

export function getDealerById(dealerId) {
  if (!dealerId) return VERIFIED_DEALERS[0];
  const found = VERIFIED_DEALERS.find((d) => d.id === dealerId);
  return found || VERIFIED_DEALERS[0];
}

export function getDealerForProperty(property) {
  if (property?.dealerId) {
    const d = VERIFIED_DEALERS.find((item) => item.id === property.dealerId);
    if (d) return d;
  }
  if (property?.dealer && typeof property.dealer === "object") {
    return property.dealer;
  }
  // Fallback by city
  const city = (property?.city || "").toLowerCase();
  const area = (property?.area || property?.location || "").toLowerCase();

  if (city.includes("surat")) {
    if (area.includes("katargam") || area.includes("varachha")) {
      return VERIFIED_DEALERS.find((d) => d.id === "dealer-sanjay") || VERIFIED_DEALERS[0];
    }
    return VERIFIED_DEALERS.find((d) => d.id === "dealer-rahul") || VERIFIED_DEALERS[0];
  }
  if (city.includes("ahmedabad")) {
    return VERIFIED_DEALERS.find((d) => d.id === "dealer-hardik") || VERIFIED_DEALERS[0];
  }
  if (city.includes("vadodara")) {
    return VERIFIED_DEALERS.find((d) => d.id === "dealer-priya") || VERIFIED_DEALERS[0];
  }
  if (city.includes("gandhinagar")) {
    return VERIFIED_DEALERS.find((d) => d.id === "dealer-neha") || VERIFIED_DEALERS[0];
  }
  if (city.includes("rajkot")) {
    return VERIFIED_DEALERS.find((d) => d.id === "dealer-amit") || VERIFIED_DEALERS[0];
  }

  return VERIFIED_DEALERS[0];
}

export function getAllDealers() {
  return VERIFIED_DEALERS;
}
