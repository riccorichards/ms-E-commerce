import { object, string } from "zod";

export const CreateSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email is Required!",
    }).email("Invalid Email Format"),
    password: string({
      required_error: "Password is required!",
    }),
  }),
});
