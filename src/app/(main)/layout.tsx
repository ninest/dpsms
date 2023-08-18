import { Navbar } from "@/components/navbar";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  // const { userId: clerkId } = auth();
  // if (!clerkId) return redirectToSignIn();

  // const isProfileComplete = await usersService.profileComplete(clerkId);
  // if (!isProfileComplete) return redirect("/profile");

  return (
    <>
      <Navbar />
      <main className="p-5">{children}</main>
    </>
  );
}
