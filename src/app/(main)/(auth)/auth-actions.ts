"use server";

import { usersService } from "@/services/users-service";
import { auth } from "@clerk/nextjs";

export async function finishSignUpAction() {
  const { userId: clerkId } = auth();
  if (!clerkId) throw new Error("No clerkId found");
  await usersService.createUser({ clerkId });
}

export async function loginAction() {
  const { userId: clerkId } = auth();
  if (!clerkId) throw new Error("No clerkId found");
  await usersService.getUserByClerkId(clerkId);
}
