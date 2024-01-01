import { TypeOf, object, string } from "zod";

export const BioValidation = object({
  body: object({
    bio: string()
      .min(3, { message: "Bio should be at least 3 chars" })
      .max(150, { message: "Bio's max amount is 150 chars" })
      .trim(),
  }),
});

export type BioValidationType = TypeOf<typeof BioValidation>;

export const workingDaysValidation = object({
  body: object({
    workingDays: string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid Time Format")
      .trim(),
    weekend: string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid Time Format")
      .trim(),
  }),
});

export type workingDaysValidationType = TypeOf<typeof workingDaysValidation>;
