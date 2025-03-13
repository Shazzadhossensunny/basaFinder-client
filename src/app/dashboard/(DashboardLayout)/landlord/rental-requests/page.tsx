"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import LandlordRentalRequests from "@/components/dashboard/landlord/LandlordRentalRequest";

const LandlordRequestsPage = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "landlord")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "landlord") {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Rental Requests</h2>
      <p className="text-muted-foreground mb-6">
        View and manage rental requests from tenants
      </p>

      <LandlordRentalRequests />
    </div>
  );
};

export default LandlordRequestsPage;
