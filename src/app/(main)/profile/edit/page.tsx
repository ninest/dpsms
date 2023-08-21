import { ProfileForm } from "@/app/(main)/profile/profile-form";
import { Spacer } from "@/components/spacer";
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
      <main>
        <Title level={1}>{!isProfileComplete ? `Complete your profile` : `${user.firstName}'s profile`}</Title>
        <Spacer className="h-4" />
        <ProfileForm initialProfile={user} />
      </main>
    </>
  );
}
