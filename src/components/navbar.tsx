"use client";

import { cn } from "@/utils";
import { useClerk, useUser } from "@clerk/nextjs";
import { LucideRefrigerator, LucideSearch } from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";

export function Navbar() {
  const { user, isLoaded } = useUser();
  const isAuthenticated = !!user;

  const { signOut } = useClerk();

  return (
    <header className="flex items-center justify-between p-5 border-b">
      {/* Goody debugging, don't do this */}
      {/* {JSON.stringify({ user, isLoaded })} */}
      <Link href="/" className="font-extrabold flex items-center space-x-3">
        <LucideRefrigerator className="w-5 mr-2" />
        Home
        {/* DPSMS */}
      </Link>
      {isLoaded && (
        <nav>
          <ul className="flex items-center space-x-5">
            {isAuthenticated ? (
              <>
                <NavbarLink href="/search">
                  <LucideSearch className="w-5" />
                </NavbarLink>
                <NavbarLink href="/profile">
                  {user.firstName} {user.lastName}
                </NavbarLink>
                <button onClick={() => signOut()}>Sign out</button>
              </>
            ) : (
              <>
                <NavbarLink href="/sign-in" variant="primary">
                  Log in
                </NavbarLink>
                <NavbarLink href="/sign-up">Sign up</NavbarLink>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

interface NavbarLinkProps extends ComponentProps<"div"> {
  href: string;
  variant?: "default" | "primary";
}
function NavbarLink({ href, variant = "default", children }: NavbarLinkProps) {
  return (
    <li>
      <Link
        href={href}
        className={cn("block -mx-2 -my-0.5 px-2 py-0.5 rounded-md font-medium", {
          "hover:bg-gray-50": variant === "default",
          "bg-gray-900 text-gray-50 hover:bg-gray-900/90": variant === "primary",
        })}
      >
        {children}
      </Link>
    </li>
  );
}
