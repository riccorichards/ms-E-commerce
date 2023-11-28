import { object, string, TypeOf, number } from "zod";

export const LoginValidation = object({
  email: string({
    required_error: "Description is required!",
  }).email("Invalid email format"),
  password: string().min(
    6,
    "Password is too short - Should be 6 chars minimum..."
  ),
});
