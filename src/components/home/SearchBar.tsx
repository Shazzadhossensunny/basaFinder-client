"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  Home,
  Loader2,
  MapPin,
  Bed,
  DollarSign,
} from "lucide-react";
import Image from "next/image";

import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

// Define the listing type based on your API response
interface Listing {
  _id: string;
  title?: string;
  description?: string;
  location: string;
  rent: number;
  bedrooms: number;
  bathrooms?: number;
  squareFeet?: number;
  images?: string[];
  amenities?: string[];
  isAvailable?: boolean;
  landlordId?: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  createdAt: string;
  updatedAt?: string;
}

const InlineSearchResults = ({
  initialListings = [],
}: {
  initialListings?: Listing[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize states from URL params
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [price, setPrice] = useState(
    Number(searchParams.get("price")) || 20000
  );
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [noResults, setNoResults] = useState(initialListings.length === 0);
  const [totalListings, setTotalListings] = useState(initialListings.length);

  // Check if search is active from URL params
  // Update the useEffect that processes initialListings
  useEffect(() => {
    if (initialListings && initialListings.length > 0) {
      // Apply client-side filtering based on current search parameters
      let filteredListings = [...initialListings];

      // Filter by location if provided
      if (location) {
        filteredListings = filteredListings.filter((listing) =>
          listing.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      // Filter by price if provided
      if (price) {
        filteredListings = filteredListings.filter(
          (listing) => listing.rent <= price
        );
      }

      // Filter by bedrooms if provided and not "Any"
      if (bedrooms && bedrooms !== "Any") {
        filteredListings = filteredListings.filter(
          (listing) => listing.bedrooms.toString() === bedrooms
        );
      }

      // Apply sorting
      if (sortBy === "price-asc") {
        filteredListings.sort((a, b) => a.rent - b.rent);
      } else if (sortBy === "price-desc") {
        filteredListings.sort((a, b) => b.rent - a.rent);
      } else {
        // Sort by newest (createdAt)
        filteredListings.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      setListings(filteredListings);
      setTotalListings(filteredListings.length);
      setNoResults(filteredListings.length === 0);
    }
  }, [initialListings, location, price, bedrooms, sortBy]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsLoading(true);
    setShowResults(true);
    setNoResults(false);

    // Build query parameters
    const params = new URLSearchParams();

    if (location) params.set("location", location);
    if (price) params.set("price", price.toString());
    if (bedrooms && bedrooms !== "Any") params.set("bedrooms", bedrooms);

    // Add sorting parameters to URL
    if (sortBy === "price-asc") {
      params.set("sortBy", "rent");
      params.set("sortOrder", "asc");
    } else if (sortBy === "price-desc") {
      params.set("sortBy", "rent");
      params.set("sortOrder", "desc");
    } else {
      params.set("sortBy", "createdAt");
      params.set("sortOrder", "desc");
    }

    // Update URL with search parameters
    router.push(`/?${params.toString()}`, { scroll: false });

    // Don't need to fetch data here as the page will re-render with new props
    setIsLoading(false);
  };

  // Apply search filters directly to provided listings (client-side filtering)
  useEffect(() => {
    if (initialListings && initialListings.length > 0) {
      setListings(initialListings);
      setTotalListings(initialListings.length);
      setNoResults(initialListings.length === 0);
    }
  }, [initialListings]);

  const clearSearch = () => {
    setLocation("");
    setPrice(20000);
    setBedrooms("");
    setShowResults(false);
    setListings([]);
    setNoResults(false);

    // Clear URL parameters
    router.push("/", { scroll: false });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    if (showResults) {
      // Re-trigger search with new sort value
      setTimeout(() => handleSearch(), 0);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Search Box */}
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Find Your Dream Home
          </h2>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 flex items-center"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Location
                </label>
                <Input
                  id="location"
                  placeholder="City, area or neighborhood"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Maximum Price: ৳{price.toLocaleString()}
                </label>
                <Slider
                  defaultValue={[price]}
                  value={[price]}
                  max={100000}
                  step={1000}
                  onValueChange={(value) => setPrice(value[0])}
                  className="py-2"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  Bedrooms
                </label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger className="shadow-sm">
                    <SelectValue placeholder="Select bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Search className="mr-2 h-4 w-4" />
                Search Properties
              </Button>

              {showResults && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearSearch}
                  className="px-3 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="border-t border-gray-200">
            {isLoading ? (
              <div className="p-8">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">
                    Searching for your perfect home...
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-1/3" />
                          <Skeleton className="h-6 w-1/3" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : noResults ? (
              <div className="p-8 text-center">
                <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Home className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No properties found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search criteria or explore our other
                  listings.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    clearSearch();
                    handleSearch();
                  }}
                >
                  View all properties
                </Button>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    {totalListings}{" "}
                    {totalListings === 1 ? "property" : "properties"} found
                  </h3>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="price-asc">
                        Price (low to high)
                      </SelectItem>
                      <SelectItem value="price-desc">
                        Price (high to low)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings?.map((listing) => (
                    <Card
                      key={listing._id}
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/listings/${listing._id}`)
                      }
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={listing.images?.[0] || "/placeholder.jpg"}
                          alt={listing.description || listing.location}
                          width={400}
                          height={320}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                        {listing.isAvailable ? (
                          <Badge className="absolute top-2 right-2 bg-green-500">
                            Available
                          </Badge>
                        ) : (
                          <Badge className="absolute top-2 right-2 bg-red-500">
                            Rented
                          </Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 line-clamp-1">
                          {listing.description || "No Description"}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {listing.location}
                        </p>
                        <div className="flex justify-between text-sm text-gray-700 font-medium">
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />৳
                            {listing.rent.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Bed className="h-3 w-3 mr-1" />
                            {listing.bedrooms} Bed
                            {listing.bedrooms > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InlineSearchResults;
