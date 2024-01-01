import { object, string, TypeOf } from "zod";

export const isValidObjectId = (value: string) =>
  /^[0-9a-fA-F]{24}$/.test(value);

export const CreateVendorSchema = object({
  body: object({
    name: string({
      required_error: "Username is Required!",
    }),
    ownerName: string().optional(),
    image: string({
      required_error: "Image is Required!",
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
    pincode: string({
      required_error: "Pincode is Required!",
    }),
    phone: string({
      required_error: "Phone is Required!",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match!",
    path: ["confirmPassword"],
  }),
});

export type CreateVendorSchemaType = Omit<
  TypeOf<typeof CreateVendorSchema>,
  "body.confirmPassword"
>;

export const UpdateVendorSchema = object({
  body: object({
    name: string({
      required_error: "Username is Required!",
    }).optional(),
    email: string({
      required_error: "Email is Required!",
    })
      .email("Invalid email format!")
      .optional(),
    pincode: string({
      required_error: "Pincode is Required!",
    }).optional(),
    phone: string({
      required_error: "Phone is Required!",
    }).optional(),
  }),
});

export type UpdateVendorSchemaType = TypeOf<typeof UpdateVendorSchema>;
