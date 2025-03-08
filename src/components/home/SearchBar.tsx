// components/home/SearchBar.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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

const SearchBar = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(20000);
  const [bedrooms, setBedrooms] = useState("");

  const handleSearch = (e: any) => {
    e.preventDefault();

    // Create query params
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (price) params.append("price", price.toString());
    if (bedrooms) params.append("bedrooms", bedrooms);

    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 -mt-8 relative z-10 mb-12">
      <h2 className="text-xl font-semibold mb-4">Find Your Perfect Home</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <Input
              id="location"
              type="text"
              placeholder="City, area, or neighborhood"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Maximum Price: ৳{price.toLocaleString()}
            </label>
            <Slider
              id="price"
              min={5000}
              max={100000}
              step={1000}
              value={[price]}
              onValueChange={(value) => setPrice(value[0])}
            />
          </div>

          <div>
            <label
              htmlFor="bedrooms"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bedrooms
            </label>
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button type="submit" className="w-full md:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Search Properties
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
