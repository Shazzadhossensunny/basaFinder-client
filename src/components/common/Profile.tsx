"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { getUserById } from "@/services/UserService";

// Define the User type based on your actual user data structure
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define schema for profile update
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(10, { message: "Invalid phone number" }),
});

// // Function to update user profile (you'll need to implement this in your userService)
// const updateUserProfile = async (id: string, data: FormData) => {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/${id}`, {
//       method: 'PATCH',
//       body: data,
//       headers: {
//         Authorization: document.cookie
//           .split('; ')
//           .find(row => row.startsWith('accessToken='))
//           ?.split('=')[1] || '',
//       },
//     });
//     return res.json();
//   } catch (error: any) {
//     return Error(error.message);
//   }
// };

export default function Profile() {
  const { user: contextUser, isLoading: contextLoading } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize form
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  console.log(contextUser);

  useEffect(() => {
    const fetchUserData = async () => {
      if (contextLoading) return;

      if (!contextUser) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getUserById(contextUser?.userId);
        console.log(userData);
        if (userData && !userData.error) {
          setUserProfile(userData.data);
          // Set form default values once user data is loaded
          form.reset({
            name: userData.data.name,
            email: userData.data.email,
            phoneNumber: userData.data.phoneNumber,
          });
        } else {
          toast.error("Failed to load user profile");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [contextUser, contextLoading, form]);

  // const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
  //   if (!userProfile?._id) return;

  //   setIsSubmitting(true);
  //   try {
  //     // Create FormData to submit
  //     const formData = new FormData();
  //     formData.append('name', values.name);
  //     formData.append('email', values.email);
  //     formData.append('phoneNumber', values.phoneNumber);

  //     // const result = await updateUserProfile(userProfile._id, formData);

  //     if (result.success) {
  //       // Update local state
  //       setUserProfile(prev => prev ? { ...prev, ...values } : null);

  //       toast.success('Profile updated successfully');
  //       setIsEditing(false);
  //       router.refresh(); // Refresh the page to update the data
  //     } else {
  //       toast.error(result.message || 'Failed to update profile');
  //     }
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //     toast.error('An error occurred while updating your profile');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (contextLoading || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  if (!contextUser) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Not Authenticated</h2>
              <p className="mt-2">
                Please log in to view your profile information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Profile Not Found</h2>
              <p className="mt-2">Unable to load your profile information.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto shadow-md">
        <CardHeader className="bg-primary/5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              <CardTitle>Your Profile</CardTitle>
            </div>
            {/* <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog> */}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-lg font-medium">{userProfile.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-lg">{userProfile.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Phone Number
              </h3>
              <p className="mt-1 text-lg">{userProfile.phoneNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Role</h3>
              <p className="mt-1 text-lg capitalize">{userProfile.role}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Account Status
            </h3>
            <div className="flex items-center">
              <span
                className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  userProfile.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span>{userProfile.isActive ? "Active" : "Inactive"}</span>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Created On</p>
                <p>{formatDate(userProfile.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p>{formatDate(userProfile.updatedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
