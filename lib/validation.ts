import { z } from "zod";

export const UserFormValidation = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters and should not be one of the commonly used password"
    )
    .max(256, "Password must be at most 256 characters"),
});
