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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Eye, CreditCard, PhoneOutgoing } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  getTenantRequests,
  getRequestById,
  initiateRequestPayment,
} from "@/services/RequestService";
import { initiatePayment } from "@/services/PaymentService";

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

// Define types
interface IRequest {
  _id: string;
  listingId: {
    _id: string;
    bedrooms: number;
    images: string[];
    rent: number;
    location: string;
  };
  tenantId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  message: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  paymentStatus?: PaymentStatus;
}

const TenantRentalRequests = () => {
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<IRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await getTenantRequests();
        if (response.success) {
          setRequests(response.data || []);
        } else {
          toast.error(
            response.message || "Failed to fetch your rental requests"
          );
        }
      } catch (error) {
        toast.error("An error occurred while fetching requests");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  console.log(requests);

  // View request details
  const handleViewDetails = async (requestId: string) => {
    try {
      const response = await getRequestById(requestId);
      if (response.success) {
        setSelectedRequest(response.data);
        setDetailsOpen(true);
      } else {
        toast.error(response.message || "Failed to fetch request details");
      }
    } catch (error) {
      toast.error("An error occurred while fetching request details");
    }
  };

  // Process payment
  const handlePayment = async () => {
    if (!selectedRequest) return;

    try {
      setProcessingPayment(true);
      //   const response = await initiatePayment(selectedRequest._id);

      const response = await initiateRequestPayment(selectedRequest._id);
      if (response.data.paymentUrl) {
        toast.success("Payment initiated successfully");
        toast.info("You would now be redirected to the payment gateway");

        setTimeout(() => {
          const newTab = window.open(response.data.paymentUrl, "_blank");

          if (!newTab) {
            // Fallback if the browser blocks new tabs
            window.location.href = response.data.paymentUrl;
          }

          return;
        }, 1000);

        // Update local state to reflect payment is in progress
        setRequests(
          requests.map((req) =>
            req._id === selectedRequest._id
              ? { ...req, paymentInitiated: true }
              : req
          )
        );

        setPaymentDialogOpen(false);
      } else {
        toast.error(response.message || "Failed to initiate payment");
      }
    } catch (error) {
      toast.error("An error occurred while processing payment");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Render badge based on status
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        );
      case "paid":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Paid
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Rental Requests</CardTitle>
        <CardDescription>
          View and manage your rental requests and payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center p-6 text-gray-500">
            You haven't submitted any rental requests yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell className="font-medium">
                      {request.listingId?.images[0] || "Unknown Property"}
                    </TableCell>
                    <TableCell>{renderStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {format(new Date(request.createdAt), "PPP")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewDetails(request._id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {request.status === "approved" &&
                          request.paymentStatus && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-purple-600"
                              onClick={() => {
                                setSelectedRequest(request);
                                setPaymentDialogOpen(true);
                              }}
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}

                        {request.status === "approved" &&
                          request.landlordPhoneNumber && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-blue-600"
                              as="a"
                              href={`tel:${request.landlordPhoneNumber}`}
                            >
                              <PhoneOutgoing className="h-4 w-4" />
                            </Button>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Request Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Property</h3>
                <p>{selectedRequest.listingId?.images[0]}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.listingId?.location} - $
                  {selectedRequest.listingId?.rent}/month
                </p>
              </div>

              <div>
                <h3 className="font-medium">Landlord</h3>
                <p>{selectedRequest.landlordId?.name}</p>
                {selectedRequest.status === "approved" &&
                  selectedRequest.landlord?.phone && (
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-muted-foreground mr-2">
                        Contact: {selectedRequest.landlord.phone}
                      </p>
                      <a
                        href={`tel:${requests.landlord.phone}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-blue-600 hover:bg-accent hover:text-accent-foreground"
                      >
                        <PhoneOutgoing className="h-4 w-4" />
                      </a>
                    </div>
                  )}
              </div>

              <div>
                <h3 className="font-medium">Your Request</h3>
                <p className="text-sm whitespace-pre-line">
                  {selectedRequest.message}
                </p>
              </div>

              <div>
                <h3 className="font-medium">Status</h3>
                <div className="mt-1">
                  {renderStatusBadge(selectedRequest.status)}
                </div>
                {selectedRequest.status === "approved" && (
                  <p className="text-sm mt-2 text-green-600">
                    Your request has been approved!{" "}
                    {selectedRequest.paymentInitiated
                      ? "You can now proceed with payment."
                      : "Waiting for the landlord to initiate payment request."}
                  </p>
                )}
                {selectedRequest.status === "rejected" && (
                  <p className="text-sm mt-2 text-red-600">
                    Unfortunately, your request has been rejected.
                  </p>
                )}
              </div>

              {selectedRequest.status === "approved" &&
                selectedRequest.paymentInitiated && (
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setDetailsOpen(false);
                        setPaymentDialogOpen(true);
                      }}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Rent
                    </Button>
                  </div>
                )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Rental Payment</DialogTitle>
            <DialogDescription>
              Pay your rental fee to finalize the agreement
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Property</h3>
                <p>{selectedRequest.listing?.title}</p>
              </div>

              <div>
                <h3 className="font-medium">Landlord</h3>
                <p>{selectedRequest.landlord?.name}</p>
              </div>

              <div>
                <h3 className="font-medium">Payment Amount</h3>
                <p className="text-lg font-bold">
                  ${selectedRequest.listing?.price}
                </p>
                <p className="text-xs text-muted-foreground">
                  First month's rent
                </p>
              </div>

              {/* Payment method selection would go here in a real app */}
              <div className="p-4 bg-gray-50 rounded-md text-center">
                <p>Payment gateway integration would appear here</p>
                <p className="text-xs text-muted-foreground">
                  In a production app, you would be redirected to a secure
                  payment form
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handlePayment}
              disabled={processingPayment}
            >
              {processingPayment && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TenantRentalRequests;
