export interface ProductInputType {
  title: string;
  desc: string;
  price: string;
  vendor_name: string;
  address: string;
  vendor_rating: number;
  image: string;
  discount: string;
  subCatId: number;
}

export interface ProductDocsType extends ProductInputType {
  id: number;
  createdAt: Date;
}
