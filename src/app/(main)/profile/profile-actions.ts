"use server";

import { ProfileFormData, profileFormSchema } from "@/app/(main)/profile/profile-schemas";
import { usersService } from "@/services/users-service";
import { redirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(params: ProfileFormData) {
  profileFormSchema.parse(params);

  const { userId: clerkId } = auth();
  if (!clerkId) return redirectToSignIn();

  const dbUser = await usersService.getUserByClerkId(clerkId);
  await usersService.updateUser(dbUser.id, params);

  revalidatePath(`/profile`);
}
