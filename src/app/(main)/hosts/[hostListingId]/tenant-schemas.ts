import { z } from "zod";

export const tenantRequestFormSchema = z.object({
  itemsDescription: z.string().trim().min(1),
  sqft: z.coerce.number().min(1, "The square footage cannot be zero"),
  startTime: z.coerce.date(),
  duration: z.coerce.number().min(1, "The duration cannot be 0"),
});
export type TenantRequestForm = z.infer<typeof tenantRequestFormSchema>;
