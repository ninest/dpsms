"use server";

import { redirectToLogin } from "@/app/toast-utils";
import { moversService } from "@/services/movers-service";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function becomeMoverForTenancyAction(formData: FormData) {
  const tenancyId = formData.get("tenancyId") as string;
  if (!tenancyId) throw new Error("No tenancyId provided");

  const { userId: clerkId } = auth();
  if (!clerkId) return redirectToLogin();

  await moversService.addMoverToTenancy(clerkId, tenancyId);
  revalidatePath("/profile/[profileId]");
}
