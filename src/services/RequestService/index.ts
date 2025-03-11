"use server";
import { getValidToken } from "@/lib/verifyToken";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
interface RequestData {
  listingId: string;
  tenantId: string;
  message: string;
}
export const createRequest = async (requestData: RequestData) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(requestData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create request");
    }
    revalidateTag("REQUESTS");
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const getTenantRequests = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/request/tenant`,
      {
        next: {
          tags: ["REQUESTS"],
        },
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const getLandlordRequests = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/request/landlord`,
      {
        next: {
          tags: ["REQUESTS"],
        },
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const getRequestById = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/request/${id}`,
      {
        next: {
          tags: ["REQUESTS"],
        },
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const updateRequestStatus = async (
  id: string,
  status: string,
  phoneNumber?: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/request/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status, phoneNumber }),
        headers: {
          "Content-Type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("REQUESTS");
    return res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const initiateRequestPayment = async (requestId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/request/${requestId}/payment`,
      {
        method: "POST",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("REQUESTS");
    return res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const updatePaymentStatus = async (id: string, paymentData: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/request/${id}/payment`,
      {
        method: "PATCH",
        body: JSON.stringify(paymentData),
        headers: {
          "Content-Type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("REQUESTS");
    return res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};
