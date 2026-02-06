import { EMAIL_REGEX, PHONE_REGEX } from "@utils";
import { z } from "zod";

const identifierSchema = z
  .string()
  .trim()
  .refine((value) => EMAIL_REGEX.test(value) || PHONE_REGEX.test(value), {
    error: "Id must be a valid email or phone number",
  });

export const registerSchema = z.object({
  body: z.object({
    id: identifierSchema,
    password: z.string().min(6, "Password too weak"),
  }),
});
