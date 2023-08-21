import { usersService } from "@/services/users-service";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function ProfilePageRedirector({ searchParams }: { searchParams: any }) {
  const { userId: clerkId } = auth();
  if (!clerkId) return redirectToSignIn();

  const dbUser = await usersService.getUserByClerkId(clerkId);

  return redirect(`/profile/${dbUser.id}?${new URLSearchParams(searchParams)}`);
}
