"use server";

import { HostForm } from "@/app/(main)/new-host/host-schemas";
import { hostsService } from "@/services/hosts-service";
import { auth, redirectToSignIn } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function createHostListingAction(params: HostForm) {
  const { userId: clerkId } = auth();
  if (!clerkId) return redirectToSignIn();
  const newHostListing = await hostsService.createListing(clerkId, params);
  redirect(`/hosts/${newHostListing.id}`);
}

export async function acceptTenantRequestListingAction(formData: FormData) {
  const tenancyRequestListingId = formData.get("tenancyRequestListingId") as string;
  await hostsService.acceptTenancyRequestListing(tenancyRequestListingId);
  revalidatePath('/hosts/[hostId]')
}
