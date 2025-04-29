"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
import TenantRentalRequests from "@/components/dashboard/tenant/TenantRentalRequest";

const TenantRequestsPage = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "tenant")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || user.role !== "tenant") {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">My Requests</h2>
      <p className="text-muted-foreground mb-6">
        Track the status of your rental requests and manage payments
      </p>

      <TenantRentalRequests />
    </div>
  );
};

export default TenantRequestsPage;
