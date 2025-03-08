"use client";
import { useState } from "react";
import Image from "next/image";
import { MapPin, Bed, Bath, Home, Calendar, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

interface ListingDetailsProps {
  listing: {
    _id: string;
    images: string[];
    location: string;
    description: string;
    rentAmount: number;
    bedrooms: number;
    createdAt: string;
    landlord: {
      name: string;
    };
  };
}

const ListingDetails = ({ listing }: ListingDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState(listing.images[0]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div>
          <div className="relative w-full h-80 rounded-lg overflow-hidden mb-4">
            <Image
              src={selectedImage || "/placeholder-house.jpg"}
              alt={listing.location}
              fill
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {listing.images.slice(0, 4).map((image, index) => (
              <button
                key={index}
                className={`relative h-20 rounded overflow-hidden border-2 ${
                  selectedImage === image
                    ? "border-primary"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="mt-2 w-full">
                View All Photos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full">
              {/* <ImageGallery  images={listing.images} /> */}
            </DialogContent>
          </Dialog>
        </div>

        <div>
          <div className="flex items-center text-gray-500 mb-2">
            <MapPin size={16} className="mr-1" />
            <p className="text-sm">{listing.location}</p>
          </div>

          <h1 className="text-2xl font-bold mb-4">{listing.location}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <DollarSign size={20} className="text-primary mr-2" />
              <div>
                <p className="text-lg font-bold">
                  ৳{listing.rentAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Per Month</p>
              </div>
            </div>

            <div className="flex items-center">
              <Bed size={20} className="text-primary mr-2" />
              <div>
                <p className="text-lg font-bold">{listing.bedrooms}</p>
                <p className="text-xs text-gray-500">Bedrooms</p>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar size={20} className="text-primary mr-2" />
              <div>
                <p className="text-sm">
                  {new Date(listing.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">Posted Date</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{listing.description}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Listed by</p>
            <p className="font-medium">{listing.landlord.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
