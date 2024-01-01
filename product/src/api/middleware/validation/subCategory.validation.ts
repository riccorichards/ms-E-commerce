import { number, object, string, TypeOf } from "zod";

export const IncomingSubCatValidation = object({
  body: object({
    title: string({
      required_error: "Title is Required!",
    }).min(3, "Title must be at least 3 characters long"),
    desc: string({
      required_error: "Description is required!",
    }),
    mainCatId: number(),
  }),
});

//export const CreateSubCatType = {
//  ...IncomingSubCatValidation,
//  vendorId: string,
//};

export type IncomingSubCatValidationType = TypeOf<
  typeof IncomingSubCatValidation
>;
