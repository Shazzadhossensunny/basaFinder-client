"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
export const initiatePayment = async (requestId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/payments/initiate/${requestId}`,
      {
        method: "POST",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("PAYMENTS");
    revalidateTag("REQUESTS");
    return res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const verifyPayment = async (verificationData: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/payments/verify`,
      {
        method: "POST",
        body: JSON.stringify(verificationData),
        headers: {
          "Content-Type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("PAYMENTS");
    revalidateTag("REQUESTS");
    return res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const getPaymentByRequestId = async (requestId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/payments/${requestId}`,
      {
        next: {
          tags: ["PAYMENTS", "REQUESTS"],
        },
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    return res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const getAllPaymentsByUser = async (userRole: string) => {
  try {
    const endpoint =
      userRole === "tenant" ? "/payments/tenant" : "/payments/landlord";
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}${endpoint}`, {
      next: {
        tags: ["PAYMENTS"],
      },
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });
    return res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};
