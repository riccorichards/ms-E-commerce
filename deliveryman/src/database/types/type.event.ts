import {
  FeedbackMessageType,
  UpdateCustomerInfoInFeedMessageType,
} from "./types.feedbacks";
import { OrderType } from "./types.orders";

export interface EditImageMessage {
  userId: number;
  title: string;
}

export interface EventType {
  type: string;
  data:
    | FeedbackMessageType
    | EditImageMessage
    | OrderType
    | UpdateCustomerInfoInFeedMessageType;
}
