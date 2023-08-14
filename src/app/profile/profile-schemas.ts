import { z } from "zod";

export const profileFormSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  address: z.string().trim().min(1),
  isActiveHost: z.boolean(),
});
export type ProfileFormData = z.infer<typeof profileFormSchema>;
