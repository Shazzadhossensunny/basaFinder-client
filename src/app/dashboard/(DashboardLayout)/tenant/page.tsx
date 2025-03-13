"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Home,
  CreditCard,
  DollarSign,
  ChevronRight,
  Bell,
  Calendar,
  MoreHorizontal,
  FileText,
  MessageSquare,
  Settings,
  ChevronUp,
  ArrowUpRight,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";

export default function TenantDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data
  const tenant = {
    name: "Rohim Ahmed",
    email: "rohim@gmail.com",
    phone: "+880 1712345678",
    profileImage: "/api/placeholder/100/100",
    joinedDate: "June 2024",
    currentProperty: {
      address: "Downtown, New York",
      rent: 2500,
      bedrooms: 2,
      images: ["/api/placeholder/400/250"],
      leaseEnd: "2025-09-15",
      landlord: {
        name: "Abul Kalam",
        email: "abul@gmail.com",
        phone: "+880 1798765432",
      },
    },
  };

  // Mock payment data
  const recentPayments = [
    {
      id: "67d33ace7560d",
      date: "2025-03-13",
      amount: 2500,
      status: "completed",
      property: "Downtown, New York",
    },
    {
      id: "67d339746d41d",
      date: "2025-02-13",
      amount: 2500,
      status: "completed",
      property: "Downtown, New York",
    },
    {
      id: "67d338f417827",
      date: "2025-01-13",
      amount: 2500,
      status: "completed",
      property: "Downtown, New York",
    },
  ];

  // Mock maintenance requests
  const maintenanceRequests = [
    {
      id: "maint-001",
      title: "Leaking faucet in bathroom",
      date: "2025-03-01",
      status: "in-progress",
      priority: "medium",
    },
    {
      id: "maint-002",
      title: "AC not cooling properly",
      date: "2025-02-20",
      status: "completed",
      priority: "high",
    },
  ];

  // Mock notifications
  const notifications = [
    {
      id: "notif-001",
      message: "Your rent payment for March has been processed",
      date: "2025-03-13",
      read: false,
      type: "payment",
    },
    {
      id: "notif-002",
      message: "Maintenance request #maint-001 is in progress",
      date: "2025-03-05",
      read: true,
      type: "maintenance",
    },
    {
      id: "notif-003",
      message: "Building inspection scheduled for April 10",
      date: "2025-03-01",
      read: true,
      type: "announcement",
    },
  ];

  // Mock documents
  const documents = [
    {
      id: "doc-001",
      title: "Lease Agreement",
      date: "2024-09-15",
      type: "lease",
    },
    {
      id: "doc-002",
      title: "Rent Receipts - 2025 Q1",
      date: "2025-03-31",
      type: "receipt",
    },
    {
      id: "doc-003",
      title: "Property Rules and Guidelines",
      date: "2024-09-15",
      type: "policy",
    },
  ];

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-800 bg-green-100";
      case "in-progress":
        return "text-blue-800 bg-blue-100";
      case "pending":
        return "text-yellow-800 bg-yellow-100";
      default:
        return "text-gray-800 bg-gray-100";
    }
  };

  // Calculate days until lease renewal
  const calculateDaysUntilRenewal = () => {
    const today = new Date();
    const leaseEnd = new Date(tenant.currentProperty.leaseEnd);
    const diffTime = Math.abs(leaseEnd - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntilRenewal = calculateDaysUntilRenewal();
  const renewalProgress = Math.min(
    100,
    Math.max(0, ((365 - daysUntilRenewal) / 365) * 100)
  );

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Header with greeting and profile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {tenant.name.split(" ")[0]}
          </h1>
          <p className="text-gray-600">
            Here's an overview of your rental dashboard
          </p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <Button variant="outline" size="icon" className="mr-2">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="mr-4">
            <Settings className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={tenant.profileImage} alt={tenant.name} />
            <AvatarFallback>
              {tenant.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Main dashboard content */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="grid grid-cols-4 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Property Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Current Residence</CardTitle>
                <CardDescription>
                  Details about your current rental property
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-6">
                    <img
                      src={tenant.currentProperty.images[0]}
                      alt="Property"
                      className="rounded-lg w-full h-40 object-cover"
                    />
                  </div>
                  <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2">
                      {tenant.currentProperty.address}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Monthly Rent</p>
                        <p className="font-medium">
                          ${tenant.currentProperty.rent.toLocaleString()} BDT
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bedrooms</p>
                        <p className="font-medium">
                          {tenant.currentProperty.bedrooms}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lease End Date</p>
                        <p className="font-medium">
                          {formatDate(tenant.currentProperty.leaseEnd)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Days Until Renewal
                        </p>
                        <p className="font-medium">{daysUntilRenewal} days</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">
                        Lease Progress
                      </p>
                      <Progress value={renewalProgress} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View Details</Button>
                <Button>Contact Landlord</Button>
              </CardFooter>
            </Card>

            {/* Landlord Information */}
            <Card>
              <CardHeader>
                <CardTitle>Landlord Information</CardTitle>
                <CardDescription>
                  Your property manager's contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarFallback className="text-lg">
                      {tenant.currentProperty.landlord.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {tenant.currentProperty.landlord.name}
                    </h3>
                    <p className="text-gray-500">Property Manager</p>
                  </div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <p>{tenant.currentProperty.landlord.phone}</p>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <p>{tenant.currentProperty.landlord.email}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardFooter>
            </Card>

            {/* Recent Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Your last 3 rent payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            ${payment.amount.toLocaleString()} BDT
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(payment.date)}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setActiveTab("payments")}
                >
                  View All Payments
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>

            {/* Maintenance Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Requests</CardTitle>
                <CardDescription>
                  Status of your service requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceRequests.map((request) => (
                    <div key={request.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{request.title}</h4>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>ID: {request.id}</span>
                        <span>{formatDate(request.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("maintenance")}
                >
                  View All Requests
                </Button>
                <Button>New Request</Button>
              </CardFooter>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start p-3 border rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          notification.read ? "bg-gray-100" : "bg-blue-100"
                        }`}
                      >
                        {notification.type === "payment" ? (
                          <DollarSign
                            className={`h-5 w-5 ${
                              notification.read
                                ? "text-gray-600"
                                : "text-blue-600"
                            }`}
                          />
                        ) : notification.type === "maintenance" ? (
                          <AlertCircle
                            className={`h-5 w-5 ${
                              notification.read
                                ? "text-gray-600"
                                : "text-blue-600"
                            }`}
                          />
                        ) : (
                          <Bell
                            className={`h-5 w-5 ${
                              notification.read
                                ? "text-gray-600"
                                : "text-blue-600"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <p
                          className={`${
                            notification.read ? "font-normal" : "font-medium"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(notification.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  View All Notifications
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>View all your rent payments</CardDescription>
                </div>
                <Button>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Make Payment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...recentPayments, ...recentPayments].map(
                      (payment, index) => (
                        <TableRow key={`${payment.id}-${index}`}>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {payment.id}
                          </TableCell>
                          <TableCell>{payment.property}</TableCell>
                          <TableCell>
                            ${payment.amount.toLocaleString()} BDT
                          </TableCell>
                          <TableCell>
                            <div
                              className={`px-2 py-1 rounded-full text-xs inline-block ${getStatusColor(
                                payment.status
                              )}`}
                            >
                              {payment.status}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Download Receipt
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Maintenance Requests</CardTitle>
                    <CardDescription>
                      Track all your service tickets
                    </CardDescription>
                  </div>
                  <Button>Create New Request</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...maintenanceRequests, ...maintenanceRequests].map(
                    (request, index) => (
                      <Card key={`${request.id}-${index}`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">
                              {request.title}
                            </CardTitle>
                            <div
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                request.status
                              )}`}
                            >
                              {request.status === "completed" ? (
                                <div className="flex items-center">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Completed
                                </div>
                              ) : (
                                request.status
                              )}
                            </div>
                          </div>
                          <CardDescription>ID: {request.id}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Submitted Date</p>
                              <p>{formatDate(request.date)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Priority</p>
                              <p className="capitalize">{request.priority}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="ghost" size="sm" className="w-full">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Documents & Files</CardTitle>
                  <CardDescription>
                    Access important documents related to your tenancy
                  </CardDescription>
                </div>
                <Button variant="outline">Upload Document</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border divide-y">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-50 p-2 rounded mr-3">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-gray-500">
                          Added on {formatDate(doc.date)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Download
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
