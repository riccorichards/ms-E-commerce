import { object, string, number, TypeOf } from "zod";

export const IncomingDeliveryData = object({
  body: object({
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
    image: string({
      required_error: "Address is required!",
    }),
    currentAddress: string({
      required_error: "Address is required!",
    }),
  }),
});

export type IncomingDeliveryDataType = TypeOf<typeof IncomingDeliveryData>;

export const UpdateDeliveryData = object({
  body: object({
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
    image: string({
      required_error: "Address is required!",
    }).optional(),
    currentAddress: string({
      required_error: "Address is required!",
    }).optional(),
  }),
});

export type UpdateDeliveryDataType = TypeOf<typeof UpdateDeliveryData>;
