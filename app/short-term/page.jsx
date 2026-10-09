import PropertyListing from "@/app/components/PropertyListing";

export const metadata = {
  title: "Short-term Stays in Gujarat | Luxury Holiday Homes & Penthouses",
  description: "Book verified short-term stays, vacation villas, and corporate suites in Gujarat with exact interactive map location and dealer contact.",
};

export default function ShortTermPage() {
  return <PropertyListing mode="short-term" />;
}
