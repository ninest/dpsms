"use server"

import { moversService } from "@/services/movers-service";
import { auth, redirectToSignIn } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function becomeMoverForTenancyAction(formData: FormData) {
  const tenancyId = formData.get("tenancyId") as string;
  if (!tenancyId) throw new Error("No tenancyId provided");

  const { userId: clerkId } = auth();
  if (!clerkId) return redirectToSignIn();

  await moversService.addMoverToTenancy(clerkId, tenancyId);
  revalidatePath("/profile/[profileId]");
}
