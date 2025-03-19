import AdminUserManagement from "@/components/dashboard/admin/AdminUserManagement";
import { getAllUsers } from "@/services/UserService";

export default async function AdminUserManagementPage() {
  const userData = await getAllUsers();

  return (
    <div className="container mx-auto py-6">
      <AdminUserManagement userData={userData} />
    </div>
  );
}
