import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, DollarSign } from "lucide-react";
import { Listing } from "@/store/listingSlice";
import Image from "next/image";

interface ListingCardProps {
  listing: Listing;
  compact?: boolean;
}

const ListingCard = ({ listing, compact = false }: ListingCardProps) => {
  // Select the first image or use a placeholder
  const imageUrl = listing.images?.[0] || "/placeholder-house.jpg";

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-shadow hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={imageUrl}
          alt={listing.location}
          width={400}
          height={225}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>

      <CardContent className="flex-grow p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-1 mb-1">
            {listing.location}
          </h3>
          <div className="text-primary font-bold">
            ${listing.rentAmount.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center text-muted-foreground text-sm mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{listing.location}</span>
        </div>

        <div className="flex items-center gap-4 my-2">
          <div className="flex items-center text-muted-foreground">
            <Bed className="h-4 w-4 mr-1" />
            <span>
              {listing.bedrooms}{" "}
              {listing.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>Rent: ${listing.rentAmount}/month</span>
          </div>
        </div>

        {!compact && (
          <p className="text-muted-foreground text-sm line-clamp-2 mt-2">
            {listing.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/listings/${listing._id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
