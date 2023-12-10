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
    street: string({
      required_error: "Street is required!",
    }),
    postalCode: string().min(6, "Postal code should be consist 6 char"),
    city: string({
      required_error: "City is required!",
    }),
    country: string({
      required_error: "Street is required!",
    }),
  }),
};

const params = {
  params: object({
    _id: string({
      required_error: "Address's ID is Required!",
    }),
  }),
};

export const CreateAddressSchema = object({ ...payload });
export const UpdateAddressSchema = object({
  ...params,
  ...payload,
});
