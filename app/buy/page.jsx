import PropertyListing from "@/app/components/PropertyListing";

export const metadata = {
  title: "Buy Properties in Gujarat | Houses, Villas & Luxury Apartments",
  description: "Browse verified residential properties for sale across Surat, Ahmedabad, Vadodara, Rajkot, and Gandhinagar with interactive map pins and direct dealer contact.",
};

export default function BuyPage() {
  return <PropertyListing mode="buy" />;
}
