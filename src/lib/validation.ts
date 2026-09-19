import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email().max(200).toLowerCase(),
  password: z.string().min(1).max(200),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200).toLowerCase(),
  orgName: z.string().trim().min(2).max(160),
  password: z
    .string()
    .min(10, "Use at least 10 characters")
    .max(200),
  acceptTerms: z.literal(true),
});

/** Turns a ZodError into a field -> message map the forms can render inline. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
