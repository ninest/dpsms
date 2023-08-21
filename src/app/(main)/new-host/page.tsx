import { HostForm } from "@/app/(main)/new-host/host-form";
import { Spacer } from "@/components/spacer";
import { Title } from "@/components/typography/title";
import { usersService } from "@/services/users-service";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function NewHostPage() {
  const { userId: clerkId } = auth();
  if (!clerkId) return redirectToSignIn();

  const isActiveHost = await usersService.isActiveHost(clerkId);
  if (!isActiveHost) return redirect("/profile");

  const { address } = await usersService.getUserByClerkId(clerkId);

  return (
    <>
      <Title level={1}>New host listing</Title>
      <Spacer className="h-4" />
      <div className="max-w-[80ch]">
        <HostForm defaultAddress={address} />
      </div>
    </>
  );
}
