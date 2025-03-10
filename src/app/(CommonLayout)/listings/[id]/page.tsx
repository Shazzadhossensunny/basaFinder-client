import ListingDetails from "@/components/listings/ListingDetails";
import { getListingById } from "@/services/ListingService";

const ListingPage = async ({ params }: any) => {
  const { id } = params;
  const listing = await getListingById(id);

  return (
    <div>
      {listing ? (
        <ListingDetails listing={listing} isOwner={true} />
      ) : (
        <p>Listing not found.</p>
      )}
    </div>
  );
};

export default ListingPage;
