"use client";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { loginUser } from "@/services/AuthService";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

// Define role type to ensure type safety
type Role = "admin" | "tenant" | "landlord";

// Predefined credentials for different roles
const roleCredentials: Record<Role, { email: string; password: string }> = {
  admin: {
    email: "sunny@gmail.com",
    password: "123456",
  },
  tenant: {
    email: "rohim@gmail.com",
    password: "123456",
  },
  landlord: {
    email: "abul@gmail.com",
    password: "123456",
  },
};

export function LoginForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { user, setIsLoading } = useUser();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirectPath");
  const router = useRouter();

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const result = await loginUser(data);
      setIsLoading(true);
      if (result?.success) {
        toast.success(result?.message);
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/");
        }
      } else {
        toast.error(result?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  // Function to fill form with role credentials
  const fillCredentials = (role: Role) => {
    const credentials = roleCredentials[role];
    form.setValue("email", credentials.email);
    form.setValue("password", credentials.password);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Login to BasaFinder
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Quick Login Buttons */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2 text-center">Quick Login:</p>
          <div className="flex space-x-2 justify-center">
            <Button
              type="button"
              variant="outline"
              className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              onClick={() => fillCredentials("admin")}
            >
              Admin
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              onClick={() => fillCredentials("tenant")}
            >
              Tenant
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              onClick={() => fillCredentials("landlord")}
            >
              Landlord
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.email@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default LoginForm;
