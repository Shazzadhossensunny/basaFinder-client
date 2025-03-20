"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserCog,
  MoreVertical,
  Search,
  Trash2,
  UserX,
  UserCheck,
  UserCog2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  toggleUserStatus,
  deleteUser,
  changeRole,
} from "@/services/UserService";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "landlord" | "tenant";
  isActive: boolean;
  deactivatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AdminUserManagementProps {
  userData: {
    success: boolean;
    message: string;
    data: User[];
  };
}

export default function AdminUserManagement({
  userData,
}: AdminUserManagementProps) {
  const [users, setUsers] = useState<User[]>(userData?.data || []);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(
    userData?.data || []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"activate" | "deactivate">(
    "activate"
  );
  const [selectedRole, setSelectedRole] = useState<
    "admin" | "landlord" | "tenant"
  >("tenant");
  const [confirmText, setConfirmText] = useState("");
  const { user, isLoading, setIsLoading } = useUser();

  useEffect(() => {
    setUsers(userData?.data || []);
    setFilteredUsers(userData?.data || []);
  }, [userData]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setUsers(userData?.data || []);
  };

  const handleToggleStatus = async () => {
    setStatusDialogOpen(false);
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      const response = await toggleUserStatus(selectedUser._id);
      if (response.success) {
        toast.success(
          `User ${
            actionType === "activate" ? "activated" : "deactivated"
          } successfully`
        );
        fetchUsers();
      } else {
        toast.error(response.message || "Failed to update user status");
      }
    } catch (error) {
      toast.error("Error updating user status");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async () => {
    setRoleDialogOpen(false);
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      const response = await changeRole(selectedUser._id, selectedRole);
      if (response.success) {
        toast.success(`User role changed to ${selectedRole} successfully`);
        fetchUsers();
      } else {
        toast.error(response.message || "Failed to update user role");
      }
    } catch (error) {
      toast.error("Error updating user role");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (confirmText !== selectedUser?.email) {
      toast.error("Email confirmation doesn't match");
      return;
    }

    setDeleteDialogOpen(false);
    setIsLoading(true);

    try {
      const response = await deleteUser(selectedUser._id);
      if (response.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Error deleting user");
      console.error(error);
    } finally {
      setIsLoading(false);
      setConfirmText("");
    }
  };

  const openStatusDialog = (user: User, type: "activate" | "deactivate") => {
    setSelectedUser(user);
    setActionType(type);
    setStatusDialogOpen(true);
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setRoleDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "landlord":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "tenant":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <UserCog className="mr-2 h-8 w-8" />
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="w-full sm:w-64 lg:w-96">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>
            View and manage all registered users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeletons
                  Array(5)
                    .fill(null)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-6 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-48" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.isActive ? "default" : "destructive"}
                          className={
                            user.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : ""
                          }
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => openRoleDialog(user)}
                            >
                              <UserCog2 className="mr-2 h-4 w-4" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.isActive ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  openStatusDialog(user, "deactivate")
                                }
                                className="text-amber-600"
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  openStatusDialog(user, "activate")
                                }
                                className="text-green-600"
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(user)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No users found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete User</DialogTitle>
            <DialogDescription>
              This action cannot be undone. It will permanently delete the user
              account and all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>To confirm deletion, please type the user's email:</p>
            <p className="font-medium mt-2">{selectedUser?.email}</p>
            <Input
              className="mt-4"
              placeholder="Type email to confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={confirmText !== selectedUser?.email}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Status Confirmation Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "activate" ? "Activate User" : "Deactivate User"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "activate"
                ? "The user will be able to log in and use the platform again."
                : "The user will not be able to log in until their account is reactivated."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              User: <span className="font-medium">{selectedUser?.name}</span>
            </p>
            <p>
              Email: <span className="font-medium">{selectedUser?.email}</span>
            </p>
            <p>
              Role: <span className="font-medium">{selectedUser?.role}</span>
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === "activate" ? "default" : "secondary"}
              onClick={handleToggleStatus}
            >
              {actionType === "activate" ? "Activate" : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Change Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the user's role to change their permissions and access
              levels in the system.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <p>
                User: <span className="font-medium">{selectedUser?.name}</span>
              </p>
              <p>
                Email:{" "}
                <span className="font-medium">{selectedUser?.email}</span>
              </p>
              <p>
                Current Role:{" "}
                <span className="font-medium">{selectedUser?.role}</span>
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">New Role:</p>
              <Select
                value={selectedRole}
                onValueChange={(value) =>
                  setSelectedRole(value as "admin" | "landlord" | "tenant")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="landlord">Landlord</SelectItem>
                  <SelectItem value="tenant">Tenant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
