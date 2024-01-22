import { FeedbackMessageType } from "./types.feedbacks";
import { OrderType } from "./types.orders";

export interface EditImageMessage {
  userId: number;
  url: string;
}

export interface EventType {
  type: string;
  data: FeedbackMessageType | EditImageMessage | OrderType;
}
