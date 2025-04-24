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
import {
  Loader2,
  Eye,
  CreditCard,
  PhoneOutgoing,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  getTenantRequests,
  getRequestById,
  initiateRequestPayment,
} from "@/services/RequestService";
import Link from "next/link";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface IRequest {
  _id: string;
  status: "pending" | "approved" | "rejected";
  paymentStatus: PaymentStatus;
  paymentInitiated: boolean;
  createdAt: string;
  updatedAt: string;
  message: string;
  moveInDate: string;
  rentalDuration: number;
  specialRequirements: string;
  landlordPhoneNumber: string | null;

  // Tenant Info
  tenantId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };

  // Listing Info
  listingId: {
    _id: string;
    location: string;
    rent: number;
    bedrooms: number;
    images: string[];
  } | null;

  // Payment Info
  paymentInfo?: {
    status: string;
    transactionId: string;
    amount: number;
    currency: string;
    paidAt: string;
  };
}

const TenantRentalRequests = () => {
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<IRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getTenantRequests();
      if (response.success) {
        setRequests(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch your rental requests");
      }
    } catch (error) {
      toast.error("An error occurred while fetching requests");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Poll for payment status updates (simulate real-time updates)
  useEffect(() => {
    // Only poll when payment is initiated but not yet confirmed
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        fetchRequests();
        setPaymentSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [paymentSuccess]);

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

  const handlePayment = async () => {
    if (!selectedRequest) return;

    try {
      setProcessingPayment(true);
      const response = await initiateRequestPayment(selectedRequest._id);
      if (response.data.paymentUrl) {
        toast.success("Payment initiated successfully");

        // Open payment window
        const paymentWindow = window.open(response.data.paymentUrl, "_blank");

        // Update request status immediately
        setRequests(
          requests.map((req) =>
            req._id === selectedRequest._id
              ? {
                  ...req,
                  paymentInitiated: true,
                  paymentStatus: "pending",
                }
              : req
          )
        );

        // Set up listener for payment completion (in a real app this would be via webhook)
        const checkPaymentCompletion = () => {
          // Simulate payment completion after 5 seconds (in a real app this would be via API)
          setTimeout(async () => {
            // Fetch updated request status
            const updatedResponse = await getRequestById(selectedRequest._id);
            if (updatedResponse.success) {
              const updatedRequest = updatedResponse.data;

              // Update the request in the state
              setRequests(
                requests.map((req) =>
                  req._id === selectedRequest._id ? updatedRequest : req
                )
              );

              // Update the selected request if dialog is still open
              setSelectedRequest(updatedRequest);

              setPaymentSuccess(true);
              toast.success("Payment completed successfully!");
            }
          }, 5000);
        };

        checkPaymentCompletion();

        // Close the payment dialog
        setPaymentDialogOpen(false);
      }
    } catch (error) {
      toast.error("An error occurred while processing payment");
    } finally {
      setProcessingPayment(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "paid":
        return "Payment Complete";
      default:
        return status;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Waiting for landlord approval";
      case "approved":
        return "Ready for payment";
      case "rejected":
        return "Request denied by landlord";
      case "paid":
        return "Rental payment completed";
      default:
        return "";
    }
  };

  const renderStatusBadge = (
    status: string,
    type: "request" | "payment" = "request"
  ) => {
    const label = getStatusLabel(status);
    const description = getStatusDescription(status);

    let bgColor = "bg-gray-100";
    let textColor = "text-gray-800";

    switch (status) {
      case "pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        break;
      case "approved":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        break;
      case "rejected":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
      case "paid":
        bgColor = "bg-purple-100";
        textColor = "text-purple-800";
        break;
    }

    return (
      <div className="flex flex-col">
        <Badge
          variant="outline"
          className={`${bgColor} ${textColor} flex items-center gap-1`}
          title={description}
        >
          {type === "payment" && status === "paid" && (
            <CheckCircle2 className="h-3 w-3" />
          )}
          {label}
        </Badge>
        {type === "request" && (
          <span className="text-xs text-gray-500 mt-1">{description}</span>
        )}
      </div>
    );
  };

  const isPaymentComplete = (request: IRequest) => {
    return (
      request.paymentStatus === "paid" ||
      (request.paymentInfo && request.paymentInfo.status === "paid")
    );
  };

  const handleOpenPaymentDialog = (request: IRequest) => {
    setSelectedRequest(request);
    setPaymentDialogOpen(true);
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
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Property</TableHead>
                  <TableHead className="w-1/3">Status</TableHead>
                  <TableHead className="w-1/6">Date</TableHead>
                  <TableHead className="w-1/6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell className="font-medium">
                      {request.listingId?.location || "Unknown Property"}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {renderStatusBadge(request.status, "request")}
                        {request.paymentStatus &&
                          renderStatusBadge(request.paymentStatus, "payment")}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(request.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => handleViewDetails(request._id)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {request.status === "approved" && (
                          <Button
                            variant="outline"
                            size="icon"
                            className={
                              isPaymentComplete(request)
                                ? "text-green-600 border-green-200 bg-green-50 cursor-pointer"
                                : "text-purple-600 cursor-pointer"
                            }
                            onClick={() => handleOpenPaymentDialog(request)}
                            title={
                              isPaymentComplete(request)
                                ? "Payment Complete"
                                : "Make Payment"
                            }
                          >
                            {isPaymentComplete(request) ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <CreditCard className="h-4 w-4" />
                            )}
                          </Button>
                        )}

                        {request.landlordPhoneNumber && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-blue-600"
                            asChild
                            title="Call Landlord"
                          >
                            <Link href={`tel:${request.landlordPhoneNumber}`}>
                              <PhoneOutgoing className="h-4 w-4" />
                            </Link>
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
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Property</h3>
                <p>
                  {selectedRequest.listingId?.location || "Unknown Property"}
                </p>
                <p className="text-sm text-muted-foreground">
                  ${selectedRequest.listingId?.rent}/month -{" "}
                  {selectedRequest.listingId?.bedrooms} bedrooms
                </p>
              </div>

              <div>
                <h3 className="font-medium">Landlord Contact</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.landlordPhoneNumber || "No contact provided"}
                </p>
              </div>

              <div>
                <h3 className="font-medium">Move-in Date</h3>
                <p className="text-sm">
                  {format(new Date(selectedRequest.moveInDate), "PPP")}
                </p>
              </div>

              <div>
                <h3 className="font-medium">Special Requirements</h3>
                <p className="text-sm whitespace-pre-line">
                  {selectedRequest.specialRequirements || "None"}
                </p>
              </div>

              <div>
                <h3 className="font-medium">Status</h3>
                <div className="mt-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-24">Request:</span>
                    {renderStatusBadge(selectedRequest.status)}
                  </div>

                  {selectedRequest.paymentStatus && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm w-24">Payment:</span>
                      {renderStatusBadge(
                        selectedRequest.paymentStatus,
                        "payment"
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              className="cursor-pointer"
              onClick={() => setDetailsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedRequest && isPaymentComplete(selectedRequest)
                ? "Payment Complete"
                : "Complete Rental Payment"}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest && isPaymentComplete(selectedRequest)
                ? "Your payment has been successfully processed"
                : "Pay your rental fee to finalize the agreement"}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Property</h3>
                <p>
                  {selectedRequest.listingId?.location || "Unknown Property"}
                </p>
                <p className="text-sm text-muted-foreground">
                  ${selectedRequest.listingId?.rent}/month
                </p>
              </div>

              <div>
                <h3 className="font-medium">Payment Details</h3>
                {isPaymentComplete(selectedRequest) ? (
                  <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Payment Completed</span>
                    </div>
                    {selectedRequest.paymentInfo && (
                      <>
                        <p>
                          Amount: ${selectedRequest.paymentInfo.amount}{" "}
                          {selectedRequest.paymentInfo.currency}
                        </p>
                        <p>
                          Paid at:{" "}
                          {format(
                            new Date(selectedRequest.paymentInfo.paidAt),
                            "PPP"
                          )}
                        </p>
                        <p>
                          Transaction ID:{" "}
                          <span className="font-mono text-xs">
                            {selectedRequest.paymentInfo.transactionId}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      {selectedRequest.listingId?.rent
                        ? `Payment of $${selectedRequest.listingId.rent} is required to finalize your rental agreement.`
                        : "Payment is required to finalize your rental agreement."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-end">
            {selectedRequest && isPaymentComplete(selectedRequest) ? (
              <Button
                type="button"
                className="cursor-pointer"
                onClick={() => setPaymentDialogOpen(false)}
              >
                Close
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setPaymentDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  onClick={handlePayment}
                  disabled={Boolean(
                    processingPayment ||
                      (selectedRequest && isPaymentComplete(selectedRequest))
                  )}
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process Payment"
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TenantRentalRequests;
