"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Home,
  MoreVertical,
  Search,
  Eye,
  Edit2,
  Trash2,
  Map,
  DollarSign,
  BedDouble,
  Bath,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteListing, getListingById } from "@/services/ListingService";

// Define TypeScript interfaces
interface Landlord {
  name: string;
  email: string;
  phoneNumber: string;
}

interface Listing {
  _id: string;
  title?: string;
  location: string;
  description: string;
  rent: number;
  landlordId?: Landlord;
  createdAt: string;
  updatedAt: string;
  isAvailable: boolean;
  bedrooms: number;
  bathrooms?: number;
  images?: string[];
  amenities?: string[];
}

interface ListingResponse {
  success: boolean;
  data: Listing[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
  message?: string;
}

interface DetailedListingResponse {
  success: boolean;
  data: Listing;
  message?: string;
}

interface AdminRentalManagementProps {
  listingData: ListingResponse;
}

export default function AdminRentalManagement({
  listingData,
}: AdminRentalManagementProps) {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [detailedListing, setDetailedListing] = useState<Listing | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    // Initialize with the server-provided data
    if (listingData?.success) {
      setListings(listingData.data);
      setFilteredListings(listingData.data);
      if (listingData.meta) {
        setTotalPages(
          listingData.meta.totalPage ||
            Math.ceil(listingData.meta.total / limit)
        );
      }
    }
  }, [listingData]);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/listings?page=${page}&limit=${limit}`);
      const data: ListingResponse = await response.json();

      if (data.success) {
        setListings(data.data);
        setFilteredListings(data.data);
        setTotalPages(
          data.meta.totalPage || Math.ceil(data.meta.total / limit)
        );
      } else {
        toast.error("Failed to fetch listings");
      }
    } catch (error) {
      toast.error("Error fetching listings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (page > 1 || !listingData?.success) {
      fetchListings();
    }
  }, [page]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = listings.filter(
        (listing) =>
          listing.location
            ?.toLowerCase()
            .includes(searchQuery?.toLowerCase()) ||
          listing.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          listing.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          false
      );
      setFilteredListings(filtered);
    } else {
      setFilteredListings(listings);
    }
  }, [searchQuery, listings]);

  const handleDeleteListing = async () => {
    if (!selectedListing) return;

    setDeleteDialogOpen(false);
    setIsLoading(true);

    try {
      const response = await deleteListing(selectedListing._id);
      if (response.success) {
        toast.success("Listing deleted successfully");
        fetchListings();
      } else {
        toast.error(response.message || "Failed to delete listing");
      }
    } catch (error) {
      toast.error("Error deleting listing");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewListing = async (listing: Listing) => {
    setSelectedListing(listing);
    setViewDialogOpen(true);
    setViewLoading(true);

    try {
      const response = await getListingById(listing._id);
      if (response.success) {
        setDetailedListing(response.data);
      } else {
        toast.error("Failed to fetch listing details");
      }
    } catch (error) {
      toast.error("Error fetching listing details");
      console.error(error);
    } finally {
      setViewLoading(false);
    }
  };

  // const handleAvailabilityToggle = async (listing: Listing) => {
  //   try {
  //     const response = await fetch(`/api/listings/${listing._id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         isAvailable: !listing.isAvailable,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (data.success) {
  //       toast.success(
  //         `Listing marked as ${
  //           !listing.isAvailable ? "available" : "unavailable"
  //         }`
  //       );
  //       fetchListings();
  //     } else {
  //       toast.error(data.message || "Failed to update listing status");
  //     }
  //   } catch (error) {
  //     toast.error("Error updating listing status");
  //     console.error(error);
  //   }
  // };

  const openDeleteDialog = (listing: Listing) => {
    setSelectedListing(listing);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getListingTitle = (listing: Listing) => {
    return (
      listing.title ||
      `${listing.bedrooms} BR Rental in ${listing.location.split(",")[0]}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Home className="mr-2 h-8 w-8" />
            Rental Management
          </h1>
          <p className="text-muted-foreground">
            View and manage all rental listings on the platform
          </p>
        </div>
        <div className="w-full sm:w-64 lg:w-96">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search listings..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rental Listings</CardTitle>
          <CardDescription>
            All properties currently listed for rent on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Landlord</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[120px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-[40px]" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredListings?.length > 0 ? (
                  filteredListings.map((listing) => (
                    <TableRow key={listing._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <BedDouble className="h-4 w-4 text-muted-foreground" />
                          <span>{listing.bedrooms} BR</span>
                          {getListingTitle(listing)}
                        </div>
                      </TableCell>
                      <TableCell>{listing.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {listing.rent.toLocaleString()}/mo
                        </div>
                      </TableCell>
                      <TableCell>{listing.landlordId?.name || "N/A"}</TableCell>
                      <TableCell>{formatDate(listing.createdAt)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            listing.isAvailable ? "default" : "secondary"
                          }
                          className="cursor-pointer"
                          // onClick={() => handleAvailabilityToggle(listing)}
                        >
                          {listing.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 cursor-pointer"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleViewListing(listing)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/admin/listings/edit/${listing._id}`
                                )
                              }
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                              onClick={() => handleAvailabilityToggle(listing)}
                            >
                              {listing.isAvailable ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Mark Unavailable
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark Available
                                </>
                              )}
                            </DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => openDeleteDialog(listing)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No listings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Listing Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Listing Details</DialogTitle>
            <DialogDescription>
              Detailed view of the selected property
            </DialogDescription>
          </DialogHeader>
          {viewLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[250px]" />
              </div>
            </div>
          ) : (
            detailedListing && (
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Basic Information</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="flex items-center">
                            <BedDouble className="h-4 w-4 mr-2 text-muted-foreground" />
                            {detailedListing.bedrooms} Bedrooms
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-2 text-muted-foreground" />
                            {detailedListing.bathrooms || 1} Bathrooms
                          </div>
                          <div className="flex items-center col-span-2">
                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                            {detailedListing.rent.toLocaleString()} per month
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Location</h4>
                        <div className="flex items-center mt-2">
                          <Map className="h-4 w-4 mr-2 text-muted-foreground" />
                          {detailedListing.location}
                        </div>
                        <div className="mt-4">
                          <h4 className="font-medium">Landlord Information</h4>
                          <div className="mt-2 text-sm">
                            <p>
                              Name: {detailedListing.landlordId?.name || "N/A"}
                            </p>
                            <p>
                              Email:{" "}
                              {detailedListing.landlordId?.email || "N/A"}
                            </p>
                            <p>
                              Phone:{" "}
                              {detailedListing.landlordId?.phoneNumber || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Description</h4>
                      <p className="text-muted-foreground mt-2">
                        {detailedListing.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <Badge
                          variant={
                            detailedListing.isAvailable
                              ? "default"
                              : "secondary"
                          }
                        >
                          {detailedListing.isAvailable
                            ? "Available"
                            : "Unavailable"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span>
                          Created: {formatDate(detailedListing.createdAt)}
                        </span>
                        <span className="ml-4">
                          Updated: {formatDate(detailedListing.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="amenities">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {detailedListing?.amenities?.length ? (
                      detailedListing.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 border rounded-md"
                        >
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          {amenity}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-4 text-muted-foreground">
                        No amenities listed
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="images">
                  {detailedListing?.images?.length ? (
                    <div className="grid grid-cols-2 gap-4">
                      {detailedListing.images.map((image, index) => (
                        <div key={index} className="relative aspect-video">
                          <Image
                            src={image}
                            alt={`Property image ${index + 1}`}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No images available
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )
          )}
          <DialogFooter>
            {detailedListing && (
              <Button
                variant="outline"
                className="mr-auto"
                onClick={() =>
                  router.push(
                    `/dashboard/admin/listings/edit/${detailedListing._id}`
                  )
                }
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Listing
              </Button>
            )}
            <Button
              className="cursor-pointer"
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={handleDeleteListing}
            >
              Delete Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
