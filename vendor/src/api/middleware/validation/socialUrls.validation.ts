import { TypeOf, object, string } from "zod";

export const SocialMediaSchema = object({
  body: object({
    url: string({
      required_error: "URL is required",
    }).url("Invalid URL format"),
  }),
});

export type AddSocialUrlType = TypeOf<typeof SocialMediaSchema>;
