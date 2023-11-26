import { number, object, string, TypeOf } from "zod";

const addressPayload = {
  body: object({
    postalCode: string({
      required_error: "Postal code's id is required!",
    }),
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

const addressParams = {
  params: object({
    vendorId: string({
      required_error: "Vendor's ID is Required!",
    }),
  }),
};

export const CreateAddressSchema = object({
  ...addressPayload,
});
export const UpdateAddressSchema = object({
  ...addressParams,
  ...addressPayload,
});

export type CreateAddressSchemaType = TypeOf<typeof CreateAddressSchema>;
export type UpdateAddressSchemaType = TypeOf<typeof UpdateAddressSchema>;
