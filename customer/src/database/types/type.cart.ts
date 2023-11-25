export interface CartType {
  product: {
    _id: string;
    name: string;
    description: string;
    image: string;
    price: string;
  };
  unit: number;
}
