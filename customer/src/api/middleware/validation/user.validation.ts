import { object, string, TypeOf } from "zod";

const payload = {
  body: object({
    username: string({
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
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match!",
    path: ["confirmPassword"],
  }),
};

const params = {
  params: object({
    userId: string({
      required_error: "UserId is required!",
    }),
  }),
};

export const CreateUserSchema = object({ ...payload });
export const ReadUserSchema = object({ ...params });
export const UpdateUserSchema = object({ ...params, ...payload });
export const DeleteUserSchema = object({ ...params });

export type CreateUserSchemaType = Omit<
  TypeOf<typeof CreateUserSchema>,
  "body.confirmPassword"
>;
export type ReadUserSchemaType = TypeOf<typeof ReadUserSchema>;
export type UpdateUserSchemaType = TypeOf<typeof UpdateUserSchema>;
export type DeleteUserSchemaType = TypeOf<typeof DeleteUserSchema>;
