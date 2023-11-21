import { object, string, TypeOf, number } from "zod";

const reviewPayload = {
  body: object({
    author: string({
      required_error: "Author is required!",
    }),
    profileImg: string().optional(),
    productId: number(),
    review: string(),
    rating: number(),
  }),
};

const reviewParams = {
  params: object({
    _id: string({
      required_error: "Product's ID is Required!",
    }),
  }),
};

export const CreateReviewSchema = object({ ...reviewPayload });
export const ReadReviewSchema = object({ ...reviewParams });
export const UpdateReviewSchema = object({
  ...reviewParams,
  ...reviewPayload,
});
export const DeleteReviewSchema = object({ ...reviewParams });

export type CreateReviewType = TypeOf<typeof CreateReviewSchema>;
export type ReadReviewType = TypeOf<typeof ReadReviewSchema>;
export type UpdateReviewType = TypeOf<typeof UpdateReviewSchema>;
export type DeleteReviewType = TypeOf<typeof DeleteReviewSchema>;
