import mongoose from "mongoose";
import { object, string, TypeOf, z } from "zod";

const objectId = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid ObjectId",
  });

const payload = {
  body: object({
    userId: string(objectId),
    balance: string().optional(),
    debit_card: string().min(16, "Debit Card should be consist 6 char"),
    bankOf: string({
      required_error: "Bank name is required!",
    }),
  }),
};

const params = {
  params: object({
    _id: string({
      required_error: "Bank's ID is Required!",
    }),
  }),
};

export const CreateBankAccSchema = object({ ...payload });
export const UpdateBankAccSchema = object({
  ...params,
  ...payload,
});
