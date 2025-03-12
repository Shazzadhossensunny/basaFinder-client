"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createListing } from "@/services/ListingService";
import ImageUpload from "../common/ImageUpload";

// Form validation schema
const listingFormSchema = z.object({
  location: z.string().min(5, {
    message: "Location must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  rent: z.coerce.number().positive({
    message: "Rent must be a positive number.",
  }),
  bedrooms: z.coerce.number().int().positive({
    message: "Number of bedrooms must be a positive integer.",
  }),
  images: z.array(z.string()).min(1, {
    message: "At least one image is required.",
  }),
  amenities: z.array(z.string()).min(1, {
    message: "Please select at least one amenity.",
  }),
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

const CreateListing = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (values: z.infer<typeof listingFormSchema>) => {
    try {
      setIsSubmitting(true);

      // Call your API service to create the listing
      const response = await createListing(values);

      if (response.success) {
        toast.success("Listing created successfully!");
        // Redirect to the listing page or dashboard
        router.push(`/listings/${response.data._id}`);
      } else {
        toast.error(response.message || "Failed to create listing");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Rental Listing
          </CardTitle>
          <CardDescription>
            Fill out the form below to post your rental property listing.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Location Field */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Downtown, New York" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the full address or neighborhood of your property.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your property in detail..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include details about layout, surroundings, and special
                      features.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rent Field */}
              <FormField
                control={form.control}
                name="rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Rent ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g. 1500"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the monthly rent amount in dollars.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bedrooms Field */}
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Bedrooms</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of bedrooms" />
                        </SelectTrigger>
                      </FormControl>
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

              {/* Image Upload Field */}
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Images</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={(urls: any) => field.onChange(urls)}
                        maxFiles={5}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload up to 5 images of your property. First image will
                      be the main display image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amenities Field */}
              <FormField
                control={form.control}
                name="amenities"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Amenities</FormLabel>
                      <FormDescription>
                        Select all amenities that your property offers.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {amenitiesOptions.map((amenity) => (
                        <FormField
                          key={amenity.id}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={amenity.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      amenity.label
                                    )}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      return checked
                                        ? field.onChange([
                                            ...currentValues,
                                            amenity.label,
                                          ])
                                        : field.onChange(
                                            currentValues.filter(
                                              (value) => value !== amenity.label
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {amenity.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="flex justify-end pt-6 px-0">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Listing"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateListing;
