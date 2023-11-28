import { object, string, number, boolean } from "zod";

export const OrderValidation = object({
  deliveryTime: string({
    required_error: "Name is Required!",
  }).min(3, "Title must be at least 3 characters long"),
  distance: string({
    required_error: "Description is required!",
  }),
  paymentMethod: string({
    required_error: "Payment method is required!",
  }),
  totalAmount: string({
    required_error: "total amount is required!",
  }),
  confirmationStatus: boolean({
    required_error: "Confimation answer is required!",
  }),
  deliveryId: number({
    required_error: "Delivery's id is required!",
  }),
});
