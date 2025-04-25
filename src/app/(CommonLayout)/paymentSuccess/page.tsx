import PaymentSuccess from "@/components/common/PaymentSuccess";
import { Suspense } from "react";

export default function PaymentSuccessPage() {
  return (
    <div className="p-4">
      <Suspense>
        <PaymentSuccess />
      </Suspense>
    </div>
  );
}
