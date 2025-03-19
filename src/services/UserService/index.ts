"use server";
import { getValidToken } from "@/lib/verifyToken";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getUserById = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/${id}`, {
      next: {
        tags: ["USERS"],
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

export const getAllUsers = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users`, {
      next: {
        tags: ["USERS"],
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

export const toggleUserStatus = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/toggle-status/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("USERS");
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};
export const changeRole = async (id: string, role: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/change-role/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        body: JSON.stringify({ role }),
      }
    );
    revalidateTag("USERS");
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });
    revalidateTag("USERS");
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};
export const updateProfile = async (id: string, payload: any) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update user");
    }
    revalidateTag("USERS");
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};
