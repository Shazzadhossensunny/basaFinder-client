// app/listings/[id]/page.tsx
import { Suspense } from "react";
import { getListingById } from "@/services/ListingService";
import ListingDetails from "@/components/listings/ListingDetails";
import { Skeleton } from "@/components/ui/skeleton";

const ListingDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<ListingDetailsSkeleton />}>
        <ListingContent id={id} />
      </Suspense>
    </div>
  );
};

async function ListingContent({ id }: { id: string }) {
  const response = await getListingById(id);

  if (!response || !response.success) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Property Not Found
        </h2>
        <p className="text-gray-600">
          The listing you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return <ListingDetails listing={response.data} />;
}

function ListingDetailsSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-40 mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 mt-2 md:mt-0" />
      </div>

      {/* Image Gallery Skeleton */}
      <Skeleton className="h-80 w-full rounded-md" />

      {/* Description Skeleton */}
      <div>
        <Skeleton className="h-6 w-32 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Property Details Skeleton */}
      <div>
        <Skeleton className="h-6 w-40 mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* Contact Information Skeleton */}
      <div>
        <Skeleton className="h-6 w-40 mb-3" />
        <Skeleton className="h-32 w-full rounded-md" />
      </div>
    </div>
  );
}

export default ListingDetailsPage;
