import { object, string, TypeOf, number, boolean } from "zod";

const payload = {
  body: object({
    product: object({
      product: object({
        name: string(),
        description: string(),
        banner: string(),
        avalable: boolean(),
        price: number(),
      }),
    }),
    unit: number(),
  }),
};

const params = {
  params: object({
    cartId: string({
      required_error: "CartId is required!",
    }),
  }),
};

export const CreateCartSchema = object({ ...payload });
export const ReadCartSchema = object({ ...params });
export const UpdateCartSchema = object({ ...params, ...payload });
export const DeleteCartSchema = object({ ...params });

export type CreateUserSchemaType = TypeOf<typeof CreateCartSchema>;
export type ReadCartSchemaType = TypeOf<typeof ReadCartSchema>;
export type UpdateCartSchemaType = TypeOf<typeof UpdateCartSchema>;
export type DeleteCartSchemaType = TypeOf<typeof DeleteCartSchema>;
