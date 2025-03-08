export interface IListing {
  _id: string;
  location: string;
  description: string;
  rentAmount: number;
  bedrooms: number;
  amenities: string[];
  images: string[];
  landlordId: string;
  createdAt: string;
  updatedAt: string;
}
