export interface VendorType {
  name: string;
  rating: number;
  reviewAmount: number;
  address: string;
  orderId: number;
}

export interface VendorDocsType extends VendorType {
  id: number;
}
