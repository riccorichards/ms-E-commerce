import { object, string, TypeOf, number } from "zod";

export const IncomingProductValidation = object({
  body: object({
    title: string({
      required_error: "Title is Required!",
    }).min(3, "Title must be at least 3 characters long"),
    desc: string({
      required_error: "Description is required!",
    }),
    image: string(),
    vendor_name: string(),
    address: string(),
    vendor_rating: number(),
    price: string({
      required_error: "Price is required!",
    }),
    discount: string(),
    subCatId: number(),
  }),
});

export type IncomingProductType = TypeOf<typeof IncomingProductValidation>;

export const IncomingProductUpdateValidation = object({
  body: object({
    title: string({
      required_error: "Title is Required!",
    })
      .min(3, "Title must be at least 3 characters long")
      .optional(),
    desc: string({
      required_error: "Description is required!",
    }).optional(),
    image: string().optional(),
    price: string({
      required_error: "Price is required!",
    }).optional(),
    discount: string().optional(),
    subCatId: number().optional(),
  }),
});

export type IncomingProductUpdateValidationType = TypeOf<
  typeof IncomingProductUpdateValidation
>;
