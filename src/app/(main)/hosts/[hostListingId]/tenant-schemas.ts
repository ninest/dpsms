import { z } from "zod";

export const tenantRequestFormSchema = z.object({
  tenancyRequestId: z.string().optional(),
  itemsDescription: z.string().trim().min(1),
  sqft: z.coerce.number().min(1, "The square footage cannot be zero"),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});
export type TenantRequestForm = z.infer<typeof tenantRequestFormSchema>;
