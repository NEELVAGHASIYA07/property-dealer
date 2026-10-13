/**
 * Property Search & Filter Constants
 */

export const PRICE_OPTIONS = {
  rent: [
    { label: "All price", value: "" },
    { label: "Under INR 20,000 / mo", value: "0-20000" },
    { label: "INR 20,000 – 40,000 / mo", value: "20000-40000" },
    { label: "INR 40,000 – 60,000 / mo", value: "40000-60000" },
    { label: "INR 60,000 – 80,000 / mo", value: "60000-80000" },
    { label: "Above INR 80,000 / mo", value: "80000+" },
  ],
  buy: [
    { label: "All price", value: "" },
    { label: "Under INR 50 L", value: "0-5000000" },
    { label: "INR 50 L – 1 Cr", value: "5000000-10000000" },
    { label: "INR 1 Cr – 2 Cr", value: "10000000-20000000" },
    { label: "INR 2 Cr – 3 Cr", value: "20000000-30000000" },
    { label: "Above INR 3 Cr", value: "30000000+" },
  ],
  "short-term": [
    { label: "All price", value: "" },
    { label: "Under INR 2,000 / night", value: "0-2000" },
    { label: "INR 2,000 – 3,000 / night", value: "2000-3000" },
    { label: "INR 3,000 – 4,000 / night", value: "3000-4000" },
    { label: "INR 4,000 – 5,000 / night", value: "4000-5000" },
    { label: "Above INR 5,000 / night", value: "5000+" },
  ],
};

export const MODE_PROPERTY_TYPES = {
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
    "Commercial Property",
  ],
  "short-term": [
    "Serviced Apartment",
    "Luxury Villa",
    "Studio",
  ],
};
