"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import CreateListing from "@/components/forms/ListingForm";

const ListingCreatePage = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in or not a landlord
    if (!isLoading && (!user || user.role !== "landlord")) {
      router.push("/login?redirect=/listings/create");
    }
  }, [user, isLoading, router]);

  // Show loading or unauthorized message while checking
  if (isLoading || !user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  // If not a landlord, show unauthorized message
  if (user.role !== "landlord") {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
        <p>Only landlords can create rental listings.</p>
      </div>
    );
  }

  return <CreateListing />;
};

export default ListingCreatePage;
