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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  getLandlordRequests,
  getRequestById,
  updateRequestStatus,
  initiateRequestPayment,
} from "@/services/RequestService";
import Image from "next/image";

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

const LandlordRentalRequests = () => {
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<IRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await getLandlordRequests();
        if (response.success) {
          setRequests(response.data || []);
        } else {
          toast.error(response.message || "Failed to fetch rental requests");
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

  // Approve request
  const handleApprove = async () => {
    if (!selectedRequest) return;

    try {
      const response = await updateRequestStatus(
        selectedRequest._id,
        "approved",
        phoneNumber
      );

      if (response.success) {
        setRequests(
          requests.map((req) =>
            req._id === selectedRequest._id
              ? { ...req, status: "approved" }
              : req
          )
        );
        toast.success("Request approved successfully");
        setApproveDialogOpen(false);
      } else {
        toast.error(response.message || "Failed to approve request");
      }
    } catch (error) {
      toast.error("An error occurred while approving the request");
    }
  };

  // Reject request
  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      const response = await updateRequestStatus(
        selectedRequest._id,
        "rejected"
      );

      if (response.success) {
        setRequests(
          requests.map((req) =>
            req._id === selectedRequest._id
              ? { ...req, status: "rejected" }
              : req
          )
        );
        toast.success("Request rejected successfully");
        setRejectDialogOpen(false);
      } else {
        toast.error(response.message || "Failed to reject request");
      }
    } catch (error) {
      toast.error("An error occurred while rejecting the request");
    }
  };

  // Initiate payment
  const handleInitiatePayment = async () => {
    if (!selectedRequest) return;

    try {
      const response = await initiateRequestPayment(selectedRequest._id);

      if (response.success) {
        setRequests(
          requests.map((req) =>
            req._id === selectedRequest._id
              ? { ...req, paymentInitiated: true }
              : req
          )
        );
        toast.success("Payment request initiated successfully");
        setPaymentDialogOpen(false);
      } else {
        toast.error(response.message || "Failed to initiate payment request");
      }
    } catch (error) {
      toast.error("An error occurred while initiating payment request");
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
        <CardTitle>Rental Requests</CardTitle>
        <CardDescription>
          View and manage requests from tenants interested in your properties
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests?.length === 0 ? (
          <div className="text-center p-6 text-gray-500">
            No rental requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell className="font-medium">
                      <div className="h-12 w-12 rounded-md overflow-hidden relative bg-muted">
                        {request.listingId?.images?.[0] ? (
                          <Image
                            src={request.listingId.images[0]}
                            alt="Property"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          "Unknown Property"
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.tenantId?.name || "Unknown Tenant"}
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

                        {request.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-green-600"
                              onClick={() => {
                                setSelectedRequest(request);
                                setApproveDialogOpen(true);
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-600"
                              onClick={() => {
                                setSelectedRequest(request);
                                setRejectDialogOpen(true);
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {request.status === "approved" &&
                          !request.paymentStatus && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-purple-600"
                              onClick={() => {
                                setSelectedRequest(request);
                                setPaymentDialogOpen(true);
                              }}
                            >
                              <DollarSign className="h-4 w-4" />
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
                <div className="h-12 w-12 rounded-md overflow-hidden relative bg-muted">
                  {selectedRequest.listingId?.images?.[0] ? (
                    <Image
                      src={selectedRequest.listingId.images[0]}
                      alt="Property"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    "Unknown Property"
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.listingId?.location} - $
                  {selectedRequest.listingId?.rent}/month
                </p>
              </div>

              <div>
                <h3 className="font-medium">Tenant Information</h3>
                <p>{selectedRequest.tenantId?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.tenantId?.email}
                </p>
                {selectedRequest.tenantId?.phoneNumber && (
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.tenantId?.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-medium">Request</h3>
                <p className="text-sm whitespace-pre-line">
                  {selectedRequest.message}
                </p>
              </div>

              <div>
                <h3 className="font-medium">Status</h3>
                <div className="mt-1">
                  {renderStatusBadge(selectedRequest.status)}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Request Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Rental Request</DialogTitle>
            <DialogDescription>
              Provide your contact phone number to share with the tenant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Your contact number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              onClick={handleApprove}
            >
              Approve Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Request Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Rental Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this rental request? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleReject}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Initiate Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Initiate Payment Request</DialogTitle>
            <DialogDescription>
              Send a payment request to the tenant to finalize the rental
              agreement.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Property</h3>
                <p>{selectedRequest.listingId?.images[0]}</p>
              </div>

              <div>
                <h3 className="font-medium">Tenant</h3>
                <p>{selectedRequest.tenantId?.name}</p>
              </div>

              <div>
                <h3 className="font-medium">Payment Amount</h3>
                <p className="text-lg font-bold">
                  ${selectedRequest.listingId?.rent}
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
            <Button type="button" onClick={handleInitiatePayment}>
              Send Payment Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LandlordRentalRequests;
