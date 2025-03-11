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

export interface IListing {
  _id: string;
  location: string;
  description: string;
  rent: number;
  bedrooms: number;
  images: string[];
  isAvailable: boolean;
  landlordId: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}
