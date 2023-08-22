import { z } from "zod";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

export const authFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  verificationCode: z.string().regex(/^\d{6}$/),
});

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type LoginForm = z.infer<typeof loginFormSchema>;

export type AuthForm = z.infer<typeof authFormSchema>;
