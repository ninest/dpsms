import { z } from "zod";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);
const nameSchema = z.string().trim();

export const signUpFormSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  password: passwordSchema,
});
export type SignUpForm = z.infer<typeof signUpFormSchema>;

export const signInFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type SignInForm = z.infer<typeof signInFormSchema>;
