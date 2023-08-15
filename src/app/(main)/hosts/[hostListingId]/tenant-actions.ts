"use server";

import { TenantRequestForm } from "@/app/(main)/hosts/[hostListingId]/tenant-schemas";
import { tenantsService } from "@/services/tenants-service";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export async function requestTenancyAction(hostListingId: string, params: TenantRequestForm) {
  const { userId: clerkId } = auth();
  if (!clerkId) return redirectToSignIn();

  await tenantsService.requestTenancy(clerkId, hostListingId, params);

  revalidatePath("/hosts/[hostListingId]");
}
