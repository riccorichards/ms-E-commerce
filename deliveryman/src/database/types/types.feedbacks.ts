export interface FeedbackMessageType {
  author: string;
  profileImg?: string;
  to: string;
  targetId: number;
  review: string;
  rating: number;
  feedId: number;
}

export interface FeedbacksDocsType extends FeedbackMessageType {
  id: number;
  createdAt?: Date;
}
