import { IListing } from "./listing.type";
import { PaymentStatus } from "./payment.type";
import { IUser } from "./user";

export enum RequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface IRequest {
  _id: string;
  listingId: IListing | string;
  tenantId: IUser | string;
  message: string;
  moveInDate: string;
  status: RequestStatus;
  phoneNumber?: string;
  paymentStatus?: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  listing?: IListing;
}
