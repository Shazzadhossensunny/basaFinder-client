"use server";
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
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("USERS");
    return res.json();
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
    return res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};
