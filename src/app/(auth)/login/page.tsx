import LoginForm from "@/components/forms/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
