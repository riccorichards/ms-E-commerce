import { object, string, TypeOf } from "zod";

const mainCatPayload = {
  body: object({
    title: string({
      required_error: "Title is Required!",
    }).min(3, "Title must be at least 3 characters long"),
    desc: string({
      required_error: "Description is required!",
    }),
  }),
};

const mainCatParams = {
  params: object({
    _id: string({
      required_error: "Main category's ID is Required!",
    }),
  }),
};

export const CreateMainCatSchema = object({ ...mainCatPayload });
export const ReadMainCatSchema = object({ ...mainCatParams });
export const UpdateMainCatSchema = object({
  ...mainCatParams,
  ...mainCatPayload,
});
export const DeleteMainCatSchema = object({ ...mainCatParams });

export type CreateMainCatType = TypeOf<typeof CreateMainCatSchema>;
export type ReadMainCatType = TypeOf<typeof ReadMainCatSchema>;
export type UpdateMainCatType = TypeOf<typeof UpdateMainCatSchema>;
export type DeleteMainCatType = TypeOf<typeof DeleteMainCatSchema>;
