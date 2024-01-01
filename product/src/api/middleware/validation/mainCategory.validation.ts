import { TypeOf, object, string } from "zod";

export const IncomingMainCatValidation = object({
  body: object({
    title: string({
      required_error: "Title is Required!",
    }).min(3, "Title must be at least 3 characters long"),
    desc: string({
      required_error: "Description is required!",
    }),
    image: string({
      required_error: "Image is required!",
    }),
  }),
});

export type IncomingMainCatValidationType = TypeOf<
  typeof IncomingMainCatValidation
>;
