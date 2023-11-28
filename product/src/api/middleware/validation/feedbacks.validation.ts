import { object, string, number } from "zod";

export const IncomingReviewValidation = object({
  author: string({
    required_error: "Author is required!",
  }),
  profileImg: string().optional(),
  productId: number(),
  review: string(),
  rating: number(),
});
