import AdminRentalManagement from "@/components/dashboard/admin/AdminRentalManagement";
import { getAllListings } from "@/services/ListingService";
export default async function AdminRentalManagementPage() {
  const listingData = await getAllListings();
  return (
    <div className="container mx-auto py-6">
      <AdminRentalManagement listingData={listingData} />
    </div>
  );
}
