export interface ProductInputType {
  title: string;
  desc: string;
  price: string;
  image: string;
  vendorAddres: string;
  discount: string;
  subCatId: number;
}

export interface ProductDocsType extends ProductInputType {
  id: number;
  createdAt: Date;
}
