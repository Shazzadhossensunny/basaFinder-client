export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface IPayment {
  _id: string;
  requestId: string;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}
