import { CartMessageType } from "./type.cart";
import { WishlistMessageType } from "./type.wishlist";
import { UploadFileType } from "./types.customer";
import { FeedbackMessageType } from "./types.feedback";
import { OrderMessageType } from "./types.order";

export interface EventType {
  type: string;
  data:
    | WishlistMessageType
    | FeedbackMessageType
    | OrderMessageType
    | CartMessageType
    | UploadFileType;
}
