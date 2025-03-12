"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import { useUser } from "@/context/UserContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser, setIsLoading } = useUser();

  if (!user) {
    // Handle redirect or show loading state
    return <div>Loading...</div>;
  }

  return (
    <Sidebar user={user} setUser={setUser} setIsLoading={setIsLoading}>
      {children}
    </Sidebar>
  );
}
