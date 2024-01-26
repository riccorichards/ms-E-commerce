import { FoodMessageType } from "./type.foods";
import { ImageMessageType } from "./type.imageUrl";
import { MessageOrderType } from "./type.order";
import {
  FeedbackMessageType,
  UpdateFeedbackWithCustomerInfo,
} from "./types.feedbacks";

export interface EventType {
  type: string;
  data:
    | FeedbackMessageType
    | FoodMessageType
    | ImageMessageType
    | MessageOrderType
    | UpdateFeedbackWithCustomerInfo;
}
