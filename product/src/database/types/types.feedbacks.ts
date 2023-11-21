export interface FeedbacksInputType {
  author: string;
  profileImg?: string;
  productId: number;
  review: string;
  rating: number;
}

export interface FeedbacksDocsType extends FeedbacksInputType {
  id: number;
  createdAt?: Date;
}
