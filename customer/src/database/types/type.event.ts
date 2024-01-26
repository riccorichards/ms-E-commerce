import { CartMessageType } from "./type.cart";
import {
  FeedbackMessageType,
  UpdateFeedbackWithDaliverymanPhotoMessage,
} from "./type.feedback";
import { WishlistMessageType } from "./type.wishlist";
import { UploadFileType } from "./types.customer";

export interface EventType {
  type: string;
  data:
    | WishlistMessageType
    | FeedbackMessageType
    | CartMessageType
    | UploadFileType
    | UpdateFeedbackWithDaliverymanPhotoMessage;
}

export interface BindingKeysType {
  [key: string]: string;
}
