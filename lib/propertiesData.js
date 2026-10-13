import { getProperties, getPropertyById } from "@/app/lib/api";
import { GUJARAT_AREAS_GEO, GUJARAT_CITY_COORDS, getGujaratPincode } from "@/app/lib/geocoding";
import { getDealerForProperty } from "@/app/lib/dealers";

// Comprehensive dataset of Gujarat properties - Trending homes placed FIRST
export const FALLBACK_PROPERTIES = [
  // ==========================================
  // 1. TRENDING HOMES (Shown First)
  // ==========================================
  {
    id: "trend-1",
    name: "The Juniper Villa",
    mode: "buy",
    price: 24800000,
    priceLabel: "₹2.48 Cr",
    type: "Villa",
    tag: "Trending",
    city: "Ahmedabad",
    area: "Bodakdev",
    location: "Bodakdev, Ahmedabad",
    streetAddress: "Near Sindhu Bhavan Cross Road, Bodakdev",
    lat: 23.0450,
    lng: 72.5120,
    bedrooms: 4,
    bathrooms: 4,
    size: 3200,
    dealerId: "dealer-hardik",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "An architectural tour-de-force in Bodakdev. Features open courtyard, double height atrium, private heated plunge pool, and bespoke teakwood fixtures.",
    amenities: ["Private Pool", "Home Automation", "Private Terrace", "Covered Car Porch", "Solar Heating"],
    unitDetails: {
      wing: "Villa Enclave",
      floor: "G + 2 Floors",
      flatNo: "Villa No. 4",
      surveyNo: "Survey 112/A, Bodakdev",
      status: "Ready to Move",
      furnishing: "Fully Furnished",
      age: "Brand New Construction",
    },
  },
  {
    id: "trend-2",
    name: "Arcadia Sky Residence",
    mode: "buy",
    price: 17500000,
    priceLabel: "₹1.75 Cr",
    type: "Apartment",
    tag: "Popular",
    city: "Surat",
    area: "Vesu",
    location: "Vesu, Surat",
    streetAddress: "VIP Road, Near Vesu Canal Walkway",
    lat: 21.1520,
    lng: 72.7750,
    bedrooms: 3,
    bathrooms: 3,
    size: 2150,
    dealerId: "dealer-rahul",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Expansive 3 BHK high-rise flat on VIP Road, Vesu. Premium Italian marble throughout, expansive deck balcony with city views, and clubhouse access.",
    amenities: ["Infinity Pool", "Air Conditioned Gym", "EV Charging Point", "Double Basement Parking", "Clubhouse"],
    unitDetails: {
      wing: "Tower A",
      floor: "12th Floor",
      flatNo: "A-1202",
      surveyNo: "Survey 77, TP 28",
      status: "Ready to Move",
      furnishing: "Semi-Furnished",
      age: "1 Year",
    },
  },
  {
    id: "trend-3",
    name: "Canyon Palm Estate",
    mode: "buy",
    price: 18600000,
    priceLabel: "₹1.86 Cr",
    type: "Bungalow",
    tag: "Featured",
    city: "Vadodara",
    area: "Alkapuri",
    location: "Alkapuri, Vadodara",
    streetAddress: "RC Dutt Road, Alkapuri",
    lat: 22.3040,
    lng: 73.1810,
    bedrooms: 4,
    bathrooms: 3,
    size: 2600,
    dealerId: "dealer-priya",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Charming European-styled bungalow set inside lush Alkapuri greenery. Large private garden, servant quarters, and ample natural lighting.",
    amenities: ["Private Lawn", "Gated Security", "2 Car Garage", "Borewell Water"],
    unitDetails: {
      wing: "Independent Plot",
      floor: "Ground + 1",
      flatNo: "Bungalow 9",
      surveyNo: "CS 45, Alkapuri",
      status: "Ready to Move",
      furnishing: "Fully Furnished",
      age: "3 Years",
    },
  },
  {
    id: "trend-4",
    name: "The Capital Heights",
    mode: "buy",
    price: 31000000,
    priceLabel: "₹3.10 Cr",
    type: "Penthouse",
    tag: "Trending",
    city: "Gandhinagar",
    area: "Kudasan",
    location: "Kudasan, Gandhinagar",
    streetAddress: "Bhaijipura Cross Road, Kudasan",
    lat: 23.1890,
    lng: 72.6320,
    bedrooms: 5,
    bathrooms: 5,
    size: 4100,
    dealerId: "dealer-neha",
    image: "https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Spectacular penthouse in Kudasan near GIFT City. 360-degree panoramic skyline views, private terrace garden with Jacuzzi, and high-speed private elevator access.",
    amenities: ["Private Jacuzzi", "Sky Terrace", "Private Lift", "Smart Security", "Concierge"],
    unitDetails: {
      wing: "Apex Tower",
      floor: "18th & 19th Floor",
      flatNo: "PH-1801",
      surveyNo: "Survey 23, Kudasan",
      status: "Ready to Move",
      furnishing: "Fully Furnished",
      age: "Brand New Construction",
    },
  },
  {
    id: "trend-5",
    name: "Sapphire Haven",
    mode: "buy",
    price: 8500000,
    priceLabel: "₹85 Lakh",
    type: "Apartment",
    tag: "Hot Deal",
    city: "Rajkot",
    area: "Kalawad Road",
    location: "Kalawad Road, Rajkot",
    streetAddress: "Near KKV Hall, Kalawad Road",
    lat: 22.2850,
    lng: 70.7720,
    bedrooms: 3,
    bathrooms: 2,
    size: 1550,
    dealerId: "dealer-amit",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Centrally positioned 3 BHK apartment on Kalawad Road. Close to Saurashtra University, premier schools, multi-specialty hospitals, and dining spots.",
    amenities: ["Alloted Car Parking", "Children Play Park", "Gas Pipeline", "24/7 Security"],
    unitDetails: {
      wing: "Wing B",
      floor: "7th Floor",
      flatNo: "B-703",
      surveyNo: "Survey 14, Rajkot",
      status: "Ready to Move",
      furnishing: "Semi-Furnished",
      age: "2 Years",
    },
  },
  {
    id: "trend-6",
    name: "Marble Crest Manor",
    mode: "buy",
    price: 15200000,
    priceLabel: "₹1.52 Cr",
    type: "Bungalow",
    tag: "Featured",
    city: "Bhavnagar",
    area: "Victoria Park",
    location: "Victoria Park, Bhavnagar",
    streetAddress: "Near Victoria Park Gate, Bhavnagar",
    lat: 21.7500,
    lng: 72.1350,
    bedrooms: 4,
    bathrooms: 3,
    size: 2400,
    dealerId: "dealer-amit",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Serene 4 BHK bungalow surrounded by mature trees near Victoria Park. Features classical architecture, spacious front veranda, and private driveway.",
    amenities: ["Veranda", "Private Driveway", "Garden", "CCTV"],
    unitDetails: {
      wing: "Independent Plot",
      floor: "Ground + 1",
      flatNo: "Plot 32",
      surveyNo: "Survey 81",
      status: "Ready to Move",
      furnishing: "Semi-Furnished",
      age: "4 Years",
    },
  },
  {
    id: "trend-7",
    name: "Riverside Courtyard",
    mode: "buy",
    price: 42000000,
    priceLabel: "₹4.20 Cr",
    type: "Villa",
    tag: "Luxury",
    city: "Ahmedabad",
    area: "Ambli",
    location: "Ambli, Ahmedabad",
    streetAddress: "Ambli-Bopal Road, Ahmedabad",
    lat: 23.0380,
    lng: 72.4720,
    bedrooms: 5,
    bathrooms: 6,
    size: 5200,
    dealerId: "dealer-hardik",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Palatial 5 BHK contemporary villa in Ambli featuring sprawling indoor courtyard, Italian kitchen, home theatre, and private swimming pool.",
    amenities: ["Private Pool", "Home Cinema", "Gym", "Landscaped Garden", "4 Car Garage"],
    unitDetails: {
      wing: "Estate Villa",
      floor: "G + 2 Floors",
      flatNo: "Villa A-1",
      surveyNo: "Survey 188/2, Ambli",
      status: "Ready to Move",
      furnishing: "Fully Furnished",
      age: "Brand New Construction",
    },
  },
  {
    id: "trend-8",
    name: "Green Meadows Residence",
    mode: "buy",
    price: 9500000,
    priceLabel: "₹95 Lakh",
    type: "Row House",
    tag: "Trending",
    city: "Anand",
    area: "Vidyanagar Road",
    location: "Vidyanagar Road, Anand",
    streetAddress: "Near Elecon, Vallabh Vidyanagar Road, Anand",
    lat: 22.5520,
    lng: 72.9340,
    bedrooms: 3,
    bathrooms: 3,
    size: 1850,
    dealerId: "dealer-hardik",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Peaceful 3 BHK row house in the educational heart of Anand / Vallabh Vidyanagar. Excellent air quality, terrace garden, and friendly neighborhood.",
    amenities: ["Terrace Garden", "Covered Parking", "Solar Water", "Borewell Water"],
    unitDetails: {
      wing: "Row House 7",
      floor: "G + 1",
      flatNo: "House 7",
      surveyNo: "FP 12, Vidyanagar",
      status: "Ready to Move",
      furnishing: "Semi-Furnished",
      age: "2 Years",
    },
  },

  // ==========================================
  // 2. ADDITIONAL BUY PROPERTIES (Surat, Ahmedabad, etc.)
  // ==========================================
  {
    id: "buy-1",
    name: "Avadh Bella Vista Luxury Villa",
    mode: "buy",
    price: 24500000,
    priceLabel: "₹2.45 Cr",
    type: "Villa",
    tag: "Verified",
    city: "Surat",
    area: "Vesu",
    location: "Vesu, Surat",
    streetAddress: "VIP Road, Opp. Reliance Mall, Vesu",
    lat: 21.1390,
    lng: 72.7870,
    bedrooms: 4,
    bathrooms: 4,
    size: 3450,
    dealerId: "dealer-rahul",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Ultra-luxury 4 BHK individual villa situated in the heart of Vesu, Surat. Features double-height living room, Italian marble flooring, private plunge pool, and smart home automation.",
    amenities: ["Private Pool", "Clubhouse", "2 Car Covered Parking", "24/7 Security", "Solar Power", "Landscaped Lawn"],
    unitDetails: {
      wing: "Villa Row A",
      floor: "G + 2 Storey",
      flatNo: "Villa No. 12",
      surveyNo: "Survey 84/1, FP 12",
      status: "Ready to Move",
      furnishing: "Fully Furnished",
      age: "Brand New Construction",
    },
  },
  {
    id: "buy-2",
    name: "Rajhans Synfonia High-Rise Flat",
    mode: "buy",
    price: 6800000,
    priceLabel: "₹68 Lakh",
    type: "Apartment",
    tag: "Hot Deal",
    city: "Surat",
    area: "Adajan",
    location: "Adajan, Surat",
    streetAddress: "Near Anand Mahal Road, Adajan",
    lat: 21.1960,
    lng: 72.7930,
    bedrooms: 3,
    bathrooms: 3,
    size: 1850,
    dealerId: "dealer-rahul",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Vastu-compliant 3 BHK premium apartment in Adajan with uninterrupted city views. Close to reputable English-medium schools, shopping arcades, and metro connectivity.",
    amenities: ["Gymnasium", "Children Play Area", "High Speed Elevators", "Intercom", "Power Backup"],
    unitDetails: {
      wing: "B Tower",
      floor: "8th Floor",
      flatNo: "B-804",
      surveyNo: "Survey 112/3",
      status: "Ready to Move",
      furnishing: "Semi-Furnished",
      age: "2 Years",
    },
  },
  {
    id: "buy-3",
    name: "Shivalik Shilp Executive Suite",
    mode: "buy",
    price: 18500000,
    priceLabel: "₹1.85 Cr",
    type: "Apartment",
    tag: "Trending",
    city: "Ahmedabad",
    area: "Bodakdev",
    location: "Bodakdev, Ahmedabad",
    streetAddress: "Near Iscon Cross Road, Bodakdev",
    lat: 23.0295,
    lng: 72.5040,
    bedrooms: 3,
    bathrooms: 3,
    size: 2400,
    dealerId: "dealer-hardik",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Spacious 3 BHK residence located in the prime Bodakdev corridor. Premium fittings, designer false ceiling, expansive balconies, and dedicated electric vehicle charging bays.",
    amenities: ["EV Charging", "Infinity Pool", "Yoga Deck", "Banquet Hall", "Concierge Desk"],
    unitDetails: {
      wing: "Tower 2",
      floor: "11th Floor",
      flatNo: "2-1102",
      surveyNo: "FP 45/B",
      status: "Ready to Move",
      furnishing: "Semi-Furnished",
      age: "1 Year",
    },
  },
  {
    id: "buy-4",
    name: "The Grand Diamond Palace",
    mode: "buy",
    price: 5200000,
    priceLabel: "₹52 Lakh",
    type: "Apartment",
    tag: "Verified",
    city: "Surat",
    area: "Katargam",
    location: "Katargam, Surat",
    streetAddress: "Katargam Main Road, Near Gajera Circle",
    lat: 21.2266,
    lng: 72.8242,
    bedrooms: 2,
    bathrooms: 2,
    size: 1350,
    dealerId: "dealer-sanjay",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Modern 2 BHK flat situated in heart of Katargam diamond trading hub. Excellent ventilation, water softening plant, earthquake-resistant RCC structure.",
    amenities: ["Covered Parking", "CCTV Surveillance", "Borewell Water", "Garden"],
    unitDetails: {
      wing: "Wing C",
      floor: "4th Floor",
      flatNo: "C-401",
      surveyNo: "Survey 231, TP 3",
      status: "Ready to Move",
      furnishing: "Unfurnished",
      age: "Brand New Construction",
    },
  },
  {
    id: "buy-5",
    name: "Alkapuri Heritage Residency",
    mode: "buy",
    price: 16500000,
    priceLabel: "₹1.65 Cr",
    type: "Bungalow",
    tag: "Featured",
    city: "Vadodara",
    area: "Alkapuri",
    location: "Alkapuri, Vadodara",
    streetAddress: "RC Dutt Road, Alkapuri",
    lat: 22.3160,
    lng: 73.1660,
    bedrooms: 4,
    bathrooms: 4,
    size: 2900,
    dealerId: "dealer-priya",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Exclusive 4 BHK bungalow in upscale Alkapuri with private lawn, teak wood woodwork, and quiet residential neighborhood.",
    amenities: ["Private Garden", "Servant Quarters", "2 Covered Garages", "Security Booth"],
    unitDetails: {
      wing: "Independent Plot",
      floor: "G + 1",
      flatNo: "Plot 18",
      surveyNo: "CS 92",
      status: "Ready to Move",
      furnishing: "Semi-Furnished",
      age: "5 Years",
    },
  },
  {
    id: "buy-6",
    name: "GIFT City Skyline Penthouse",
    mode: "buy",
    price: 32000000,
    priceLabel: "₹3.20 Cr",
    type: "Penthouse",
    tag: "Trending",
    city: "Gandhinagar",
    area: "GIFT City",
    location: "GIFT City, Gandhinagar",
    streetAddress: "GIFT City Boulevard, Gandhinagar",
    lat: 23.1610,
    lng: 72.6840,
    bedrooms: 5,
    bathrooms: 5,
    size: 4200,
    dealerId: "dealer-neha",
    image: "https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Spectacular 5 BHK duplex penthouse overlooking the Sabarmati riverfront and GIFT City financial towers. Includes private sky deck and high-end German kitchen.",
    amenities: ["Sky Lounge", "Helipad Access", "Business Center", "Temperature Controlled Pool"],
    unitDetails: {
      wing: "Tower A (Skyline)",
      floor: "22nd & 23rd Floor",
      flatNo: "PH-2201",
      surveyNo: "GIFT SEZ Plot 21",
      status: "Ready to Move",
      furnishing: "Fully Furnished",
      age: "Under 1 Year",
    },
  },

  // ==========================================
  // 3. RENT PROPERTIES
  // ==========================================
  {
    id: "rent-1",
    name: "Canal Walk Furnished Flat",
    mode: "rent",
    price: 32000,
    priceLabel: "₹32,000 / mo",
    type: "Apartment",
    tag: "Verified",
    city: "Surat",
    area: "Vesu",
    location: "Vesu, Surat",
    streetAddress: "Canal Corridor Road, Near GD Goenka School, Vesu",
    lat: 21.1580,
    lng: 72.7830,
    bedrooms: 3,
    bathrooms: 3,
    size: 1750,
    dealerId: "dealer-rahul",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Fully furnished 3 BHK apartment with modular kitchen, air conditioners, sofa sets, and piped PNG gas connection. Ready for immediate family occupancy.",
    amenities: ["Fully Furnished", "Air Conditioned", "Gym", "Covered Parking", "PNG Gas"],
    unitDetails: {
      wing: "Wing D",
      floor: "6th Floor",
      flatNo: "D-602",
      surveyNo: "Survey 76, Vesu",
      status: "Ready for Lease",
      furnishing: "Fully Furnished",
      age: "2 Years",
    },
  },
  {
    id: "rent-2",
    name: "Riverfront View 2 BHK Apartment",
    mode: "rent",
    price: 24000,
    priceLabel: "₹24,000 / mo",
    type: "Apartment",
    tag: "Hot Deal",
    city: "Surat",
    area: "Adajan",
    location: "Adajan, Surat",
    streetAddress: "Near Cable Stayed Bridge, Adajan",
    lat: 21.1990,
    lng: 72.7980,
    bedrooms: 2,
    bathrooms: 2,
    size: 1250,
    dealerId: "dealer-rahul",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Breathtaking Tapi river breeze and scenic night view of Surat Cable Bridge. Includes modular kitchen, geysers, and reserved car parking.",
    amenities: ["Riverfront View", "24hr Water", "Security Guard", "Lift Backup"],
    unitDetails: {
      wing: "Wing A",
      floor: "9th Floor",
      flatNo: "A-901",
      surveyNo: "Survey 145/1",
      status: "Ready for Lease",
      furnishing: "Semi-Furnished",
      age: "3 Years",
    },
  },
  {
    id: "rent-3",
    name: "Sindhu Bhavan Corporate Flat",
    mode: "rent",
    price: 55000,
    priceLabel: "₹55,000 / mo",
    type: "Apartment",
    tag: "Trending",
    city: "Ahmedabad",
    area: "Sindhu Bhavan Road",
    location: "Sindhu Bhavan Road, Ahmedabad",
    streetAddress: "Off Sindhu Bhavan Road, Bodakdev",
    lat: 23.0490,
    lng: 72.4950,
    bedrooms: 3,
    bathrooms: 3,
    size: 2200,
    dealerId: "dealer-hardik",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "High-spec 3 BHK furnished flat ideal for corporate executives and expats. Walking distance from fine-dining restaurants and Taj Skyline.",
    amenities: ["Clubhouse", "Swimming Pool", "High Speed Wifi", "Valet Parking"],
    unitDetails: {
      wing: "Tower 1",
      floor: "12th Floor",
      flatNo: "1-1204",
      surveyNo: "FP 18, Bodakdev",
      status: "Ready for Lease",
      furnishing: "Fully Furnished",
      age: "1 Year",
    },
  },
  {
    id: "rent-4",
    name: "Varachha Diamond Circle Home",
    mode: "rent",
    price: 18000,
    priceLabel: "₹18,000 / mo",
    type: "Apartment",
    tag: "Verified",
    city: "Surat",
    area: "Varachha",
    location: "Varachha, Surat",
    streetAddress: "Near Mini Bazar, Varachha Main Road",
    lat: 21.2140,
    lng: 72.8620,
    bedrooms: 2,
    bathrooms: 2,
    size: 1100,
    dealerId: "dealer-sanjay",
    image: "https://images.unsplash.com/photo-1502005229762-ae1b464a7c0d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1502005229762-ae1b464a7c0d?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Comfortable 2 BHK residence with clean water supply, nearby markets, BRTS stop, and friendly community.",
    amenities: ["BRTS Connectivity", "Solar Geyser", "Security", "Bike Parking"],
    unitDetails: {
      wing: "Wing B",
      floor: "3rd Floor",
      flatNo: "B-303",
      surveyNo: "Survey 89/1",
      status: "Available",
      furnishing: "Semi-Furnished",
      age: "4 Years",
    },
  },

  // ==========================================
  // 4. SHORT-TERM STAY
  // ==========================================
  {
    id: "short-1",
    name: "Dumas Beach Breeze Holiday Villa",
    mode: "short-term",
    price: 4500,
    priceLabel: "₹4,500 / night",
    type: "Villa",
    tag: "Top Rated",
    city: "Surat",
    area: "Dumas Road",
    location: "Dumas Road, Surat",
    streetAddress: "Near Sultanabad Gate, Dumas Coast Road",
    lat: 21.1300,
    lng: 72.7500,
    bedrooms: 3,
    bathrooms: 3,
    size: 2600,
    dealerId: "dealer-rahul",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Peaceful weekend villa getaway near Dumas beach. Features barbecue patio, lush mango orchard lawn, caretaker on demand, and serene environment.",
    amenities: ["Private Lawn", "BBQ Grill", "Kitchenette", "Caretaker", "Wi-Fi", "Pet Friendly"],
    unitDetails: {
      wing: "Private Estate",
      floor: "Ground + Terrace",
      flatNo: "Bungalow No. 7",
      surveyNo: "Coastal Survey 45",
      status: "Instant Booking",
      furnishing: "Fully Furnished",
      age: "Renovated 2024",
    },
  },
  {
    id: "short-2",
    name: "Kudasan Urban Studio Stay",
    mode: "short-term",
    price: 2800,
    priceLabel: "₹2,800 / night",
    type: "Apartment",
    tag: "Instant Book",
    city: "Gandhinagar",
    area: "Kudasan",
    location: "Kudasan, Gandhinagar",
    streetAddress: "Near Infocity & TCS Circle, Kudasan",
    lat: 23.1810,
    lng: 72.6410,
    bedrooms: 1,
    bathrooms: 1,
    size: 650,
    dealerId: "dealer-neha",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Chic modern studio apartment minutes from Infocity, DA-IICT, and PDPU. Equipped with work desk, high speed fiber optic WiFi, and kitchenette.",
    amenities: ["Self Check-in", "Work Desk", "Smart TV", "Fiber Wi-Fi", "Microwave"],
    unitDetails: {
      wing: "Wing B",
      floor: "5th Floor",
      flatNo: "B-510",
      surveyNo: "Kudasan TP 2",
      status: "Available for Short Stay",
      furnishing: "Fully Furnished",
      age: "Brand New",
    },
  },
  {
    id: "short-3",
    name: "Heritage Courtyard Haveli",
    mode: "short-term",
    price: 3500,
    priceLabel: "INR 3,500 / night",
    type: "Villa",
    tag: "Superhost",
    city: "Ahmedabad",
    area: "Old City Heritage Quarter",
    location: "Old City Heritage Quarter, Ahmedabad",
    streetAddress: "Old City Heritage Quarter Main Road, Ahmedabad",
    lat: 23.0338,
    lng: 72.5850,
    bedrooms: 2,
    bathrooms: 2,
    size: 1400,
    dealerId: "dealer-hardik",
    image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    ],
    description: "Restored wooden haveli with carved pillars, open-sky courtyard, and authentic Gujarati hospitality.",
    amenities: ["Courtyard Seating", "Traditional Haveli", "High Speed Wifi", "Breakfast Included", "Air Conditioned"],
    unitDetails: {
      wing: "Heritage Haveli",
      floor: "Ground + 1",
      flatNo: "Haveli 12",
      surveyNo: "Old City Heritage 102",
      status: "Available for Stay",
      furnishing: "Authentic Gujarati Furnished",
      age: "Historic Restored",
    },
  },
];

// Helper to format Indian Currency nicely
export function formatIndianPrice(amount, mode = "buy") {
  if (!amount || isNaN(amount)) return "Price on Request";
  const num = Number(amount);
  if (mode === "rent") {
    return `₹${num.toLocaleString("en-IN")} / mo`;
  }
  if (mode === "short-term") {
    return `₹${num.toLocaleString("en-IN")} / night`;
  }
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2).replace(/\.00$/, "")} Lakh`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

export const CURATED_ROOM_IMAGES = {
  Villa: [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
  ],
  Apartment: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
  ],
  Penthouse: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
  ],
  Bungalow: [
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  ],
  "Row House": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
  ],
  Home: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
  ],
  Plot: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  ],
};

// Extracts canonical photo identifier to prevent duplicate images across different URLs/query strings
export function getPhotoKey(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("data:")) {
    return trimmed.slice(0, 100);
  }
  // Remove query parameters like ?auto=format&fit=crop&w=1200&q=80
  return trimmed.split("?")[0].toLowerCase().trim();
}

// Deduplicates list of image URLs using photo signatures
export function deduplicateImages(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const result = [];
  for (const img of list) {
    if (!img || typeof img !== "string") continue;
    const key = getPhotoKey(img);
    if (key && !seen.has(key)) {
      seen.add(key);
      result.push(img.trim());
    }
  }
  return result;
}

export function getPropertyImages(prop) {
  if (!prop) return [];

  // 1. Check if dealer saved uploaded images in localStorage
  let dealerUploaded = null;
  if (typeof window !== "undefined") {
    try {
      const stored = JSON.parse(localStorage.getItem("dealer_uploaded_property_images") || "{}");
      if (prop.id && stored[String(prop.id)]) {
        dealerUploaded = stored[String(prop.id)];
      } else if (prop.name && stored[prop.name.trim().toLowerCase()]) {
        dealerUploaded = stored[prop.name.trim().toLowerCase()];
      }
    } catch (e) {}
  }

  if (Array.isArray(dealerUploaded) && dealerUploaded.length > 0) {
    return deduplicateImages(dealerUploaded).slice(0, 5);
  }

  // 2. Collect all candidate raw images in order of importance
  let rawList = [];

  // Primary cover image from prop
  const primaryCover = prop.image || prop.imageUrl;
  if (primaryCover) {
    rawList.push(primaryCover);
  }

  // Backend property images (array or JSON string)
  if (Array.isArray(prop.images) && prop.images.length > 0) {
    rawList.push(...prop.images);
  } else if (typeof prop.images === "string") {
    try {
      const parsed = JSON.parse(prop.images);
      if (Array.isArray(parsed) && parsed.length > 0) rawList.push(...parsed);
    } catch {
      if (prop.images.startsWith("http") || prop.images.startsWith("data:")) {
        rawList.push(prop.images);
      }
    }
  }

  // Gallery images if provided
  if (Array.isArray(prop.galleryImages) && prop.galleryImages.length > 0) {
    rawList.push(...prop.galleryImages);
  }

  // Fallback matching property images
  const propNameNorm = (prop.name || prop.title || "").toLowerCase().trim();
  const fallbackMatch = FALLBACK_PROPERTIES.find(
    (fp) => fp.name?.toLowerCase().trim() === propNameNorm || String(fp.id) === String(prop.id)
  );
  if (fallbackMatch?.images && Array.isArray(fallbackMatch.images)) {
    rawList.push(...fallbackMatch.images);
  }
  if (fallbackMatch?.image) {
    rawList.push(fallbackMatch.image);
  }

  // Strict deduplication of all collected candidate images
  let distinctImages = deduplicateImages(rawList);

  if (distinctImages.length === 0) {
    distinctImages.push("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80");
  }

  // Supplement photos from curated room sets without ANY duplicates to provide at least 8 to 12 images
  const type = prop.type || fallbackMatch?.type || "Villa";
  const pool = CURATED_ROOM_IMAGES[type] || CURATED_ROOM_IMAGES.Villa || [];
  const globalFallbackPool = [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  ];

  const seenKeys = new Set(distinctImages.map(getPhotoKey));

  for (const imgUrl of [...pool, ...globalFallbackPool]) {
    if (distinctImages.length >= 10) break;
    const key = getPhotoKey(imgUrl);
    if (key && !seenKeys.has(key)) {
      seenKeys.add(key);
      distinctImages.push(imgUrl);
    }
  }

  return distinctImages;
}

/**
 * Enriches a property object with authoritative coordinates, verified pincode,
 * unit breakdown, and linked dealer profile.
 */
export function enrichProperty(prop) {
  if (!prop) return null;

  // 1. Check if there is an exact match in curated fallback properties
  const propNameNorm = (prop.name || prop.title || "").toLowerCase().trim();
  const fallbackMatch = FALLBACK_PROPERTIES.find(
    (fp) => fp.name?.toLowerCase().trim() === propNameNorm ||
            String(fp.id) === String(prop.id)
  );

  const city = prop.city || fallbackMatch?.city || "Surat";
  let area = prop.area || fallbackMatch?.area;
  if (!area && prop.location) {
    const parts = prop.location.split(",").map((s) => s.trim());
    const cityAreas = GUJARAT_AREAS_GEO[city] || {};
    for (const part of parts) {
      if (cityAreas[part]) {
        area = part;
        break;
      }
    }
    if (!area) {
      area = parts[0] || "Vesu";
    }
  }
  if (!area) area = fallbackMatch?.area || "Vesu";

  const mode = prop.mode || prop.listingType || fallbackMatch?.mode || "buy";

  // Coordinates resolution - prioritizes curated lat/lng if backend doesn't have it
  let lat = Number(prop.latitude || prop.lat || fallbackMatch?.lat);
  let lng = Number(prop.longitude || prop.lng || fallbackMatch?.lng);

  if (!lat || !lng || isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
    // Look up in GUJARAT_AREAS_GEO
    const cityAreas = GUJARAT_AREAS_GEO[city];
    if (cityAreas && cityAreas[area]) {
      lat = cityAreas[area].lat;
      lng = cityAreas[area].lng;
    } else if (cityAreas && prop.location) {
      const parts = prop.location.split(",").map((s) => s.trim());
      for (const part of parts) {
        if (cityAreas[part]) {
          lat = cityAreas[part].lat;
          lng = cityAreas[part].lng;
          break;
        }
      }
    }

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      if (GUJARAT_CITY_COORDS[city]) {
        lat = GUJARAT_CITY_COORDS[city].lat;
        lng = GUJARAT_CITY_COORDS[city].lng;
      } else {
        lat = 21.1702;
        lng = 72.8311;
      }
    }
  }

  // Pincode resolution
  const pincode = prop.pincode || fallbackMatch?.pincode || getGujaratPincode(area, city) || "395007";

  // Price label
  const priceLabel = prop.priceLabel || fallbackMatch?.priceLabel || formatIndianPrice(prop.price, mode);

  // Dealer profile
  const dealer = prop.dealer || fallbackMatch?.dealer || getDealerForProperty({ ...prop, city, area });

  // Unit breakdown
  const unitDetails = {
    wing: prop.unitDetails?.wing || prop.wing || fallbackMatch?.unitDetails?.wing || "Tower A",
    floor: prop.unitDetails?.floor || prop.floor || fallbackMatch?.unitDetails?.floor || "5th Floor",
    flatNo: prop.unitDetails?.flatNo || prop.flatNo || fallbackMatch?.unitDetails?.flatNo || `Unit ${Math.floor(Math.random() * 400 + 101)}`,
    surveyNo: prop.unitDetails?.surveyNo || prop.surveyNo || fallbackMatch?.unitDetails?.surveyNo || `Survey ${Math.floor(Math.random() * 180 + 20)}/1`,
    status: prop.unitDetails?.status || prop.status || fallbackMatch?.unitDetails?.status || (mode === "buy" ? "Ready to Move" : "Available"),
    furnishing: prop.unitDetails?.furnishing || prop.furnishing || fallbackMatch?.unitDetails?.furnishing || "Semi-Furnished",
    age: prop.unitDetails?.age || prop.constructionAge || fallbackMatch?.unitDetails?.age || "Brand New Construction",
  };

  // Images resolution - prioritize dealer uploaded photos and guarantee 5 rich photos
  const images = getPropertyImages({ ...fallbackMatch, ...prop });
  const image = images[0] || prop.image || prop.imageUrl || fallbackMatch?.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  return {
    ...prop,
    id: String(prop.id),
    name: prop.name || prop.title || fallbackMatch?.name || `${prop.bedrooms || 3} BHK ${prop.type || "Apartment"} in ${area}`,
    mode,
    city,
    area,
    location: prop.location || fallbackMatch?.location || `${area}, ${city}`,
    streetAddress: prop.streetAddress || fallbackMatch?.streetAddress || `${area} Main Road, ${city}`,
    pincode,
    lat,
    lng,
    price: Number(prop.price) || fallbackMatch?.price || 5000000,
    priceLabel,
    type: prop.type || fallbackMatch?.type || "Apartment",
    bedrooms: Number(prop.bedrooms) || fallbackMatch?.bedrooms || 3,
    bathrooms: Number(prop.bathrooms) || 2,
    size: Number(prop.size) || 1600,
    image,
    images,
    tag: prop.tag || (mode === "buy" ? "Verified" : "Hot Deal"),
    description: prop.description || `Prime ${prop.type || "apartment"} property situated in ${area}, ${city}, Gujarat with superb connectivity and verified title papers.`,
    amenities: Array.isArray(prop.amenities) && prop.amenities.length > 0
      ? prop.amenities
      : ["24/7 Security", "Car Parking", "Power Backup", "Lift", "Water Storage", "Vastu Compliant"],
    unitDetails,
    dealer,
  };
}

/**
 * Fetch enriched properties from AdonisJS API or Fallback dataset
 */
export async function fetchEnrichedProperties(mode = "buy", params = {}) {
  try {
    const apiData = await getProperties({ mode, ...params });
    const items = Array.isArray(apiData)
      ? apiData
      : Array.isArray(apiData?.data)
      ? apiData.data
      : null;

    if (items && items.length > 0) {
      const enrichedApi = items.map(enrichProperty).filter(Boolean);
      // Merge any fallback properties not in API so user gets comprehensive Gujarat coverage
      const fallbackList = FALLBACK_PROPERTIES.filter((p) => p.mode === mode).map(enrichProperty);
      const existingNames = new Set(enrichedApi.map((p) => p.name?.toLowerCase().trim()));
      fallbackList.forEach((fp) => {
        if (!existingNames.has(fp.name?.toLowerCase().trim())) {
          enrichedApi.push(fp);
        }
      });
      return enrichedApi;
    }
  } catch (err) {
    console.warn("Could not retrieve properties from AdonisJS API, falling back to curated data:", err);
  }

  // Filter fallback properties by mode
  const filtered = FALLBACK_PROPERTIES.filter((p) => p.mode === mode);
  return filtered.map(enrichProperty).filter(Boolean);
}

/**
 * Fetch single enriched property by ID
 */
export async function fetchPropertyById(id) {
  if (!id) return null;

  // 1. Try AdonisJS backend
  try {
    const apiData = await getPropertyById(id);
    if (apiData && apiData.id) {
      return enrichProperty(apiData);
    }
  } catch (err) {
    // ignore and check fallback
  }

  // 2. Check fallback properties
  const found = FALLBACK_PROPERTIES.find((p) => String(p.id) === String(id));
  if (found) {
    return enrichProperty(found);
  }

  // 3. Check if id starts with "trend-" (from trending properties on homepage)
  if (String(id).startsWith("trend-")) {
    const numPart = String(id).replace("trend-", "");
    const matchingFallback = FALLBACK_PROPERTIES.find((p) => String(p.id).includes(numPart)) || FALLBACK_PROPERTIES[0];
    return enrichProperty({ ...matchingFallback, id: String(id) });
  }

  // Default fallback property for arbitrary ID
  return enrichProperty({
    ...FALLBACK_PROPERTIES[0],
    id: String(id),
  });
}
