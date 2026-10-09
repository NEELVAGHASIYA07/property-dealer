import PropertyListing from "@/app/components/PropertyListing";

export const metadata = {
  title: "Rent Properties in Gujarat | Verified Rental Homes & Flats",
  description: "Find rental apartments, homes, and studios across Surat, Ahmedabad, Vadodara, and Gujarat with interactive map pins and verified dealer profiles.",
};

export default function RentPage() {
  return <PropertyListing mode="rent" />;
}
