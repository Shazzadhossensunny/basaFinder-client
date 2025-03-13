// export interface IListing {
//   _id: string;
//   location: string;
//   description: string;
//   rentAmount: number;
//   bedrooms: number;
//   amenities: string[];
//   images: string[];
//   landlordId: string;
//   createdAt: string;
//   updatedAt: string;
// }

import { IUser } from "./user";

export interface IListing {
  _id: string;
  location: string;
  description: string;
  rent: number;
  bedrooms: number;
  images: string[];
  amenities: string[];
  isAvailable: boolean;
  landlordId: string | IUser;
  createdAt: string;
  updatedAt: string;
}
