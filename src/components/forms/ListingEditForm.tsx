"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { updateListing, getListingById } from "@/services/ListingService";
import { Loader2 } from "lucide-react";
import ImageUpload from "@/components/common/ImageUpload";

const listingFormSchema = z.object({
  location: z.string().min(5, "Location must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  rent: z.coerce.number().positive("Rent must be a positive number"),
  bedrooms: z.coerce
    .number()
    .int()
    .positive("Bedrooms must be a positive integer"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  amenities: z.array(z.string()).min(1, "Select at least one amenity"),
});

const amenitiesOptions = [
  { id: "wifi", label: "WiFi" },
  { id: "air-conditioning", label: "Air Conditioning" },
  { id: "parking", label: "Parking" },
  { id: "gym", label: "Gym" },
  { id: "pool", label: "Swimming Pool" },
  { id: "laundry", label: "Laundry" },
  { id: "security", label: "Security" },
  { id: "pets-allowed", label: "Pets Allowed" },
  { id: "furnished", label: "Furnished" },
];

export default function EditListingForm() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  const [isLoading, setIsLoading] = React.useState(true);

  const form = useForm<z.infer<typeof listingFormSchema>>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      location: "",
      description: "",
      rent: 0,
      bedrooms: 1,
      images: [],
      amenities: [],
    },
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await getListingById(listingId);
        if (response.success) {
          const listing = response.data;
          form.reset({
            location: listing.location,
            description: listing.description,
            rent: listing.rent,
            bedrooms: listing.bedrooms,
            images: listing.images,
            amenities: listing.amenities,
          });
        } else {
          toast.error("Listing not found");
          router.push("/listings");
        }
      } catch (error) {
        toast.error("Failed to load listing");
        router.push("/listings");
      } finally {
        setIsLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId, form, router]);

  const onSubmit = async (values: z.infer<typeof listingFormSchema>) => {
    try {
      const response = await updateListing(listingId, values);
      if (response.success) {
        toast.success("Listing updated successfully!");
        router.push(`/listings/${listingId}`);
      } else {
        toast.error(response.message || "Failed to update listing");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Rent */}
                <FormField
                  control={form.control}
                  name="rent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Rent ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bedrooms */}
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your property..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Images */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Property Images</FormLabel>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        maxFiles={5}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amenities */}
                <FormField
                  control={form.control}
                  name="amenities"
                  render={() => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Amenities</FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {amenitiesOptions.map((amenity) => (
                          <FormField
                            key={amenity.id}
                            control={form.control}
                            name="amenities"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(amenity.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            amenity.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== amenity.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="!mt-0">
                                  {amenity.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
