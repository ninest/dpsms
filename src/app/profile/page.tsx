import { ProfileForm } from "@/app/profile/profile-form";
import { Title } from "@/components/typography/title";
import { usersService } from "@/services/users-service";
import { auth, redirectToSignIn } from "@clerk/nextjs";

export default async function ProfilePage() {
  const { userId: clerkId } = auth();
  if (!clerkId) return redirectToSignIn();

  const user = await usersService.getUserByClerkId(clerkId);
  const isProfileComplete = await usersService.profileComplete(clerkId);

  return (
    <>
      <main className="p-3">
        <Title level={1}>{!isProfileComplete ? `Complete your profile` : `${user.firstName}'s profile`}</Title>
        <ProfileForm initialProfile={user} />
      </main>
    </>
  );
}
