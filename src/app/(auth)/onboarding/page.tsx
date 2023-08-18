import { usersService } from "@/services/users-service";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function OnboardingRedirect() {
  const { userId: clerkId } = auth();
  if (!clerkId) return redirectToSignIn();

  // fetch guarantees upsert immediately after sign up
  const {} = await usersService.getUserByClerkId(clerkId);

  const profileComplete = await usersService.profileComplete(clerkId);
  return profileComplete ? redirect("/") : redirect("/profile/edit");
}
