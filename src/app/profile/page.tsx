import { ProfileForm } from "@/app/profile/profile-form";
import { usersService } from "@/services/users-service";
import { auth, redirectToSignIn } from "@clerk/nextjs";

export default async function ProfilePage() {
  const { userId: clerkId } = auth();
  if (!clerkId) return redirectToSignIn();

  const user = await usersService.getUserByClerkId(clerkId);
  const hasName = !!user.firstName;

  return (
    <>
      <main className="p-3">
        <h1 className="mb-2">{hasName ? `${user.firstName}'s` : "Your"} Profile</h1>
        <ProfileForm initialProfile={user} />
      </main>
    </>
  );
}
