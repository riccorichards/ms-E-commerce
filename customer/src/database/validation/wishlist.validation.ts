import { object, string, TypeOf, number, boolean } from "zod";

const payload = {
  body: object({
    product: object({
      name: string(),
      description: string(),
      banner: string(),
      avalable: boolean(),
      price: number(),
    }),
  }),
};

const params = {
  params: object({
    userId: string({
      required_error: "UserId is required!",
    }),
  }),
};

export const ReadWishlistSchema = object({ ...params });
export const UpdateWishlistSchema = object({ ...params, ...payload });

export type ReadWishlistSchemaType = TypeOf<typeof ReadWishlistSchema>;
export type UpdateWishlistSchemaType = TypeOf<typeof UpdateWishlistSchema>;
