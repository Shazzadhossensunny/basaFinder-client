// components/home/FeaturedListings.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ListingCard from "@/components/home/ListingCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedListings = ({ featuresListingsData }: any) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchListings = async () => {
  //     try {
  //       const response = await getAllListings("1", "6");

  //       if (response.success) {
  //         setListings(response.data);
  //       } else {
  //         toast.error("Failed to fetch listings");
  //       }
  //     } catch (err: any) {
  //       toast.error(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchListings();
  // }, []);

  useEffect(() => {
    if (featuresListingsData.length > 0) {
      setListings(featuresListingsData);
      setLoading(false);
      return;
    }
  }, [featuresListingsData]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Listings
            </h2>
            <p className="text-gray-600 mt-2">
              Explore our handpicked selection of premium rental properties
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings?.map((listing: any) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/listings">
            <Button
              size="lg"
              className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
            >
              View All Properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg overflow-hidden shadow"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
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

        <div className="text-center mt-10">
          <Skeleton className="h-12 w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default FeaturedListings;
