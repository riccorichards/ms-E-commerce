import { object, string, TypeOf } from "zod";

export const IncomingLoginData = object({
  body: object({
    email: string({
      required_error: "Description is required!",
    }).email("Invalid email format"),
    password: string().min(
      6,
      "Password is too short - Should be 6 chars minimum..."
    ),
  }),
});

export type IncomingLoginDataType = TypeOf<typeof IncomingLoginData>;
