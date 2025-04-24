"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Home, CheckCircle, Clock3 } from "lucide-react";
import { getLandlordListings } from "@/services/ListingService";
import { getLandlordRequests } from "@/services/RequestService";
import { useUser } from "@/context/UserContext";
import { IListing } from "@/types/listing.type";
import { IRequest } from "@/types/request.type";
import { getUserById } from "@/services/UserService";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserData {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function LandlordDashboard() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [listings, setListings] = useState<IListing[]>([]);
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    pendingRequests: 0,
    approvedRequests: 0,
  });
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const currentUserId = user?.userId;
        if (!currentUserId) throw new Error("User ID not found");

        const response = await getUserById(currentUserId);
        if (response.success) {
          setUserData(response.data);
        } else {
          setError(response.message || "Failed to load user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

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
            (req: IRequest) => req.status === "pending"
          ) || [];

        const approvedRequests =
          requestsRes.data?.filter(
            (req: IRequest) => req.status === "approved"
          ) || [];

        setStats({
          totalListings: listingsRes.data?.length || 0,
          activeListings: activeListings.length,
          pendingRequests: pendingRequests.length,
          approvedRequests: approvedRequests.length,
        });
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setDashboardLoading(false);
      }
    };

    if (user?.role === "landlord") {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading || dashboardLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-gradient-to-r from-blue-100 to-indigo-50 p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userData?.name?.toUpperCase() || "USER"}
          </h1>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-blue-600 text-white">
              {userData?.name
                ? userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Listings
            </CardTitle>
            <Home className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Listings
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeListings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending Requests
            </CardTitle>
            <Clock3 className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Approved Requests
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedRequests}</div>
          </CardContent>
        </Card>
      </div>

      {/* You can add more detailed listing and request summaries below if needed */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500">
          You have {requests.length} total rental requests.
        </p>
      </div>
    </div>
  );
}
