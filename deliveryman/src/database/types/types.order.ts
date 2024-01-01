export interface OrderType {
  username: string;
  customerEmail: string;
  customerAddress: string;
  vedor: string;
  vendorEmail: string;
  vendorAddress: string;
  vendorRating: string;
  customerImg?: string | undefined;
  orderStatus: string;
  note?: string | undefined;
  deliveryTime: string;
  distance: string;
  paymentMethod: string;
  totalAmount: string;
  deliverymanId: number;
}

export interface OrderDocsType extends OrderType {
  id: number;
}
