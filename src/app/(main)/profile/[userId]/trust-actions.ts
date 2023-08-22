"use server";

import { TrustFormData, trustFormSchema } from "@/app/(main)/profile/[userId]/trust-schemas";
import { usersService } from "@/services/users-service";
import { redirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function updateTrustAction(params: TrustFormData) {
  trustFormSchema.parse(params);
  const { userId: clerkId } = auth();
  if (!clerkId) return redirectToSignIn();
  const dbUser = await usersService.getUserByClerkId(clerkId);
  usersService.updateTrust(dbUser.id, params.trustTarget, params.trustAmount);
  redirect(`/profile/${params.trustTarget}`);
}
