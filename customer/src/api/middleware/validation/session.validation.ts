import { TypeOf, object, string } from "zod";

const payload = {
  body: object({
    email: string({
      required_error: "Email is Required!",
    }).email("Invalid Email Format"),
    password: string({
      required_error: "Password is required!",
    }),
  }),
};

export const CreateSessionSchema = object({ ...payload });
