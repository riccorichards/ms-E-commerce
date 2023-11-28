import { object, string, TypeOf, number, z } from "zod";

export const IncomingProductValidation = object({
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
});
