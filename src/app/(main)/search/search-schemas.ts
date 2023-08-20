import { z } from "zod";
import { qualifiersEnumSchema, qualifiers } from "../new-host/host-schemas";

export const searchFormSchema = z.object({
    location: z.string().trim().min(1),
    qualifiers: z.array(qualifiersEnumSchema)
});
export type SearchFormData = z.infer<typeof searchFormSchema>;
export { qualifiers };
