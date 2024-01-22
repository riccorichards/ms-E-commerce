export interface CustomerType {
  username: string;
  image: string;
  email: string;
  address: string;
}

export interface OrderItemType {
  id: number;
  productId: number;
  product_name: string;
  product_image: string;
  product_address: string;
  product_price: string;
  qty: string;
}

export interface OrderType {
  id: number;
  total_amount: number;
  createdAt: string;
  order_status: string;
  orderItem: OrderItemType[];
  customer: CustomerType;
}
