"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IListing } from "@/types/listing.type";

interface ListingGridProps {
  listings: IListing[];
}

const ListingGrid: React.FC<ListingGridProps> = ({ listings }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing, index) => (
        <ListingCard
          key={listing._id}
          listing={listing}
          priority={index < 3} // Prioritize first 3 images
        />
      ))}
    </div>
  );
};

interface ListingCardProps {
  listing: IListing;
  priority?: boolean;
}

const ListingCard = ({ listing, priority = false }: ListingCardProps) => {
  const [imgSrc, setImgSrc] = useState(
    listing.images[0]?.startsWith("https://")
      ? listing.images[0]
      : "https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png" // Local placeholder fallback
  );
  console.log(imgSrc);
  return (
    <Card className="relative h-full overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <Link
        href={`/listings/${listing._id}`}
        passHref
        legacyBehavior
        prefetch={false}
      >
        <a className="block h-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
          {/* Image Container */}
          <div className="relative h-48 w-full bg-gray-50">
            <Image
              src={imgSrc}
              alt={`Rental property in ${
                listing.location
              } - ${listing.description.substring(0, 50)}`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
              onError={() =>
                setImgSrc(
                  "https://psediting.websites.co.in/obaju-turquoise/img/product-placeholder.png"
                )
              }
              priority={priority}
              aria-hidden={!listing.isAvailable}
            />

            {/* Availability Badge */}
            {!listing.isAvailable && (
              <span
                role="status"
                aria-label="Property not available"
                className="absolute right-0 top-0 m-2 rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm"
              >
                Not Available
              </span>
            )}
          </div>

          {/* Card Content */}
          <CardContent className="p-5">
            <h3 className="mb-1 line-clamp-1 text-lg font-medium text-gray-900">
              {listing.location}
            </h3>

            <p className="mb-3 line-clamp-2 text-sm text-gray-600">
              {listing.description}
            </p>

            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                aria-label={`${listing.bedrooms} bedrooms`}
              >
                {listing.bedrooms} Bedroom{listing.bedrooms !== 1 && "s"}
              </Badge>

              <p className="text-lg font-semibold text-gray-900">
                ${listing.rent.toLocaleString()}
                <span className="text-sm font-normal text-gray-500">/mo</span>
              </p>
            </div>
          </CardContent>

          {/* Card Footer */}
          <CardFooter className="flex items-center justify-between border-t border-gray-100 px-5 pb-5 pt-2">
            <div className="flex items-center space-x-2">
              <span
                className="text-sm text-gray-500"
                aria-label="Landlord information"
              >
                By{" "}
                <span className="font-medium text-gray-700">
                  {typeof listing.landlordId === "object" &&
                  listing.landlordId.name
                    ? listing.landlordId.name
                    : "Owner"}
                </span>
              </span>
            </div>

            <Badge
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              aria-hidden="true"
            >
              View Details
            </Badge>
          </CardFooter>
        </a>
      </Link>
    </Card>
  );
};

export default ListingGrid;
