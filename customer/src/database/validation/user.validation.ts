import mongoose from "mongoose";
import { object, string, TypeOf, number, z } from "zod";

const objectId = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid ObjectId",
  });

const payload = {
  body: object({
    username: string({
      required_error: "Username is Required!",
    }),
    email: string({
      required_error: "Email is Required!",
    }).email("Invalid email format!"),
    password: string({
      required_error: "Password is Required!",
    }).min(8, "Password is too short - Should be 8 chars minimum..."),
    confirmPassword: string({
      required_error: "Confirm password is Required!",
    }),
    balance: number()
      .int("Balance must be an integer")
      .min(10, "Account creation requires a minimum balance of $10 or more"),
    debit_card: string({
      required_error: "Debit_card is Required!",
    }),
    address: z.array(objectId),
    wishlist: z.array(objectId),
    cart: z.array(objectId),
    order: z.array(objectId),
    productReview: z.array(objectId),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match!",
    path: ["confirmPassword"],
  }),
};

const params = {
  params: object({
    userId: string({
      required_error: "UserId is required!",
    }),
  }),
};

export const CreateUserSchema = object({ ...payload });
export const ReadUserSchema = object({ ...params });
export const UpdateUserSchema = object({ ...params, ...payload });
export const DeleteUserSchema = object({ ...params });

export type CreateUserSchemaType = Omit<
  TypeOf<typeof CreateUserSchema>,
  "body.confirmPassword"
>;
export type ReadUserSchemaType = TypeOf<typeof ReadUserSchema>;
export type UpdateUserSchemaType = TypeOf<typeof UpdateUserSchema>;
export type DeleteUserSchemaType = TypeOf<typeof DeleteUserSchema>;
