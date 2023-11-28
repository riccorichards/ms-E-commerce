export interface OrderType {
  deliveryTime: string;
  distance: string;
  paymentMethod: string;
  totalAmount: string;
  confirmationStatus: boolean;
  deliveryId: number;
}

export interface OrderDocsType extends OrderType {
  id: number;
}
