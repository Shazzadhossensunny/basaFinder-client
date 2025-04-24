"use client";
import { useUser } from "@/context/UserContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/forms/PasswordForm";

export default function ChangePasswordPage() {
  const { user } = useUser();
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto shadow-md">
        <CardHeader className="bg-primary/5 py-2">
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!user ? (
            <div className="text-center py-4">
              <p>Please log in to change your password.</p>
            </div>
          ) : (
            <ChangePasswordForm />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
