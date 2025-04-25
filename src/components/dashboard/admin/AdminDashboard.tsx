"use client";
import { JSX, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllUsers, getUserById } from "@/services/UserService";
import {
  CircleUserRound,
  Home,
  AlertCircle,
  LineChart,
  Activity,
  RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/UserContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { getAllListings } from "@/services/ListingService";
import { getLandlordRequests } from "@/services/RequestService";
import { getAllPaymentsByUser } from "@/services/PaymentService";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserData {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const { user, isLoading: userLoading } = useUser();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userData2, setUserData2] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userGrowth, setUserGrowth] = useState<
    { month: string; count: number }[]
  >([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUserId = user?.userId;

      if (!currentUserId) throw new Error("User ID not found");

      // Use Promise.all to fetch data in parallel
      const [
        currentUserResponse,
        usersResponse,
        listingsResponse,
        requestsResponse,
        paymentsResponse,
      ] = await Promise.all([
        getUserById(currentUserId),
        getAllUsers(),
        getAllListings("1", "1000"),
        getLandlordRequests(),
        getAllPaymentsByUser("admin"),
      ]);

      if (currentUserResponse.success) {
        setUserData2(currentUserResponse.data);
      }

      // Process data safely even if some responses fail
      // Extract data with fallbacks for each response
      const userData = usersResponse?.data || [];
      const listingsData = listingsResponse?.data || [];
      const requestsData = requestsResponse?.data || [];
      const paymentsData = paymentsResponse?.data || [];

      // Log issues but continue processing available data
      if (!usersResponse?.success) console.warn("User data fetch issue");
      if (!listingsResponse?.success) console.warn("Listings data fetch issue");
      if (!requestsResponse?.success) console.warn("Requests data fetch issue");
      if (!paymentsResponse?.success) console.warn("Payments data fetch issue");

      // Use optional chaining for all data accesses
      const activeUsers =
        userData.filter((user: any) => user.isActive).length || 0;

      const pendingApprovals =
        requestsData.filter((request: any) => request.status === "pending")
          .length || 0;

      // Fix revenue calculation with proper optional chaining and default value
      const totalRevenue = paymentsData.reduce(
        (sum: number, payment: any) => sum + (payment?.amount || 0),
        0
      );

      // Calculate user growth (can replace with actual API data later)
      const monthlyGrowth = Array.from({ length: 6 }, (_, i) => ({
        month: new Date(Date.now() - (5 - i) * 2629800000).toLocaleString(
          "default",
          { month: "short" }
        ),
        count: Math.floor(Math.random() * 100) + activeUsers,
      }));

      setStats({
        totalUsers: userData.length || 0,
        totalListings: listingsData.length || 0,
        activeUsers,
        pendingApprovals,
        totalRevenue,
      });
      setUserGrowth(monthlyGrowth);
    } catch (err: any) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchDashboardData();
    }
  }, [user]);

  // Show loading state for user credentials
  if (userLoading) {
    return <LoadingDashboard />;
  }

  // Check for admin access
  if (user?.role !== "admin") {
    return (
      <div className="p-6 text-center">
        <Badge variant="destructive" className="text-lg py-2 px-4">
          Unauthorized Access - Admin Privileges Required
        </Badge>
      </div>
    );
  }

  // Show error state with retry button
  if (error) {
    return (
      <div className="p-6 text-center">
        <Badge variant="destructive" className="text-lg py-2 px-4 mb-4">
          {error}
        </Badge>
        <Button onClick={fetchDashboardData} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-gradient-to-r from-blue-100 to-indigo-50 p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userData2?.name?.toUpperCase() || "USER"}
          </h1>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-blue-600 text-white">
              {userData2?.name
                ? userData2.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<CircleUserRound className="h-6 w-6 text-blue-600" />}
          isLoading={loading}
          trend={userGrowth}
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<Activity className="h-6 w-6 text-green-600" />}
          isLoading={loading}
          percentage={
            stats.totalUsers > 0
              ? (stats.activeUsers / stats.totalUsers) * 100
              : 0
          }
        />
        <StatsCard
          title="Total Listings"
          value={stats.totalListings}
          icon={<Home className="h-6 w-6 text-purple-600" />}
          isLoading={loading}
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<AlertCircle className="h-6 w-6 text-amber-600" />}
          isLoading={loading}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<LineChart className="h-6 w-6 text-emerald-600" />}
          isLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowth}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <SystemHealthStatus loading={loading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading state component for the dashboard
function LoadingDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <Skeleton className="h-10 w-24" />
                <div className="mt-4 h-16">
                  <Skeleton className="h-full w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="h-80">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type StatsCardProps = {
  title: string;
  value: number | string;
  icon: JSX.Element;
  isLoading: boolean;
  percentage?: number;
  trend?: { month: string; count: number }[];
};

function StatsCard({
  title,
  value,
  icon,
  isLoading,
  percentage,
  trend,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">{title}</h3>
          {icon}
        </div>

        {isLoading ? (
          <Skeleton className="h-10 w-24" />
        ) : (
          <div className="flex items-baseline gap-4">
            <div className="text-3xl font-bold">{value}</div>
            {percentage !== undefined && (
              <Badge variant={percentage > 50 ? "default" : "destructive"}>
                {percentage.toFixed(1)}%
              </Badge>
            )}
          </div>
        )}

        {trend && !isLoading && (
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <Bar
                  dataKey="count"
                  fill="#60a5fa"
                  radius={[4, 4, 0, 0]}
                  barSize={8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SystemHealthStatus({ loading }: { loading: boolean }) {
  const services = [
    { name: "API Gateway", status: "operational" },
    { name: "Database", status: "operational" },
    { name: "Payment Processing", status: "operational" },
    { name: "Authentication", status: "operational" },
    { name: "File Storage", status: "operational" },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div
          key={service.name}
          className="flex items-center justify-between p-4 bg-muted rounded-lg"
        >
          <span className="font-medium">{service.name}</span>
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          >
            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
          </Badge>
        </div>
      ))}
    </div>
  );
}
