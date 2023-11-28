export interface DeliveryType {
  name: string;
  email: string;
  password: string;
  rating: number;
  orderAmount: number;
  image: string;
  reviewAmount: number;
  totalEarn: string;
  lat: number;
  lng: number;
}

export interface DeliveryDocsType extends DeliveryType {
  id: number;
}

