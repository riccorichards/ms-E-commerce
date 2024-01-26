import { object, string, TypeOf } from "zod";

const addressPayload = {
  body: object({
    address: string({
      required_error: "Address is required!",
    }),
  }),
};

export const CreateAddressSchema = object({
  ...addressPayload,
});

export const UpdateAddressSchema = object({
  ...addressPayload,
});

export type CreateAddressSchemaType = TypeOf<typeof CreateAddressSchema>;
export type UpdateAddressSchemaType = TypeOf<typeof UpdateAddressSchema>;
