export enum UserRole {
  ADMIN = "admin",
  LANDLORD = "landlord",
  TENANT = "tenant",
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isActive?: boolean;
  role: UserRole;
  deactivatedAt?: string | null;
  iat?: number;
  exp?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
