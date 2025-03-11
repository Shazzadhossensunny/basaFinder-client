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
      <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-md text-center">
        <h3 className="text-xl font-medium mb-2">Property Not Found</h3>
        <p>The listing you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return <ListingDetails listing={response.data} />;
}

function ListingDetailsSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48 mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-32 mt-4 md:mt-0" />
      </div>

      {/* Image Gallery Skeleton */}
      <Skeleton className="h-72 w-full rounded-md" />

      {/* Description Skeleton */}
      <div>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Property Details Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-md" />
        ))}
      </div>

      {/* Contact Information Skeleton */}
      <div>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-32 w-full rounded-md" />
      </div>
    </div>
  );
}

export default ListingDetailsPage;
