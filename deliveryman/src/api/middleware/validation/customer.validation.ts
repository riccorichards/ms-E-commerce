import { object, string, number } from "zod";

export const CustomerValidation = object({
  name: string({
    required_error: "Name is Required!",
  }).min(3, "Title must be at least 3 characters long"),
  image: string(),
  orderId: number(),
});
