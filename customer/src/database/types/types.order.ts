export interface OrderInput {
  orderId: number;
  email: string;
  order_status: number;
  note: number;
  amount: string;
  orderItem: string;
}

export interface OrderDocsType extends OrderInput {
  _id: string;
  createdAt: string;
}

export interface OrderMessageType {
  orderId: number;
  email: string;
  order_status: number;
  note: number;
  amount: string;
  orderItem: string;
  userId: string;
}
