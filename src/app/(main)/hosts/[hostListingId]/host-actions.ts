"use server";

import { hostsService } from "@/services/hosts-service";
import { revalidatePath } from "next/cache";

export async function acceptTenantRequestListingAction(formData: FormData) {
  const tenancyRequestListingId = formData.get("tenancyRequestListingId") as string;
  await hostsService.acceptTenancyRequestListing(tenancyRequestListingId);
  revalidatePath('/hosts/[hostId]')
}
