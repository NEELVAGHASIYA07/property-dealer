// Real-time Geocoding and Reverse Geocoding Utility
// Resolves exact coordinates and real street & society addresses for Gujarat / India properties

export const GUJARAT_CITY_COORDS = {
  Ahmedabad: { lat: 23.0338, lng: 72.5850 },
  Surat: { lat: 21.1702, lng: 72.8311 },
  Vadodara: { lat: 22.3072, lng: 73.1812 },
  Rajkot: { lat: 22.3039, lng: 70.8022 },
  Gandhinagar: { lat: 23.2156, lng: 72.6369 },
  Bhavnagar: { lat: 21.7645, lng: 72.1519 },
  Jamnagar: { lat: 22.4707, lng: 70.0577 },
  Junagadh: { lat: 21.5222, lng: 70.4579 },
  Anand: { lat: 22.5645, lng: 72.9289 },
  Nadiad: { lat: 22.6916, lng: 72.8634 },
  Bharuch: { lat: 21.7051, lng: 72.9959 },
  Vapi: { lat: 20.3893, lng: 72.9106 },
  Mehsana: { lat: 23.5880, lng: 72.3693 },
  Morbi: { lat: 22.8120, lng: 70.8236 },
  Bhuj: { lat: 23.2420, lng: 69.6669 },
  Navsari: { lat: 20.9500, lng: 72.9328 },
};

// Known coordinates of prominent Gujarat localities for proximity centroid matching
export const GUJARAT_AREAS_GEO = {
  Surat: {
    Katargam: { lat: 21.2266, lng: 72.8242 },
    Singanpor: { lat: 21.2330, lng: 72.8105 },
    Amroli: { lat: 21.2480, lng: 72.8290 },
    Adajan: { lat: 21.1926, lng: 72.7925 },
    Pal: { lat: 21.1824, lng: 72.7725 },
    Vesu: { lat: 21.1458, lng: 72.7812 },
    Piplod: { lat: 21.1601, lng: 72.7766 },
    "City Light": { lat: 21.1715, lng: 72.7885 },
    Althan: { lat: 21.1550, lng: 72.8050 },
    "Ghod Dod Road": { lat: 21.1780, lng: 72.8015 },
    Varachha: { lat: 21.2140, lng: 72.8620 },
    "Mota Varachha": { lat: 21.2450, lng: 72.8850 },
    Jahangirpura: { lat: 21.2280, lng: 72.7720 },
    Udhna: { lat: 21.1620, lng: 72.8450 },
    Dindoli: { lat: 21.1480, lng: 72.8710 },
    Nanpura: { lat: 21.1900, lng: 72.8180 },
    Rander: { lat: 21.2150, lng: 72.7920 },
    "Dumas Road": { lat: 21.1300, lng: 72.7500 },
    Palanpur: { lat: 21.2050, lng: 72.7750 },
    Bhestan: { lat: 21.1270, lng: 72.8480 },
    Majura: { lat: 21.1750, lng: 72.8150 },
  },
  Ahmedabad: {
    Bodakdev: { lat: 23.0373, lng: 72.5078 },
    "Sindhu Bhavan Road": { lat: 23.0440, lng: 72.4980 },
    "Prahlad Nagar": { lat: 23.0125, lng: 72.5110 },
    "SG Highway": { lat: 23.0500, lng: 72.5200 },
    Satellite: { lat: 23.0280, lng: 72.5250 },
    Ambli: { lat: 23.0380, lng: 72.4800 },
    Vastrapur: { lat: 23.0350, lng: 72.5280 },
    Thaltej: { lat: 23.0500, lng: 72.5100 },
    "South Bopal": { lat: 23.0220, lng: 72.4600 },
    "Science City Road": { lat: 23.0780, lng: 72.5150 },
    Shela: { lat: 23.0100, lng: 72.4650 },
    Navrangpura: { lat: 23.0370, lng: 72.5600 },
    Maninagar: { lat: 22.9980, lng: 72.6020 },
    Chandkheda: { lat: 23.1100, lng: 72.5850 },
    Gota: { lat: 23.0980, lng: 72.5350 },
    Ghatlodia: { lat: 23.0650, lng: 72.5450 },
    Naranpura: { lat: 23.0550, lng: 72.5550 },
    Paldi: { lat: 23.0150, lng: 72.5650 },
  },
  Vadodara: {
    Alkapuri: { lat: 22.3120, lng: 73.1750 },
    "Vasna-Bhayli Road": { lat: 22.2880, lng: 73.1350 },
    Gotri: { lat: 22.3150, lng: 73.1450 },
    Sayajigunj: { lat: 22.3100, lng: 73.1850 },
    Karelibaug: { lat: 22.3250, lng: 73.2000 },
    Akota: { lat: 22.2950, lng: 73.1750 },
    Fatehgunj: { lat: 22.3250, lng: 73.1880 },
    Manjalpur: { lat: 22.2680, lng: 73.1950 },
    Sevasi: { lat: 22.3000, lng: 73.1150 },
    "Old Padra Road": { lat: 22.2950, lng: 73.1600 },
  },
  Rajkot: {
    "Kalawad Road": { lat: 22.2850, lng: 70.7700 },
    "Yagnik Road": { lat: 22.2980, lng: 70.7950 },
    "University Road": { lat: 22.2950, lng: 70.7650 },
    "Nana Mava": { lat: 22.2750, lng: 70.7750 },
    "150 Feet Ring Road": { lat: 22.2800, lng: 70.7800 },
    "Raiya Road": { lat: 22.3050, lng: 70.7750 },
    "Amin Marg": { lat: 22.2880, lng: 70.7880 },
    "Kotecha Chowk": { lat: 22.2920, lng: 70.7850 },
    Madhapar: { lat: 22.3200, lng: 70.7800 },
  },
  Gandhinagar: {
    Kudasan: { lat: 23.1880, lng: 72.6320 },
    "GIFT City Road": { lat: 23.1600, lng: 72.6850 },
    Infocity: { lat: 23.1950, lng: 72.6300 },
    Raysan: { lat: 23.1750, lng: 72.6450 },
    Sargasan: { lat: 23.1950, lng: 72.6100 },
    "Sector 8": { lat: 23.2300, lng: 72.6500 },
    "Sector 1": { lat: 23.2200, lng: 72.6700 },
    "Sector 21": { lat: 23.2350, lng: 72.6400 },
    Vavol: { lat: 23.2300, lng: 72.6150 },
    Koba: { lat: 23.1450, lng: 72.6400 },
  },
};

// Default central pincodes for Gujarat cities
export const GUJARAT_CITY_DEFAULT_PINCODES = {
  Surat: "395007",
  Ahmedabad: "380054",
  Vadodara: "390007",
  Rajkot: "360005",
  Gandhinagar: "382421",
  Bhavnagar: "364002",
  Jamnagar: "361008",
  Junagadh: "362001",
  Anand: "388001",
  Nadiad: "387001",
  Bharuch: "392001",
  Vapi: "396191",
  Mehsana: "384002",
  Morbi: "363641",
  Bhuj: "370001",
  Navsari: "396445",
  Porbandar: "360575",
  Palanpur: "385001",
};

// Authoritative Area -> 6-Digit Pincode dictionary for Gujarat localities
export const GUJARAT_AREA_PINCODES = {
  // SURAT
  Katargam: "395004",
  Singanpor: "395004",
  Amroli: "394107",
  "Mota Varachha": "394101",
  Varachha: "395006",
  "Nana Varachha": "395006",
  Sarthana: "395006",
  Adajan: "395009",
  Pal: "395009",
  Palanpur: "395009",
  "Palanpur Patia": "395009",
  Jahangirpura: "395005",
  Rander: "395005",
  Vesu: "395007",
  Piplod: "395007",
  "City Light": "395007",
  "Ghod Dod Road": "395007",
  "Dumas Road": "395007",
  Dumas: "395007",
  Althan: "395017",
  Bhimrad: "395017",
  Nanpura: "395001",
  Athwa: "395001",
  Athwalines: "395001",
  Majura: "395002",
  "Majura Gate": "395002",
  Sagarampura: "395002",
  Mahidharpura: "395003",
  Begampura: "395003",
  Salabatpura: "395003",
  Udhna: "395008",
  Godadara: "395010",
  "Parvat Patiya": "395010",
  Punagam: "395010",
  Limbayat: "395012",
  Dindoli: "394210",
  Bhestan: "395023",
  Bamroli: "395023",
  Pandesara: "394221",
  Sachin: "394230",
  Kamrej: "394185",
  Hazira: "394270",
  Bhatha: "394510",
  Ichhapore: "394510",
  Kosad: "394107",

  // AHMEDABAD
  Bodakdev: "380054",
  "Sindhu Bhavan Road": "380059",
  "Prahlad Nagar": "380015",
  "SG Highway": "380054",
  Satellite: "380015",
  Ambli: "380058",
  Vastrapur: "380015",
  Thaltej: "380059",
  "South Bopal": "380058",
  Bopal: "380058",
  "Science City Road": "380060",
  "Science City": "380060",
  Shela: "380058",
  Shilaj: "380059",
  Navrangpura: "380009",
  Ghatlodia: "380061",
  Naranpura: "380013",
  Paldi: "380007",
  Maninagar: "380008",
  Chandkheda: "382424",
  Gota: "382481",
  Ellisbridge: "380006",
  Gurukul: "380052",
  Memnagar: "380052",
  "Ashram Road": "380009",
  Motera: "380005",
  Sabarmati: "380005",
  Ranip: "382480",
  Shahibaug: "380004",
  Usmanpura: "380013",
  Nikol: "382350",
  Naroda: "382330",
  Odhav: "382415",
  Vastral: "382418",
  Makarba: "380051",
  Jodhpur: "380015",
  Isanpur: "382443",
  Chandlodiya: "382481",
  Sola: "380060",

  // GANDHINAGAR
  Kudasan: "382421",
  "GIFT City Road": "382355",
  "GIFT City": "382355",
  Infocity: "382007",
  Raysan: "382426",
  Sargasan: "382421",
  "Sector 8": "382010",
  "Sector 1": "382010",
  "Sector 7": "382007",
  "Sector 10": "382010",
  "Sector 16": "382016",
  "Sector 21": "382021",
  "Sector 24": "382024",
  Vavol: "382016",
  Koba: "382007",
  Randesan: "382426",
  Pethapur: "382610",
  Chiloda: "382355",

  // VADODARA
  Alkapuri: "390007",
  "Vasna-Bhayli Road": "391410",
  "Vasna-Bhayli": "391410",
  Bhayli: "391410",
  Gotri: "390021",
  Sayajigunj: "390005",
  Karelibaug: "390018",
  Akota: "390020",
  Fatehgunj: "390002",
  Manjalpur: "390011",
  Sevasi: "391101",
  "Old Padra Road": "390020",
  "Waghodia Road": "390019",
  Sama: "390024",
  Harni: "390022",
  Atladara: "390012",
  Subhanpura: "390023",
  Gorwa: "390016",
  Nizampura: "390002",
  Makarpura: "390014",

  // RAJKOT
  "Kalawad Road": "360005",
  "Yagnik Road": "360001",
  "University Road": "360005",
  "Nana Mava": "360005",
  "150 Feet Ring Road": "360005",
  "Raiya Road": "360007",
  "Amin Marg": "360001",
  "Kotecha Chowk": "360001",
  Madhapar: "360006",
  Mavdi: "360004",
  Kothariya: "360022",
  Bhaktinagar: "360002",
  "Gondal Road": "360004",
  "Pedak Road": "360003",

  // BHAVNAGAR
  "Victoria Park Road": "364002",
  "Victoria Park": "364002",
  Takhteshwar: "364002",
  "Waghawadi Road": "364002",
  Kaliyabid: "364002",
  "Ghogha Road": "364001",
  Subhashnagar: "364001",
  Kalanala: "364001",
  Chitra: "364004",
  Bharatnagar: "364002",

  // JAMNAGAR
  "Patel Colony": "361008",
  "Digjam Road": "361006",
  "Bedi Road": "361004",
  Bedi: "361004",
  "Oshwal Colony": "361008",
  "Park Colony": "361008",
  "Khambhalia Road": "361006",
  "Indira Marg": "361002",

  // JUNAGADH
  "Moti Baug": "362001",
  "Zanzarda Road": "362002",
  "Girnar Road": "362001",
  "Talav Gate": "362001",
  Joshipura: "362002",

  // ANAND
  "Vidyanagar Road": "388120",
  "Vallabh Vidyanagar": "388120",
  "Amul Dairy Road": "388001",
  "Borsad Road": "388001",
  "Jitodia Road": "388001",

  // NADIAD
  "College Road": "387001",
  "Mission Road": "387002",
  "Santram Road": "387001",
  "Uttarsanda Road": "387001",

  // BHARUCH
  "Zadeshwar Road": "392011",
  Zadeshwar: "392011",
  "Link Road": "392001",
  "Station Road": "392001",
  Bholav: "392002",

  // VAPI
  Chala: "396191",
  "GIDC Residential": "396195",
  "Koparli Road": "396191",
  "Silvassa Road": "396191",

  // MEHSANA
  "Radhanpur Road": "384002",
  "Nagaland Circle": "384002",
  "Highway Road": "384002",
  "Modhera Road": "384002",

  // MORBI
  "Sanala Road": "363641",
  "Ravapar Road": "363641",
  "Kandla Highway": "363642",
  "Lakhdhirpur Road": "363642",

  // BHUJ
  "Mirzapar Road": "370001",
  "Mundra Road": "370001",
  "College Road": "370001",
  "Jubilee Ground": "370001",

  // NAVSARI
  Lunsikui: "396445",
  Vijalpore: "396445",
  "Station Road": "396445",
  "Chhapra Road": "396445",
};

// Known pincodes for instant area resolution (two-way mapping)
export const GUJARAT_PINCODE_AREAS = {
  395004: "Katargam",
  395009: "Adajan",
  395007: "Vesu",
  395001: "Nanpura",
  395002: "Sagarampura",
  395003: "Mahidharpura",
  395005: "Athwa",
  395006: "Varachha",
  395008: "Udhna",
  395010: "Godadara",
  395012: "Limbayat",
  395017: "Althan",
  395023: "Bhestan",
  394101: "Mota Varachha",
  394107: "Amroli",
  394210: "Dindoli",
  394221: "Pandesara",
  394230: "Sachin",
  394185: "Kamrej",
  394270: "Hazira",
  394510: "Bhatha",
  380015: "Prahlad Nagar",
  380054: "Bodakdev",
  380059: "Thaltej",
  380058: "Bopal",
  380060: "Science City",
  380061: "Ghatlodia",
  380009: "Navrangpura",
  380013: "Naranpura",
  380006: "Ellisbridge",
  380007: "Paldi",
  380008: "Maninagar",
  380052: "Gurukul",
  380051: "Makarba",
  382424: "Chandkheda",
  382481: "Gota",
  382480: "Ranip",
  380004: "Shahibaug",
  382350: "Nikol",
  382330: "Naroda",
  382415: "Odhav",
  382418: "Vastral",
  382421: "Kudasan",
  382355: "GIFT City",
  382007: "Sector 7",
  382010: "Sector 10",
  382016: "Sector 16",
  382021: "Sector 21",
  382024: "Sector 24",
  382426: "Raysan",
  382610: "Pethapur",
  390007: "Alkapuri",
  391410: "Vasna-Bhayli",
  390021: "Gotri",
  390005: "Sayajigunj",
  390018: "Karelibaug",
  390020: "Akota",
  390002: "Fatehgunj",
  390011: "Manjalpur",
  391101: "Sevasi",
  390019: "Waghodia Road",
  390024: "Sama",
  390022: "Harni",
  390012: "Atladara",
  390023: "Subhanpura",
  390016: "Gorwa",
  390014: "Makarpura",
  360005: "Kalawad Road",
  360001: "Yagnik Road",
  360004: "University Road",
  360007: "Raiya Road",
  360006: "Madhapar",
  360022: "Kothariya",
  360002: "Bhaktinagar",
  360003: "Pedak Road",
  364002: "Victoria Park Road",
  364001: "Ghogha Road",
  364004: "Chitra",
  361008: "Patel Colony",
  361006: "Digjam Road",
  361004: "Bedi Road",
  361002: "Indira Marg",
  362001: "Moti Baug",
  362002: "Zanzarda Road",
  388120: "Vallabh Vidyanagar",
  388001: "Anand Central",
  387001: "Santram Road",
  387002: "Mission Road",
  392011: "Zadeshwar",
  392001: "Station Road",
  392002: "Bholav",
  396191: "Chala",
  396195: "GIDC Residential",
  384002: "Radhanpur Road",
  363641: "Sanala Road",
  363642: "Kandla Highway",
  370001: "Jubilee Ground",
  396445: "Lunsikui",
};

/**
 * Authoritatively get the 6-digit Pincode for a Gujarat area and optional city
 */
export function getGujaratPincode(areaName, cityName = "") {
  if (!areaName || typeof areaName !== "string") {
    if (cityName && GUJARAT_CITY_DEFAULT_PINCODES[cityName]) {
      return GUJARAT_CITY_DEFAULT_PINCODES[cityName];
    }
    return "";
  }

  const clean = areaName.trim();
  // 1. Exact match
  if (GUJARAT_AREA_PINCODES[clean]) {
    return GUJARAT_AREA_PINCODES[clean];
  }

  // 2. Normalized alphanumeric match
  const norm = clean.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const [key, pin] of Object.entries(GUJARAT_AREA_PINCODES)) {
    if (key.toLowerCase().replace(/[^a-z0-9]/g, "") === norm) {
      return pin;
    }
  }

  // 3. Substring / partial match (e.g. "Katargam Darwaja" or "Near Adajan BRTS")
  for (const [key, pin] of Object.entries(GUJARAT_AREA_PINCODES)) {
    const keyNorm = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (keyNorm.length >= 4 && (norm.includes(keyNorm) || keyNorm.includes(norm))) {
      return pin;
    }
  }

  // 4. City default fallback
  if (cityName && GUJARAT_CITY_DEFAULT_PINCODES[cityName]) {
    return GUJARAT_CITY_DEFAULT_PINCODES[cityName];
  }

  return "";
}

/**
 * Reverse lookup area name by 6-digit Pincode
 */
export function getGujaratAreaForPincode(pincode) {
  if (!pincode) return "";
  const clean = String(pincode).trim();
  return GUJARAT_PINCODE_AREAS[clean] || "";
}

export function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestKnownArea(lat, lng, cityName = "Ahmedabad") {
  const cityMap = GUJARAT_AREAS_GEO[cityName];
  if (!cityMap || !lat || !lng) return "";
  let closest = "";
  let minDist = 7.0; // Within 7km radius in the city
  for (const [areaName, coords] of Object.entries(cityMap)) {
    const d = getDistanceKm(lat, lng, coords.lat, coords.lng);
    if (d < minDist) {
      minDist = d;
      closest = areaName;
    }
  }
  return closest;
}

// Clean administrative suffix from names (e.g., 'Katargam Taluka' -> 'Katargam')
export function cleanAdminName(val, cityRef = "") {
  if (!val || typeof val !== "string") return "";
  let cleaned = val
    .replace(/\b(Taluka|Tehsil|Ward|Zone|District|Nagar\s*Palika|Mahanagar\s*Palika|Sub-District)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";
  if (cityRef && cleaned.toLowerCase() === cityRef.toLowerCase()) return "";
  return cleaned;
}

/**
 * Clean and build an accurate address string prioritizing Society/Apartment Name, Road, Locality, and City
 */
export function formatAddressFromDetails(addressObj, defaultCity = "Ahmedabad", rawItem = null, customLat = null, customLng = null) {
  if (!addressObj && !rawItem) return { fullAddress: "", society: "", road: "", area: "", city: defaultCity, pincode: "" };

  const addr = addressObj || {};

  // 1. City / Town
  const city =
    (addr.city && addr.city.trim()) ||
    (addr.town && addr.town.trim()) ||
    (addr.municipality && addr.municipality.trim()) ||
    defaultCity;

  // 2. Postal PIN code
  const pincode = (addr.postcode && addr.postcode.trim()) || "";

  // 3. Precise Place / Society / Landmark / Business Name
  let societyOrPlace =
    (rawItem?.name && rawItem.name.trim()) ||
    addr.residential ||
    addr.building ||
    addr.apartment ||
    addr.commercial ||
    addr.house_name ||
    addr.condominium ||
    addr.amenity ||
    addr.shop ||
    addr.office ||
    addr.tourism ||
    addr.leisure ||
    addr.historic ||
    addr.subdivision ||
    "";

  // 4. Road / Street / Highway
  const road =
    addr.road ||
    addr.street ||
    addr.pedestrian ||
    addr.highway ||
    "";

  // 5. Locality / Suburb / Area / Neighbourhood
  let locality =
    addr.suburb ||
    addr.neighbourhood ||
    addr.quarter ||
    addr.residential ||
    addr.subdistrict ||
    addr.city_district ||
    addr.village ||
    addr.locality ||
    "";

  if (!locality) locality = cleanAdminName(addr.county, city);
  if (!locality) locality = cleanAdminName(addr.district, city);

  // Check display_name segments
  if (!locality && rawItem?.display_name) {
    const rawSegs = rawItem.display_name.split(",").map((s) => s.trim());
    for (const seg of rawSegs) {
      const c = cleanAdminName(seg, city);
      if (
        c &&
        c.toLowerCase() !== city.toLowerCase() &&
        c !== "Gujarat" &&
        c !== "India" &&
        !/^\d+$/.test(c) &&
        !c.includes("ISO3166") &&
        c.length > 2
      ) {
        locality = c;
        break;
      }
    }
  }

  // Fallback to proximity matching against known Gujarat area coordinates
  const targetLat = customLat || (rawItem?.lat ? parseFloat(rawItem.lat) : null);
  const targetLng = customLng || (rawItem?.lon ? parseFloat(rawItem.lon) : null);
  if (!locality && targetLat && targetLng) {
    locality = findNearestKnownArea(targetLat, targetLng, city) || "";
  }

  // Fallback to Pincode mapping
  if (!locality && pincode && GUJARAT_PINCODE_AREAS[pincode]) {
    locality = GUJARAT_PINCODE_AREAS[pincode];
  }

  // If still empty, use road or society or city's primary hub
  if (!locality) {
    locality = road || societyOrPlace || (city === "Surat" ? "Vesu" : "Bodakdev");
  }

  // Prevent society duplicate with road or locality or city
  if (
    societyOrPlace &&
    (societyOrPlace.toLowerCase() === road.toLowerCase() ||
      societyOrPlace.toLowerCase() === locality.toLowerCase() ||
      societyOrPlace.toLowerCase() === city.toLowerCase())
  ) {
    societyOrPlace = "";
  }

  // Combine address parts in logical sequence: [Society/Building] -> [Road] -> [Locality] -> [City]
  const parts = [];
  if (societyOrPlace && societyOrPlace.toLowerCase() !== city.toLowerCase()) {
    parts.push(societyOrPlace);
  }
  if (road && road.toLowerCase() !== city.toLowerCase() && !parts.some((p) => p.toLowerCase().includes(road.toLowerCase()))) {
    parts.push(road);
  }
  if (locality && locality.toLowerCase() !== city.toLowerCase() && !parts.some((p) => p.toLowerCase().includes(locality.toLowerCase()))) {
    parts.push(locality);
  }
  if (city) {
    parts.push(city);
  }

  // Strict case-insensitive deduplication of parts so "Surat, Surat" NEVER happens
  const uniqueParts = [];
  const seenParts = new Set();
  for (const part of parts) {
    const key = part.trim().toLowerCase();
    if (key && !seenParts.has(key)) {
      seenParts.add(key);
      uniqueParts.push(part.trim());
    }
  }

  // Authoritative Gujarat Pincode resolution based on locality and city
  const verifiedPincode = getGujaratPincode(locality, city);
  const finalPincode = verifiedPincode || pincode;

  let fullStr = uniqueParts.join(", ");
  if (finalPincode && !fullStr.includes(finalPincode)) {
    fullStr += `, ${finalPincode}`;
  }

  return {
    fullAddress: fullStr || `${locality || city}, Gujarat`,
    society: societyOrPlace || locality || "Exact Pin Point",
    road: road || "",
    area: locality,
    city: city || defaultCity,
    pincode: finalPincode || "",
  };
}

export function parseNominatimResult(item, defaultCity = "Ahmedabad") {
  const lat = parseFloat(item.lat);
  const lng = parseFloat(item.lon);
  const details = formatAddressFromDetails(item.address, defaultCity, item, lat, lng);

  return {
    lat,
    lng,
    displayName: item.display_name,
    address: details.fullAddress,
    society: details.society,
    road: details.road,
    area: details.area,
    city: details.city,
    pincode: details.pincode,
  };
}

/**
 * High-accuracy multi-tier location search restricted strictly to Gujarat / India
 * Guarantees no cross-continental or wrong-state misidentifications
 */
export async function searchLocation(query, city = "Ahmedabad") {
  if (!query || !query.trim()) return null;

  const center = GUJARAT_CITY_COORDS[city] || GUJARAT_CITY_COORDS.Ahmedabad;
  const cleanQ = query.trim();

  // Tier 1: Nominatim queries strictly in India with priority for selected city
  const nomQueries = [
    `${cleanQ}, ${city}, Gujarat, India`,
    `${cleanQ}, Gujarat, India`,
  ];

  for (const q of nomQueries) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=in&q=${encodeURIComponent(
        q
      )}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "PropertyDealerApp/2.0", Accept: "application/json" },
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Find matches in Gujarat, sorted by proximity to target city
        const gujaratMatches = data.filter(
          (d) => d.address?.state === "Gujarat" || (d.display_name && d.display_name.includes("Gujarat"))
        );
        const candidates = gujaratMatches.length > 0 ? gujaratMatches : data;
        candidates.sort((a, b) => {
          const distA = getDistanceKm(center.lat, center.lng, parseFloat(a.lat), parseFloat(a.lon));
          const distB = getDistanceKm(center.lat, center.lng, parseFloat(b.lat), parseFloat(b.lon));
          return distA - distB;
        });

        const best = candidates[0];
        if (best.address?.country_code === "in" || best.display_name?.includes("India")) {
          return parseNominatimResult(best, city);
        }
      }
    } catch (err) {
      console.warn("Nominatim tier error:", err);
    }
  }

  // Tier 2: Photon API with lat/lon proximity bias towards target city (strictly India)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(
      cleanQ
    )}&lat=${center.lat}&lon=${center.lng}&limit=8`;
    const pRes = await fetch(photonUrl);
    const pData = await pRes.json();
    if (pData?.features?.length > 0) {
      const inMatches = pData.features.filter(
        (f) => f.properties?.country === "India" || f.properties?.countrycode === "IN"
      );

      if (inMatches.length > 0) {
        inMatches.sort((a, b) => {
          const aIsGj = a.properties?.state === "Gujarat" ? 0 : 1;
          const bIsGj = b.properties?.state === "Gujarat" ? 0 : 1;
          if (aIsGj !== bIsGj) return aIsGj - bIsGj;
          const distA = getDistanceKm(center.lat, center.lng, a.geometry.coordinates[1], a.geometry.coordinates[0]);
          const distB = getDistanceKm(center.lat, center.lng, b.geometry.coordinates[1], b.geometry.coordinates[0]);
          return distA - distB;
        });

        const best = inMatches[0];
        const lat = best.geometry.coordinates[1];
        const lng = best.geometry.coordinates[0];

        const placeName = best.properties?.name || "";
        const street = best.properties?.street || "";
        const locality = best.properties?.city || best.properties?.district || city;
        const targetArea = locality || findNearestKnownArea(lat, lng, city) || street || placeName || (city === "Surat" ? "Vesu" : "Bodakdev");
        const pincode = getGujaratPincode(targetArea, city) || best.properties?.postcode || "";

        const parts = [];
        if (placeName) parts.push(placeName);
        if (street && !parts.some((p) => p.toLowerCase().includes(street.toLowerCase()))) parts.push(street);
        if (targetArea && !parts.some((p) => p.toLowerCase().includes(targetArea.toLowerCase()))) parts.push(targetArea);
        if (city && !parts.some((p) => p.toLowerCase().includes(city.toLowerCase()))) parts.push(city);

        let address = parts.join(", ");
        if (pincode && !address.includes(pincode)) address += ` - ${pincode}`;

        return {
          lat,
          lng,
          displayName: address,
          address: address || `${placeName || cleanQ}, ${city}, Gujarat`,
          society: placeName || street || targetArea || "Exact Pin Point",
          road: street || "",
          area: targetArea,
          city: best.properties?.city || city,
          pincode: pincode || "",
        };
      }
    }
  } catch (err) {
    console.warn("Photon search error:", err);
  }

  // Tier 3: Nominatim with bounding box around target city (~50km)
  try {
    const delta = 0.45;
    const viewbox = `${center.lng - delta},${center.lat + delta},${center.lng + delta},${center.lat - delta}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=in&viewbox=${viewbox}&q=${encodeURIComponent(
      cleanQ
    )}`;
    const res = await fetch(url, { headers: { "User-Agent": "PropertyDealerApp/2.0" } });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return parseNominatimResult(data[0], city);
    }
  } catch (err) {
    console.warn("Viewbox search error:", err);
  }

  return null;
}

/**
 * Autocomplete suggestions for map search input
 */
export async function searchLocationSuggestions(query, city = "Ahmedabad") {
  if (!query || query.trim().length < 2) return [];

  const center = GUJARAT_CITY_COORDS[city] || GUJARAT_CITY_COORDS.Ahmedabad;
  const cleanQ = query.trim();

  try {
    const nomPromise = fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=4&countrycodes=in&q=${encodeURIComponent(
        `${cleanQ}, ${city}, Gujarat, India`
      )}`,
      { headers: { "User-Agent": "PropertyDealerApp/2.0" } }
    )
      .then((r) => r.json())
      .catch(() => []);

    const photonPromise = fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQ)}&lat=${center.lat}&lon=${center.lng}&limit=5`
    )
      .then((r) => r.json())
      .catch(() => ({ features: [] }));

    const [nomData, photonData] = await Promise.all([nomPromise, photonPromise]);

    const results = [];

    if (Array.isArray(nomData)) {
      nomData.forEach((item) => {
        const parsed = parseNominatimResult(item, city);
        results.push({
          title: parsed.society || item.name || item.display_name.split(",")[0],
          subtitle: parsed.address,
          lat: parsed.lat,
          lng: parsed.lng,
          address: parsed.address,
          society: parsed.society,
          area: parsed.area,
          city: parsed.city,
          pincode: parsed.pincode,
        });
      });
    }

    if (photonData?.features) {
      photonData.features
        .filter((f) => f.properties?.country === "India" || f.properties?.countrycode === "IN")
        .forEach((f) => {
          const lat = f.geometry.coordinates[1];
          const lng = f.geometry.coordinates[0];
          if (!results.some((r) => Math.abs(r.lat - lat) < 0.001 && Math.abs(r.lng - lng) < 0.001)) {
            const name = f.properties?.name || "";
            const street = f.properties?.street || "";
            const dist = getDistanceKm(center.lat, center.lng, lat, lng);
            if (dist < 85) {
              const fullAddr = [name, street, f.properties?.city || city, "Gujarat"]
                .filter(Boolean)
                .join(", ");
              const detectedSugArea = findNearestKnownArea(lat, lng, f.properties?.city || city) || street || (city === "Surat" ? "Vesu" : "Bodakdev");
              results.push({
                title: name || street,
                subtitle: fullAddr,
                lat,
                lng,
                address: fullAddr,
                society: name || street || "Exact Pin Point",
                area: detectedSugArea,
                city: f.properties?.city || city,
                pincode: getGujaratPincode(detectedSugArea, f.properties?.city || city) || f.properties?.postcode || "",
              });
            }
          }
        });
    }

    return results.slice(0, 6);
  } catch (err) {
    console.error("Suggestions error:", err);
    return [];
  }
}

/**
 * Reverse geocode coordinates to exact building, society, road, and locality
 */
export async function reverseGeocode(lat, lng, defaultCity = "Ahmedabad") {
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&zoom=18&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "PropertyDealerApp/2.0",
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Reverse geocoding error");
    const data = await res.json();
    if (!data || !data.address) return null;

    return parseNominatimResult(data, defaultCity);
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    return null;
  }
}

/**
 * Return direct Google Maps point link with marker pin
 */
export function getGoogleMapsUrl(lat, lng, fallbackAddress = "") {
  if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
    return `https://www.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=17`;
  }
  if (fallbackAddress) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackAddress)}`;
  }
  return "https://www.google.com/maps";
}

/**
 * Return direct Google Maps pin marker URL for coordinates
 * This URL scheme guarantees dropping an exact red pin on the location
 */
export function getGoogleMapsPinUrl(lat, lng, label = "") {
  if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
    return `https://www.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=17`;
  }
  if (label) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label)}`;
  }
  return "https://www.google.com/maps";
}

/**
 * Resolves exact coordinates for any property object
 * Checks mapLat/mapLng, lat/lng, address regex, area matching, and city coords
 */
export function resolvePropertyCoordinates(prop) {
  if (!prop) return { lat: 21.1702, lng: 72.8311 };

  // 1. Explicit mapLat / mapLng
  if (prop.mapLat && prop.mapLng && !isNaN(Number(prop.mapLat)) && !isNaN(Number(prop.mapLng))) {
    return { lat: Number(prop.mapLat), lng: Number(prop.mapLng) };
  }

  // 2. Explicit lat / lng
  if (prop.lat && prop.lng && !isNaN(Number(prop.lat)) && !isNaN(Number(prop.lng))) {
    return { lat: Number(prop.lat), lng: Number(prop.lng) };
  }

  // 3. Extract from mapUrl if contains query
  if (prop.mapUrl && typeof prop.mapUrl === "string" && prop.mapUrl.includes("?q=")) {
    const match = prop.mapUrl.match(/\?q=([0-9.-]+),([0-9.-]+)/);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
  }

  // 4. Area match in GUJARAT_AREAS_GEO
  const city = prop.city || "Surat";
  const locality = `${prop.area || ""} ${prop.location || ""} ${prop.streetAddress || ""} ${prop.name || ""}`.toLowerCase();

  if (GUJARAT_AREAS_GEO[city]) {
    for (const [areaName, coords] of Object.entries(GUJARAT_AREAS_GEO[city])) {
      if (locality.includes(areaName.toLowerCase())) {
        return coords;
      }
    }
  }

  // Check any Gujarat city area match
  for (const [cityName, areas] of Object.entries(GUJARAT_AREAS_GEO)) {
    for (const [areaName, coords] of Object.entries(areas)) {
      if (locality.includes(areaName.toLowerCase())) {
        return coords;
      }
    }
  }

  // 5. City center
  if (GUJARAT_CITY_COORDS[city]) {
    return GUJARAT_CITY_COORDS[city];
  }

  return { lat: 21.1702, lng: 72.8311 };
}

/**
 * Direct Google Maps Web URL for opening in a new tab centered on a place or city
 */
export function getDirectGoogleMapsOpenUrl(city = "Ahmedabad", query = "", lat = null, lng = null) {
  if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
    return `https://www.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=17`;
  }
  if (query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query}, ${city}, Gujarat`)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${city}, Gujarat`)}`;
}

/**
 * Google Maps Direct Embed iframe URL for real Google Maps interactive preview
 */
export function getGoogleMapsEmbedUrl(lat, lng) {
  if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
    return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=17&ie=UTF8&iwloc=&output=embed`;
  }
  return `https://maps.google.com/maps?q=Surat&t=&z=14&ie=UTF8&iwloc=&output=embed`;
}

/**
 * Parse coordinates and place name from any Google Maps link, coordinates, or search text
 */
export async function parseGoogleMapsInput(input, defaultCity = "Ahmedabad") {
  if (!input || !input.trim()) return null;
  let raw = input.trim();

  // If short link like maps.app.goo.gl or goo.gl/maps, resolve via API route
  if (raw.includes("maps.app.goo.gl") || raw.includes("goo.gl/maps")) {
    try {
      const res = await fetch(`/api/resolve-maps?url=${encodeURIComponent(raw)}`);
      const data = await res.json();
      if (data?.finalUrl) {
        raw = data.finalUrl;
      }
    } catch (e) {
      console.warn("Could not expand short URL:", e);
    }
  }

  // Extract place name from /place/Name/@...
  let placeName = "";
  const placeMatch = raw.match(/\/maps\/place\/([^/@?]+)/);
  if (placeMatch) {
    placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
  }

  // 1. Direct comma separated numbers: '23.0338, 72.5850'
  const plainMatch = raw.match(/^(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)$/);
  if (plainMatch) {
    const lat = parseFloat(plainMatch[1]);
    const lng = parseFloat(plainMatch[3]);
    const geo = await reverseGeocode(lat, lng, defaultCity);
    return {
      lat,
      lng,
      placeName,
      address: geo?.address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      society: placeName || geo?.society || "",
      area: geo?.area || "",
      city: geo?.city || defaultCity,
      pincode: geo?.pincode || "",
      mapUrl: `https://www.google.com/maps?q=${lat},${lng}&z=18`,
    };
  }

  // 2. Query param ?q=lat,lng or &q=lat,lng
  const qMatch = raw.match(/[?&]q=(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[3]);
    const geo = await reverseGeocode(lat, lng, defaultCity);
    return {
      lat,
      lng,
      placeName,
      address: geo?.address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      society: placeName || geo?.society || "",
      area: geo?.area || "",
      city: geo?.city || defaultCity,
      pincode: geo?.pincode || "",
      mapUrl: `https://www.google.com/maps?q=${lat},${lng}&z=18`,
    };
  }

  // 3. @lat,lng format
  const atMatch = raw.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    const geo = await reverseGeocode(lat, lng, defaultCity);
    return {
      lat,
      lng,
      placeName,
      address: geo?.address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      society: placeName || geo?.society || "",
      area: geo?.area || "",
      city: geo?.city || defaultCity,
      pincode: geo?.pincode || "",
      mapUrl: `https://www.google.com/maps?q=${lat},${lng}&z=18`,
    };
  }

  // 4. Protobuf !3dlat!4dlng
  const protoMatch = raw.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (protoMatch) {
    const lat = parseFloat(protoMatch[1]);
    const lng = parseFloat(protoMatch[2]);
    const geo = await reverseGeocode(lat, lng, defaultCity);
    return {
      lat,
      lng,
      placeName,
      address: geo?.address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      society: placeName || geo?.society || "",
      area: geo?.area || "",
      city: geo?.city || defaultCity,
      pincode: geo?.pincode || "",
      mapUrl: `https://www.google.com/maps?q=${lat},${lng}&z=18`,
    };
  }

  // 5. If input is a search text (society name, landmark or road)
  const searchRes = await searchLocation(raw, defaultCity);
  if (searchRes) {
    return {
      ...searchRes,
      mapUrl: `https://www.google.com/maps?q=${searchRes.lat},${searchRes.lng}&z=18`,
    };
  }

  return null;
}

