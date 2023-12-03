import { object, string, TypeOf, number } from "zod";

export const isValidObjectId = (value: string) =>
  /^[0-9a-fA-F]{24}$/.test(value);

const reviewPayload = {
  body: object({
    user: string({
      required_error: "User's id is required!",
    }).refine((value) => isValidObjectId(value), {
      message: "Invalid ObjectId format for subCategoryId",
    }),
    product: string({
      required_error: "Product's id is required!",
    }).refine((value) => isValidObjectId(value), {
      message: "Invalid ObjectId format for subCategoryId",
    }),
    review: string({
      required_error: "Review is required!",
    }),
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
