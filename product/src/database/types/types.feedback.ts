export interface FeedbackMessageType {
  author: string;
  authorImg?: string;
  address: string;
  targetId: number;
  targetImg: string;
  targetTitle: string;
  review: string;
  feedId: number;
}

export interface UpdateFeedbackMessageType {
  author?: string;
  authorImg?: string;
  address?: string;
  targetId?: number;
  targetImg?: string;
  targetTitle?: string;
  review: string;
  feedId?: number;
}

export interface FeedbacksDocsType extends FeedbackMessageType {
  id: number;
  createdAt?: Date;
}
