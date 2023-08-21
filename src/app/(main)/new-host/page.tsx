import { HostForm } from "@/app/(main)/new-host/host-form";
import { ToastType, redirectToLogin, redirectWithToast } from "@/app/toast-utils";
import { Spacer } from "@/components/spacer";
import { Title } from "@/components/typography/title";
import { usersService } from "@/services/users-service";
import { auth } from "@clerk/nextjs";

export default async function NewHostPage() {
  const { userId: clerkId } = auth();
  if (!clerkId) {
    return redirectToLogin();
  }

  const isActiveHost = await usersService.isActiveHost(clerkId);
  if (!isActiveHost) {
    return redirectWithToast("/profile", ToastType.NOT_ACTIVE_HOST);
  }

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
