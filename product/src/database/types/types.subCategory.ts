export interface SubCatInputType {
  title: string;
  desc: string;
  mainCatId: number;
}

export interface SubCatDocsType extends SubCatInputType {
  id: number;
  createdAt: Date;
}
