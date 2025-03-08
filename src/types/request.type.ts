import { IListing } from "./listing.type";

export enum RequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface IRequest {
  _id: string;
  listingId: string;
  tenantId: string;
  message: string;
  status: RequestStatus;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
  listing?: IListing;
}
