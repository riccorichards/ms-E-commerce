import { number, object, string, TypeOf } from "zod";

const subCatPayload = {
  body: object({
    title: string({
      required_error: "Title is Required!",
    }).min(3, "Title must be at least 3 characters long"),
    desc: string({
      required_error: "Description is required!",
    }),
    mainCatId: number(),
  }),
};

const subCatParams = {
  params: object({
    _id: string({
      required_error: "Product's ID is Required!",
    }),
  }),
};

export const CreateSubCatSchema = object({ ...subCatPayload });
export const ReadSubCatSchema = object({ ...subCatParams });
export const UpdateSubCatSchema = object({
  ...subCatParams,
  ...subCatPayload,
});
export const DeleteSubCatSchema = object({ ...subCatParams });

export type CreateSubCatType = TypeOf<typeof CreateSubCatSchema>;
export type ReadSubCatType = TypeOf<typeof ReadSubCatSchema>;
export type UpdateSubCatType = TypeOf<typeof UpdateSubCatSchema>;
export type DeleteSubCatType = TypeOf<typeof DeleteSubCatSchema>;
