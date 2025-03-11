// components/listings/ListingDetails.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Pencil,
  Trash2,
  BedDouble,
  MapPin,
  Tag,
  Check,
  Calendar,
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
  landlordId: Landlord;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ListingDetailsProps {
  listing: Listing;
}

const ListingDetails: React.FC<ListingDetailsProps> = ({ listing }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useUser();

  // Check if current user is the owner of this listing
  const isOwner = user?._id === listing.landlordId._id;
  // Check if user is a tenant (not owner and not admin)
  const isTenant = user && user.role === "tenant";

  const createdDate = listing?.createdAt
    ? format(new Date(listing.createdAt), "MMMM d, yyyy")
    : "N/A";

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this listing?")) {
      setIsDeleting(true);
      try {
        // Call delete API (Replace with actual API call)
        // const response = await deleteListingById(listing._id);
        console.log("Deleting listing...", listing._id);
        // Redirect to listings page after successful deletion
        // if (response.success) window.location.href = "/listings";
      } catch (error) {
        console.error("Error deleting listing:", error);
        setIsDeleting(false);
      }
    }
  };

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

      {/* Owner Actions */}
      {isOwner && (
        <div className="flex gap-2">
          <Link href={`/listings/${listing._id}/edit`} passHref>
            <Button variant="outline" className="flex items-center gap-1">
              <Pencil size={16} /> Edit Listing
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="flex items-center gap-1"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 size={16} /> {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      )}

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

      {/* Property Details */}
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
            <p>
              <span className="font-medium">Email:</span>{" "}
              {listing.landlordId.email}
            </p>
            {/* Only show phone number to approved tenants or after payment */}
            {isOwner && (
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {listing.landlordId.phoneNumber}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListingDetails;
