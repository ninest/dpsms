"use server";

import { TenantRequestForm } from "@/app/(main)/hosts/[hostListingId]/tenant-schemas";
import { tenancyService } from "@/services/tenancy-service";
import { tenantsService } from "@/services/tenants-service";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function requestTenancyAction(hostListingId: string, params: TenantRequestForm) {
  const { userId: clerkId } = auth();
  if (!clerkId) return redirectToSignIn();

  await tenantsService.requestTenancy(clerkId, hostListingId, params);

  revalidatePath("/hosts/[hostListingId]");
}

export async function acceptTenancyRequestListingAction(formData: FormData) {
  const tenancyRequestListingId = formData.get("tenancyRequestListingId") as string;

  await tenantsService.acceptTenancy(tenancyRequestListingId);
  await tenancyService.createTenancy(tenancyRequestListingId);

  revalidatePath("/profile/[userId]");
  redirect("/profile");
}
