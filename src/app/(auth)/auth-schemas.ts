import { z } from "zod";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

export const authFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type AuthForm = z.infer<typeof authFormSchema>;
