import { auth } from "@clerk/nextjs";
import { SignUpForm } from "./sign-up-form";
import { Title } from "@/components/typography/title";
import { redirect } from "next/navigation";
import { Spacer } from "@/components/spacer";

export default function Page() {
  const { userId: clerkId } = auth();
  if (clerkId) return redirect("/profile/edit");
  return (
    <>
      <Title level={1}>Sign Up</Title>

      <Spacer className="h-3" />

      <div className="max-w-[80ch]">
        <SignUpForm />
      </div>
    </>
  );
}
