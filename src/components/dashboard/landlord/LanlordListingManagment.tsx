"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Eye, Home } from "lucide-react";
import { toast } from "sonner";
import { getLandlordListings, deleteListing } from "@/services/ListingService";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { IListing } from "@/types/listing.type";
import TablePagination from "@/components/common/Pagination";

export default function LandlordListings() {
  const { user, isLoading, setIsLoading, setUser } = useUser();
  const [listings, setListings] = useState<IListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<IListing | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      if (!user || user.role !== "landlord") return;

      try {
        setListingsLoading(true);
        const response = await getLandlordListings();

        if (response.success) {
          setListings(response.data || []);
        } else {
          toast.error(response.message || "Failed to fetch listings");
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        toast.error("Something went wrong while fetching listings");
      } finally {
        setListingsLoading(false);
      }
    };

    if (user) {
      fetchListings();
    }
  }, [user]);

  const handleCreateListing = () => {
    router.push("/listings/create");
  };

  const handleEditListing = (listingId: string) => {
    router.push(`/dashboard/landlord/listings/edit/${listingId}`);
  };

  const handleViewListing = (listingId: string) => {
    router.push(`/listings/${listingId}`);
  };

  const handleDeleteClick = (listing: IListing) => {
    setSelectedListing(listing);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedListing) return;

    try {
      setDeletingId(selectedListing._id);
      const response = await deleteListing(selectedListing._id);

      if (response.success) {
        setListings((prev) =>
          prev.filter((item) => item._id !== selectedListing._id)
        );
        toast.success("Listing deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete listing");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Something went wrong while deleting the listing");
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setSelectedListing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">My Listings</h2>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            onClick={handleCreateListing}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Listing
          </Button>
        </div>

        {listingsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        ) : listings.length === 0 ? (
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-xl font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground mb-6">
                Create your first property listing to get started
              </p>
              <Button onClick={handleCreateListing}>
                <Plus className="mr-2 h-4 w-4" /> Add New Listing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Property Listings</CardTitle>
                <CardDescription>
                  Manage all your property listings from here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings.map((listing) => (
                        <TableRow key={listing._id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="h-12 w-12 rounded-md overflow-hidden relative bg-muted">
                                {listing.images && listing.images.length > 0 ? (
                                  <Image
                                    src={listing.images[0]}
                                    alt={listing.description}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <Home className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  {listing.bedrooms}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${listing.rent}/month
                          </TableCell>
                          <TableCell>{listing.location}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                listing.isAvailable
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                              }`}
                            >
                              {listing.isAvailable ? "Available" : "Rented"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => handleViewListing(listing._id)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => handleEditListing(listing._id)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-600 cursor-pointer"
                                onClick={() => handleDeleteClick(listing)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <TablePagination totalPage={1} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      {/* delete model */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the listing "
              {selectedListing?.description}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="cursor-pointer"
              disabled={!!deletingId}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="cursor-pointer"
              disabled={!!deletingId}
            >
              {deletingId === selectedListing?._id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Listing"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
