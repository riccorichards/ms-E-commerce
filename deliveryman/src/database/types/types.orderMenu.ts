export interface ProductType {
  title: string;
  image: string;
  price: string;
  unit: number;
  orderId: number;
}

export interface ProductDocsType extends ProductType {
  id: number;
}
