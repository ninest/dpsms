import { z } from "zod";

export const tenantRequestFormSchema = z
  .object({
    tenancyRequestId: z.string().optional(),
    itemsDescription: z.string().trim().min(1),
    sqft: z.coerce.number().min(1, "The square footage cannot be zero"),
    startTime: z.coerce.date().refine((data) => data > new Date(), { message: "Start time must be in the future" }),
    endTime: z.coerce.date(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "The start time must be before the end time",
    path: ["endTime"],
  });
export type TenantRequestForm = z.infer<typeof tenantRequestFormSchema>;
