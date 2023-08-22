import { auth } from "@clerk/nextjs";
import { SignUpForm } from "./sign-up-form";
import { Title } from "@/components/typography/title";
import { redirect } from "next/navigation";

export default function Page() {
  const { userId: clerkId } = auth();
  if (clerkId) return redirect("/profile/edit");
  return (
    <>
      <Title level={1}>Sign Up</Title>
      <SignUpForm />
    </>
  );
}
