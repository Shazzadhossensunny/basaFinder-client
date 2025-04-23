"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ListingFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [maxPrice, setMaxPrice] = useState<number>(
    parseInt(searchParams.get("maxPrice") || "5000")
  );
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");

  // Sync state when URL params change (for back/forward navigation)
  useEffect(() => {
    setLocation(searchParams.get("location") || "");
    setMaxPrice(parseInt(searchParams.get("maxPrice") || "5000"));
    setBedrooms(searchParams.get("bedrooms") || "");
  }, [searchParams]);

  const applyFilters = () => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove location parameter
    if (location) {
      params.set("location", location);
    } else {
      params.delete("location");
    }

    // Update price parameter - rename to maxPrice to match backend
    params.set("maxPrice", maxPrice.toString());

    // Update or remove bedrooms parameter
    if (bedrooms && bedrooms !== "Any") {
      params.set("bedrooms", bedrooms);
    } else {
      params.delete("bedrooms");
    }

    // Preserve page parameter if it exists, otherwise reset to page 1
    if (!params.has("page")) {
      params.set("page", "1");
    }

    // Navigate with updated parameters
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    setLocation("");
    setMaxPrice(5000);
    setBedrooms("");
    router.push(pathname);
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Filter Listings</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, neighborhood, or address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="price"
          className="w-full"
        >
          <AccordionItem value="price">
            <AccordionTrigger className="text-base font-medium">
              Price Range
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">$0</span>
                  <span className="text-sm font-medium">
                    ${maxPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">$10,000+</span>
                </div>
                <Slider
                  value={[maxPrice]}
                  min={0}
                  max={10000}
                  step={100}
                  onValueChange={(value) => setMaxPrice(value[0])}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bedrooms">
            <AccordionTrigger className="text-base font-medium">
              Bedrooms
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="1">1+ Bedroom</SelectItem>
                    <SelectItem value="2">2+ Bedrooms</SelectItem>
                    <SelectItem value="3">3+ Bedrooms</SelectItem>
                    <SelectItem value="4+">4+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={applyFilters}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={resetFilters}
            className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingFilters;
