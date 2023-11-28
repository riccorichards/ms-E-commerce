export interface CustomerType {
  name: string;
  image: string;
  orderId: number;
}

export interface CustomerDocsType extends CustomerType {
  id: number;
}
