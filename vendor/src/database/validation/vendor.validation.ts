import { object, string, TypeOf, number, z, ZodAny, ZodObject } from "zod";

export const isValidObjectId = (value: string) =>
  /^[0-9a-fA-F]{24}$/.test(value);

const payload = {
  body: object({
    name: string({
      required_error: "Username is Required!",
    }),
    ownerName: string({
      required_error: "Username is Required!",
    }),
    about: string({
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
    pincode: string({
      required_error: "Pincode is Required!",
    }),
    phone: string({
      required_error: "Phone is Required!",
    }),
    workingHrs: z.object({
      workingDays: z.string().optional(),
      weekend: z.string().optional(),
    }),
    address: string().refine(isValidObjectId, {
      message: "Invalid address format",
    }),
    teamMember: string().refine(isValidObjectId, {
      message: "Invalid team member format",
    }),
    socialMedia: z.array(
      z
        .object({
          title: string(),
        })
        .optional()
    ),
    gallery: z.array(
      z.object({
        image: string(),
        cover: string(),
      })
    ),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match!",
    path: ["confirmPassword"],
  }),
};

const params = {
  params: object({
    vendorId: string({
      required_error: "Vendor's ID is required!",
    }),
  }),
};

export const CreateVendorSchema = object({ ...payload });
export const ReadVendorSchema = object({ ...params });
export const UpdateVendorSchema = object({ ...params, ...payload });

export type CreateVendorSchemaType = Omit<
  TypeOf<typeof CreateVendorSchema>,
  "body.confirmPassword"
>;
export type ReadVendorSchemaType = TypeOf<typeof ReadVendorSchema>;
export type UpdateVendorSchemaType = TypeOf<typeof UpdateVendorSchema>;
