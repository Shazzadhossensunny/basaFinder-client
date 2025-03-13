"use client";
import { JSX, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllUsers } from "@/services/UserService";
import { getAllListings } from "@/services/ListingService";
import { CircleUserRound, Home, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    activeUsers: 0,
    pendingApprovals: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersResponse, listingsResponse] = await Promise.all([
          getAllUsers(),
          getAllListings("1", "100"), // Get a large enough sample for the dashboard
        ]);

        if (usersResponse?.success && listingsResponse?.success) {
          const activeUsers = usersResponse.data.filter(
            (user: any) => user.status === "active"
          ).length;

          // For demo purposes, let's assume 10% of listings need approval
          const pendingApprovals = Math.floor(
            listingsResponse.data.items?.length * 0.1
          );

          setStats({
            totalUsers: usersResponse.data.length,
            totalListings: listingsResponse.data.items?.length,
            activeUsers,
            pendingApprovals,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to the administration portal. Monitor system metrics and manage
        users and listings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<CircleUserRound className="h-6 w-6 text-blue-600" />}
          isLoading={isLoading}
          description="Registered users on the platform"
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<CircleUserRound className="h-6 w-6 text-green-600" />}
          isLoading={isLoading}
          description="Users with active accounts"
        />
        <StatsCard
          title="Total Listings"
          value={stats.totalListings}
          icon={<Home className="h-6 w-6 text-purple-600" />}
          isLoading={isLoading}
          description="Properties currently listed"
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<AlertCircle className="h-6 w-6 text-amber-600" />}
          isLoading={isLoading}
          description="Listings waiting for review"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <ul className="space-y-4">
                <li className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">New user registered</p>
                    <p className="text-sm text-muted-foreground">
                      John Doe (Tenant)
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    2 hours ago
                  </span>
                </li>
                <li className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">New listing created</p>
                    <p className="text-sm text-muted-foreground">
                      3 Bedroom Apartment in Downtown
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    5 hours ago
                  </span>
                </li>
                <li className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">User status updated</p>
                    <p className="text-sm text-muted-foreground">
                      Jane Smith (Landlord) - Activated
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Yesterday
                  </span>
                </li>
                <li className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Rental payment completed</p>
                    <p className="text-sm text-muted-foreground">
                      Studio Apartment - $1,200
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    2 days ago
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Listing updated</p>
                    <p className="text-sm text-muted-foreground">
                      2 Bedroom House - Price reduced
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    3 days ago
                  </span>
                </li>
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Database</span>
                  <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                    <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">API Services</span>
                  <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                    <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Payment Processing</span>
                  <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                    <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Storage</span>
                  <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                    <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Authentication</span>
                  <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                    <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                    Operational
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
type CardInfo = {
  title: string;
  value: number | string;
  icon: JSX.Element;
  isLoading: boolean;
  description?: string;
};

// Helper component for the stat cards
function StatsCard({ title, value, icon, isLoading, description }: CardInfo) {
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
          <div className="text-3xl font-bold">{value}</div>
        )}
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
