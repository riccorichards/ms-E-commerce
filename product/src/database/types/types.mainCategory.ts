export interface MainCatInputType {
  title: string;
  desc: string;
  image: string;
}

export interface MainCatDocsType extends MainCatInputType {
  id: number;
  createdAt?: Date;
}
