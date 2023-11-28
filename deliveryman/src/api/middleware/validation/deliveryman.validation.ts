import { object, string, number } from "zod";

export const IncomingDeliveryData = object({
  name: string({
    required_error: "Name is Required!",
  }).min(3, "Title must be at least 3 characters long"),
  email: string({
    required_error: "Description is required!",
  }).email("Invalid email format"),
  password: string().min(
    6,
    "Password is too short - Should be 6 chars minimum..."
  ),
  rating: number({
    required_error: "rating is required!",
  }),
  orderAmount: number({
    required_error: "Order amount is required!",
  }),
  image: string(),
  reviewAmount: number(),
  totalEarn: string(),
  lat: number(),
  lng: number(),
});

export const UpdateDeliveryValidation = object({
  name: string({
    required_error: "Name is Required!",
  })
    .min(3, "Title must be at least 3 characters long")
    .optional(),
  email: string({
    required_error: "Description is required!",
  })
    .email("Invalid email format")
    .optional(),
  password: string()
    .min(6, "Password is too short - Should be 6 chars minimum...")
    .optional(),
  rating: number({
    required_error: "rating is required!",
  }).optional(),
  orderAmount: number({
    required_error: "Order amount is required!",
  }).optional(),
  image: string().optional(),
  reviewAmount: number().optional(),
  totalEarn: string().optional(),
  lat: number().optional(),
  lng: number().optional(),
});
