// app/listings/page.tsx
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllListings } from "@/services/ListingService";
import ListingFilters from "@/components/listings/ListingFiltersComponent";
import ListingGrid from "@/components/common/ListingCard";
import Pagination from "@/components/common/Pagination";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await searchParams;
  // const limit = (await searchParams?.limit?.toString()) || "12";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Rental Properties</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ListingFilters />
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          <Suspense fallback={<ListingsLoadingSkeleton />}>
            <ListingsContent page={page} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function ListingsContent({ page }: { page: string }) {
  const response = await getAllListings(page, "3");

  if (!response || !response.data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        Error loading listings. Please try again later.
      </div>
    );
  }

  const { data, meta } = response;

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-8 rounded-md text-center">
        <h3 className="text-xl font-medium mb-2">No listings found</h3>
        <p>Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-gray-600 mb-4">
        Showing {data.length} of {meta.total} listings
      </p>
      <ListingGrid listings={data} />

      {/* Pagination Component */}
      <Pagination totalPage={meta?.totalPage} />
    </>
  );
}

function ListingsLoadingSkeleton() {
  return (
    <div>
      <div className="mb-4">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-md overflow-hidden shadow-sm"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
