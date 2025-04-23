import Link from "next/link";
import Image from "next/image";
import { MapPin, Bed, Home } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

interface ListingCardProps {
  listing: {
    _id: string;
    images: string[];
    location: string;
    description: string;
    rent: number;
    bedrooms: number;
  };
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const { _id, images, location, description, rent, bedrooms } = listing;

  return (
    <Card className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden h-full flex flex-col transition-transform hover:scale-[1.02]">
      <div className="relative w-full h-48">
        <Image
          src={images[0] || "/placeholder-house.jpg"}
          alt={location}
          fill
          className="object-cover"
        />
      </div>

      <CardContent className="flex-grow p-4">
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin size={16} className="mr-1" />
          <p className="text-sm">{location}</p>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{location}</h3>

        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>

        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-primary">৳{rent}</p>

          <div className="flex items-center text-gray-500">
            <Bed size={16} className="mr-1" />
            <span className="text-sm">
              {bedrooms} {bedrooms > 1 ? "Beds" : "Bed"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/listings/${_id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
