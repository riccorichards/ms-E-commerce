import { number, object, string, TypeOf } from "zod";

const addressPayload = {
  body: object({
    postalCode: string({
      required_error: "Postal code's id is required!",
    }).length(6, "Postal code's length should be 6"),
    street: string({
      required_error: "treet is required!",
    }),
    city: string({
      required_error: "City is required!",
    }),
    country: string({
      required_error: "Country is required!",
    }),
    lat: number().optional(),
    lng: number().optional(),
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
