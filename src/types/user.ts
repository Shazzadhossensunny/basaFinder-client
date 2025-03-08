export interface IUser {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  role: "landlord" | "tenant" | "admin";
  deactivatedAt: string | null;
  iat?: number;
  exp?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
