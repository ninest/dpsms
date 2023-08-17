import { usersService } from "@/services/users-service";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function ProfilePageRedirector() {
  const { userId: clerkId } = auth();

  const dbUser = await usersService.getUserByClerkId(clerkId);

  return redirect(`/profile/${dbUser.id}`);
}
