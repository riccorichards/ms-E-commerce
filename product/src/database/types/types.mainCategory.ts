export interface MainCatInputType {
  title: string;
  desc: string;
}

export interface MainCatDocsType extends MainCatInputType {
  id: number;
  createdAt?: Date;
}
