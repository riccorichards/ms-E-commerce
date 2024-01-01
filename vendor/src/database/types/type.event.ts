import { FoodMessageType } from "./type.foods";
import {
  GalleryMessageType,
  ImageMessageType,
  RemovePhotoMsg,
} from "./type.imageUrl";
import { FeedbackMessageType } from "./types.feedbacks";

export interface EventType {
  type: string;
  data:
    | FeedbackMessageType
    | FoodMessageType
    | ImageMessageType
    | GalleryMessageType
    | RemovePhotoMsg;
}
