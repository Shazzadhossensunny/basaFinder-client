"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Listing {
  _id: string;
  location: string;
  description: string;
  rent: number;
  bedrooms: number;
  images: string[];
  isAvailable: boolean;
  landlordId: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}

interface ListingGridProps {
  listings: Listing[];
}

const ListingGrid: React.FC<ListingGridProps> = ({ listings }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Link key={listing._id} href={`/listings/${listing._id}`}>
          <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="relative h-48 w-full">
              <Image
                src={listing.images[0] || "/placeholder-property.jpg"}
                alt={listing.location}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-property.jpg";
                }}
              />
              {!listing.isAvailable && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs m-2 rounded">
                  Not Available
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium line-clamp-1 mb-1">
                {listing.location}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {listing.description}
              </p>
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {listing.bedrooms}{" "}
                  {listing.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                </Badge>
                <p className="font-semibold text-lg">
                  ${listing.rent.toLocaleString()}/mo
                </p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                By {listing.landlordId.name}
              </span>
              <Badge variant="outline" className="hover:bg-transparent">
                View Details
              </Badge>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ListingGrid;
