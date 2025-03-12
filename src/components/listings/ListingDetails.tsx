"use client";

import React from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BedDouble,
  MapPin,
  Tag,
  Check,
  Calendar,
  Wifi,
  Wind,
  Car,
  Dumbbell,
  WavesLadder,
} from "lucide-react";
import { format } from "date-fns";
import ImageGallery from "./ImageGallery";

import { useUser } from "@/context/UserContext";
import RentalRequestModal from "../forms/RentalRequestForm";

interface Landlord {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface Listing {
  _id: string;
  location: string;
  description: string;
  rent: number;
  bedrooms: number;
  images: string[];
  amenities: string[];
  landlordId: Landlord;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ListingDetailsProps {
  listing: Listing;
}

// Helper function to get icon for amenity
const getAmenityIcon = (amenity: string) => {
  const amenityLower = amenity.toLowerCase();

  if (amenityLower.includes("wifi")) return <Wifi size={20} />;
  if (amenityLower.includes("air") || amenityLower.includes("conditioning"))
    return <Wind size={20} />;
  if (amenityLower.includes("parking")) return <Car size={20} />;
  if (amenityLower.includes("gym")) return <Dumbbell size={20} />;
  if (amenityLower.includes("pool") || amenityLower.includes("swimming"))
    return <WavesLadder size={20} />;
  return <Check size={20} />;
};

const ListingDetails: React.FC<ListingDetailsProps> = ({ listing }) => {
  const { user } = useUser();

  // Check user roles and permissions
  const isLandlord = user?.role === "landlord";
  const isOwner = isLandlord && user?.userId === listing.landlordId._id;
  const isTenant = user?.role === "tenant";

  // Check for approved rental request status
  // This will need to be implemented based on your API/backend
  const hasRequestApproved = false; // Default to false until you implement this

  const createdDate = listing?.createdAt
    ? format(new Date(listing.createdAt), "MMMM d, yyyy")
    : "N/A";

  // Determine if contact details should be shown
  const showContactDetails = isOwner || (isTenant && hasRequestApproved);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{listing.location}</h1>
          <div className="flex items-center text-gray-600 mb-1">
            <MapPin size={16} className="mr-1" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={listing.isAvailable ? "default" : "destructive"}>
              {listing.isAvailable ? "Available" : "Not Available"}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <BedDouble size={14} className="mr-1" />
              {listing.bedrooms}{" "}
              {listing.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
            </Badge>
          </div>
        </div>

        <p className="text-3xl font-bold text-primary">
          ${listing.rent?.toLocaleString()}
          <span className="text-base font-normal text-gray-500">/month</span>
        </p>
      </div>

      {/* Image Gallery */}
      <ImageGallery images={listing.images} />

      {/* Tenant Actions */}
      {isTenant && listing.isAvailable && (
        <RentalRequestModal listingId={listing._id} />
      )}

      {/* Guest/Not Logged In Message */}
      {!user && listing.isAvailable && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md">
          <p>
            Please{" "}
            <Link href="/login" className="underline font-medium">
              log in
            </Link>{" "}
            to request this rental property.
          </p>
        </div>
      )}

      <Separator />

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {listing.description}
        </p>
      </div>

      <Separator />

      {/* Amenities Section */}
      {listing.amenities?.length > 0 && (
        <>
          <div>
            <h2 className="text-xl font-semibold mb-3">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {listing.amenities.map((amenity, index) => (
                <Card key={index}>
                  <CardContent className="flex items-center p-4 gap-3">
                    {getAmenityIcon(amenity)}
                    <span className="font-medium">{amenity}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Property Details */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Property Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="flex items-center p-4 gap-3">
              <BedDouble size={24} className="text-blue-700" />
              <div>
                <p className="text-sm text-gray-500">Bedrooms</p>
                <p className="font-medium">{listing.bedrooms}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4 gap-3">
              <Tag size={24} className="text-green-700" />
              <div>
                <p className="text-sm text-gray-500">Rent</p>
                <p className="font-medium">
                  ${listing.rent?.toLocaleString()}/month
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4 gap-3">
              <Check size={24} className="text-purple-700" />
              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <p className="font-medium">
                  {listing.isAvailable ? "Available Now" : "Not Available"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4 gap-3">
              <Calendar size={24} className="text-amber-700" />
              <div>
                <p className="text-sm text-gray-500">Listed On</p>
                <p className="font-medium">{createdDate}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
        <Card>
          <CardContent className="p-4">
            <p>
              <span className="font-medium">Landlord:</span>{" "}
              {listing.landlordId.name}
            </p>

            {/* Show email and phone to landlord or tenant with approved request */}
            {showContactDetails && (
              <>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {listing.landlordId.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {listing.landlordId.phoneNumber}
                </p>
              </>
            )}

            {/* Message for tenant who hasn't yet been approved */}
            {isTenant && !hasRequestApproved && (
              <p className="text-sm text-gray-500 mt-2">
                * Contact details will be visible after your rental request is
                approved and payment is completed.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListingDetails;
