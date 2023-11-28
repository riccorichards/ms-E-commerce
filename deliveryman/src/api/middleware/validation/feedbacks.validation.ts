import { object, string, number } from "zod";

export const IncomingFeedbackValidation = object({
  author: string({
    required_error: "Author is Required!",
  }).min(3, "Title must be at least 3 characters long"),
  review: string({
    required_error: "Review is Required!",
  }),
  rating: number({
    required_error: "Rating is Required!",
  }),
  profileImg: string({
    required_error: "Image is Required!",
  }),
  deliveryId: number({
    required_error: "Delivery's id is Required!",
  }),
});
