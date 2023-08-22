import { z } from "zod";

export const trustFormSchema = z.object({
  trustTarget: z.string().trim().min(1),
  trustAmount: z.coerce.number().int().min(0).max(100),
});
export type TrustFormData = z.infer<typeof trustFormSchema>;
