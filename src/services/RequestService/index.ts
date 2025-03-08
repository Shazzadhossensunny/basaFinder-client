"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const createRequest = async (requestData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/requests`, {
      method: "POST",
      body: requestData,
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });
    revalidateTag("REQUESTS");
    return res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const getTenantRequests = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/requests/tenant`,
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
      `${process.env.NEXT_PUBLIC_BASE_API}/requests/landlord`,
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
      `${process.env.NEXT_PUBLIC_BASE_API}/requests/${id}`,
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
      `${process.env.NEXT_PUBLIC_BASE_API}/requests/${id}/status`,
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
      `${process.env.NEXT_PUBLIC_BASE_API}/requests/${requestId}/payment`,
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
      `${process.env.NEXT_PUBLIC_BASE_API}/requests/${id}/payment`,
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
