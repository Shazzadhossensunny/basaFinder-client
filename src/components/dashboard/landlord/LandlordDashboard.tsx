"use client";
import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getLandlordListings } from "@/services/ListingService";
import { getLandlordRequests } from "@/services/RequestService";
import { useUser } from "@/context/UserContext";
import { IListing } from "@/types/listing.type";
import { IRequest } from "@/types/request.type";

export default function LandlordDashboard() {
  const { user, isLoading, setIsLoading, setUser } = useUser();
  const [listings, setListings] = useState<IListing[]>([]);
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    pendingRequests: 0,
    approvedRequests: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardLoading(true);
        const [listingsRes, requestsRes] = await Promise.all([
          getLandlordListings(),
          getLandlordRequests(),
        ]);

        if (listingsRes.success) {
          setListings(listingsRes.data || []);
        }

        if (requestsRes.success) {
          setRequests(requestsRes.data || []);
        }

        // Calculate stats
        const activeListings =
          listingsRes.data?.filter(
            (listing: IListing) => listing.isAvailable
          ) || [];
        const pendingRequests =
          requestsRes.data?.filter(
            (request: IRequest) => request.status === "pending"
          ) || [];
        const approvedRequests =
          requestsRes.data?.filter(
            (request: IRequest) => request.status === "approved"
          ) || [];

        setStats({
          totalListings: listingsRes.data?.length || 0,
          activeListings: activeListings.length,
          pendingRequests: pendingRequests.length,
          approvedRequests: approvedRequests.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setDashboardLoading(false);
      }
    };

    if (user && user.role === "landlord") {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Landlord Dashboard</h2>

      {dashboardLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard
              title="Total Listings"
              value={stats.totalListings}
              description="Properties you have listed"
              color="bg-blue-50 dark:bg-blue-950"
            />
            <DashboardCard
              title="Active Listings"
              value={stats.activeListings}
              description="Available for rent"
              color="bg-green-50 dark:bg-green-950"
            />
            <DashboardCard
              title="Pending Requests"
              value={stats.pendingRequests}
              description="Awaiting your response"
              color="bg-yellow-50 dark:bg-yellow-950"
            />
            <DashboardCard
              title="Approved Requests"
              value={stats.approvedRequests}
              description="Ready for payment"
              color="bg-purple-50 dark:bg-purple-950"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentListings listings={listings.slice(0, 5)} />
            <RecentRequests requests={requests.slice(0, 5)} />
          </div>
        </>
      )}
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: number;
  description: string;
  color: string;
}

const DashboardCard = ({
  title,
  value,
  description,
  color,
}: DashboardCardProps) => (
  <Card className={`${color} border-none`}>
    <CardContent className="pt-6">
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <h3 className="mt-2 font-medium">{title}</h3>
    </CardContent>
  </Card>
);

interface RecentListingsProps {
  listings: IListing[];
}

const RecentListings = ({ listings }: RecentListingsProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Listings</CardTitle>
    </CardHeader>
    <CardContent>
      {listings.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No listings found. Add new properties to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div>
                <p className="text-sm text-muted-foreground">
                  {listing.location}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${listing.rent}/month</p>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs ${
                    listing.isAvailable
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }`}
                >
                  {listing.isAvailable ? "Available" : "Rented"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

interface RecentRequestsProps {
  requests: IRequest[];
}

const RecentRequests = ({ requests }: RecentRequestsProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Requests</CardTitle>
    </CardHeader>
    <CardContent>
      {requests.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No requests yet. Requests will appear when tenants show interest in
          your properties.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div>
                {/* <h4 className="font-medium">{request.listingId?.title || "Property"}</h4> */}
                <p className="text-sm text-muted-foreground">
                  From: {request.tenantId?.name || "Tenant"}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={request.status} />
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = "";

  switch (status) {
    case "pending":
      bgColor =
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      break;
    case "approved":
      bgColor =
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      break;
    case "rejected":
      bgColor = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      break;
    case "completed":
      bgColor = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      break;
    default:
      bgColor = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }

  return (
    <span className={`inline-block rounded-full px-2 py-1 text-xs ${bgColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
