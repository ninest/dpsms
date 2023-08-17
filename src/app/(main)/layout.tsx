import { Navbar } from "@/components/navbar";
import { usersService } from "@/services/users-service";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const { userId: clerkId } = auth();
  if (!clerkId) return redirect("/");

  const isProfileComplete = await usersService.profileComplete(clerkId);
  if (!isProfileComplete) return redirect("/profile");

  return (
    <>
      <Navbar />
      <main className="p-5">{children}</main>
    </>
  );
}
