export interface ItemsInput {
  productId: number;
  qty: number;
  price: string;
}

export interface ItemsDocsType extends ItemsInput {
  _id: string;
  createdAt: string;
}
