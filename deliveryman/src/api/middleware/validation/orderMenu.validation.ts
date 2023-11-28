import { object, string, number, array } from "zod";

export const OrderMenuValidation = array(
  object({
    title: string({
      required_error: "Title is Required!",
    }).min(3, "Title must be at least 3 characters long"),
    price: string({
      required_error: "rating is required!",
    }),
    image: string(),
    unit: number(),
    orderId: number(),
  })
);
