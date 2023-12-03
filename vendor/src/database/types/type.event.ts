import { FeedbackMessageType } from "./types.feedbacks";

export interface EventType {
  type: string;
  data: FeedbackMessageType;
}
