import { auth } from "@clerk/nextjs";
import LoginForm from "./login-form";
import { redirect } from "next/navigation";
import { Title } from "@/components/typography/title";
import { Spacer } from "@/components/spacer";

export default function Page() {
  const { userId: clerkId } = auth();
  if (clerkId) return redirect("/");
  return (
    <>
      <Title level={1}>Login</Title>
      <Spacer className="h-3" />
      <div className="max-w-[80ch]">
        <LoginForm />
      </div>
    </>
  );
}
