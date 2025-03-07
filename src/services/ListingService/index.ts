"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getAllListings = async (
  page?: string,
  limit?: string,
  query?: { [key: string]: string | string[] | undefined }
) => {
  const params = new URLSearchParams();

  if (query?.location) {
    params.append("location", query.location.toString());
  }
  if (query?.price) {
    params.append("minPrice", "0");
    params.append("maxPrice", query.price.toString());
  }
  if (query?.bedrooms) {
    params.append("bedrooms", query.bedrooms.toString());
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/listings?limit=${limit}&page=${page}&${params}`,
      {
        next: {
          tags: ["LISTINGS"],
        },
      }
    );
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const getListingById = async (listingId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/listings/${listingId}`,
      {
        next: {
          tags: ["LISTINGS"],
        },
      }
    );
    return await res.json();
  } catch (error: any) {
    return Error(error.message);
  }
};

export const createListing = async (listingData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/listings`, {
      method: "POST",
      body: listingData,
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });
    revalidateTag("LISTINGS");
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const updateListing = async (id: string, listingData: FormData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/listings/${id}`,
      {
        method: "PUT",
        body: listingData,
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("LISTINGS");
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const deleteListing = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/listings/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("LISTINGS");
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const getLandlordListings = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/listings/landlord/my-listings`,
      {
        next: {
          tags: ["LISTINGS"],
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
