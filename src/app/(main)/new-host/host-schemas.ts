import { z } from "zod";

export const qualifiers = [
  "Has air conditioning",
  "Is dry",
  "Allows wet items",
  "Allows perishables",
  "Has sunlight",
  "Has elevator",
  "Has security",
  "Is locked",
  "Can self access",
] as const;
const qualifiersEnumSchema = z.enum(qualifiers);

export const hostFormSchema = z.object({
  timings: z.string().trim().min(1),
  sqft: z.coerce.number().min(1, "The square footage cannot be zero"),
  sizeDescription: z.string().optional(),
  qualifiers: z.array(qualifiersEnumSchema),
  image: z.string().url().optional().or(z.literal("")),
  address: z.string().trim().min(1),
});
export type HostForm = z.infer<typeof hostFormSchema>;
