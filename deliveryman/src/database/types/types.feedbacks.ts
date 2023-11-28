export interface FeedbacksInputType {
  author: string;
  profileImg: string;
  deliveryId: number;
  review: string;
  rating: number;
}

export interface FeedbacksDocsType extends FeedbacksInputType {
  id: number;
}
