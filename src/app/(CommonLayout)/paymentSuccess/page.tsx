"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";
import { getRequestById } from "@/services/RequestService";
import { verifyPayment } from "@/services/PaymentService";
interface RequestData {
  _id: string;
  paymentInfo: {
    transactionId: string;
    amount: number;
    currency: string;
    paidAt: string;
  };
  paymentStatus: string;
  listingId: {
    location: string;
    landlordId: {
      name: string;
    };
  };
  landlordPhoneNumber: string;
  moveInDate: string;
}

export default function PaymentSuccess() {
  const [requestData, setRequestData] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const requestId = searchParams.get("requestId");

  useEffect(() => {
    const processPayment = async () => {
      if (!requestId) {
        setError("No request ID found");
        setLoading(false);
        return;
      }

      try {
        // First, verify and process the payment using URL parameters
        const status = searchParams.get("status");
        const payment_id = searchParams.get("payment_id");

        if (status === "success" && payment_id) {
          // This is a critical step you're missing - you need to call your API to verify the payment
          // and update the payment status in your database before fetching the request data
          try {
            // Use your verifyPayment service to update the payment status
            const verificationData = {
              requestId,
              paymentId: payment_id,
              status,
            };

            // Call verifyPayment from your imported services
            // You'll need to import it: import { verifyPayment } from "@/services/PaymentService";
            await verifyPayment(verificationData);

            // Wait a moment for database updates to complete
            await new Promise((resolve) => setTimeout(resolve, 2000));
          } catch (verifyErr) {
            console.error("Payment verification failed:", verifyErr);
            // Continue to fetch request data anyway to show current status
          }
        }

        // Now fetch the request data (which should be updated if verification succeeded)
        const data = await getRequestById(requestId);
        if (data instanceof Error) {
          throw data;
        }
        setRequestData(data.data); // Make sure you're accessing data.data if that's your API structure
      } catch (err: any) {
        setError(err.message || "Failed to fetch request details");
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [requestId, searchParams]);

  console.log(requestData);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !requestData) {
    return (
      <div className="max-w-md mx-auto m-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center text-red-600 mb-2">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-semibold">Error</h3>
        </div>
        <p className="text-red-600">
          {error || "There was a problem loading your payment details."}
        </p>
        <div className="mt-4">
          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Ensure paymentInfo exists
  if (!requestData.paymentInfo || requestData.paymentStatus !== "paid") {
    return (
      <div className="max-w-md mx-auto m-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center text-yellow-600 mb-2">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-semibold">Payment Not Completed</h3>
        </div>
        <p className="text-yellow-600">
          Payment information is incomplete or payment is not marked as paid.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto mb-5">
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-50 p-6 text-center">
            <div className="mx-auto w-16 h-16 mb-4">
              <svg
                className="w-full h-full text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-green-700">
              Payment Successful!
            </h2>
            <p className="mt-2 text-green-600">
              Your rental application payment has been processed successfully.
            </p>
          </div>

          {/* Order Details */}
          <div className="p-6 mb-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-gray-600 font-medium">Request ID</span>
                <span className="text-gray-800">{requestData._id}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-gray-600 font-medium">
                  Transaction ID
                </span>
                <span className="text-gray-800">
                  {requestData.paymentInfo.transactionId}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-gray-600 font-medium">Property</span>
                <span className="text-gray-800">
                  {requestData.listingId.location}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-gray-600 font-medium">Landlord</span>
                <span className="text-gray-800">
                  {requestData.listingId.landlordId.name}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-gray-600 font-medium">Move-in Date</span>
                <span className="text-gray-800">
                  {new Date(requestData.moveInDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-gray-600 font-medium">Amount Paid</span>
                <span className="text-gray-800 font-semibold">
                  ৳{requestData.paymentInfo.amount}{" "}
                  {requestData.paymentInfo.currency}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-gray-600 font-medium">Payment Date</span>
                <span className="text-gray-800">
                  {new Date(requestData.paymentInfo.paidAt).toLocaleString()}
                </span>
              </div>

              {/* Next Steps */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  What's Next?
                </h3>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Payment confirmation email has been sent to your registered
                    email
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    You can now contact the landlord at{" "}
                    {requestData.landlordPhoneNumber}
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Prepare for your move on{" "}
                    {new Date(requestData.moveInDate).toLocaleDateString()}
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
