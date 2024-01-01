import { object, string, TypeOf } from "zod";

const teamPayload = {
  body: object({
    name: string({
      required_error: "Name is required!",
    }),
    description: string({
      required_error: "Description is required!",
    }),
    image: string({
      required_error: "Image is required!",
    }),
    position: string({
      required_error: "Position is required!",
    }),
  }),
};

export const CreateTeamMemberSchema = object({ ...teamPayload });
export const UpdateTeamMemberSchema = object({
  ...teamPayload,
});

export type CreateTeamMemberSchemaType = TypeOf<typeof CreateTeamMemberSchema>;
export type UpdateTeamMemberSchemaType = TypeOf<typeof UpdateTeamMemberSchema>;
