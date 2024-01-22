import { CartMessageType } from "./type.cart";
import { WishlistMessageType } from "./type.wishlist";
import { UploadFileType } from "./types.customer";
import { FeedbackMessageType } from "./types.feedback";

export interface EventType {
  type: string;
  data:
    | WishlistMessageType
    | FeedbackMessageType
    | CartMessageType
    | UploadFileType;
}
