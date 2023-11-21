import { object, string, TypeOf, number, z } from "zod";

const productPayload = {
  body: object({
    title: string({
      required_error: "Title is Required!",
    }).min(3, "Title must be at least 3 characters long"),
    desc: string({
      required_error: "Description is required!",
    }),
    image: string(),
    price: string({
      required_error: "Price is required!",
    }),
    discount: string(),
    subCatId: number(),
  }),
};

const productParams = {
  params: object({
    _id: string({
      required_error: "Product's ID is Required!",
    }),
  }),
};

export const CreateProductSchema = object({ ...productPayload });
export const ReadProductSchema = object({ ...productParams });
export const UpdateProductSchema = object({
  ...productParams,
  ...productPayload,
});
export const DeleteProductSchema = object({ ...productParams });

export type CreateProductType = TypeOf<typeof CreateProductSchema>;
export type ReadProductType = TypeOf<typeof ReadProductSchema>;
export type UpdateProductType = TypeOf<typeof UpdateProductSchema>;
export type DeleteProductType = TypeOf<typeof DeleteProductSchema>;
