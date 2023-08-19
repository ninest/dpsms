import { currentUser } from "@clerk/nextjs";
import { LucideSearch } from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";

export async function Navbar() {
  const user = await currentUser();
  const isAuthenticated = !!user;

  return (
    <header className="flex items-center justify-between p-5 border-b">
      <Link className="font-extrabold" href="/">
        DPSMS
      </Link>
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
            </>
          ) : (
            <>
              <NavbarLink href="/sign-in">Log in</NavbarLink>
              <NavbarLink href="/sign-up">Sign up</NavbarLink>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

interface NavbarLinkProps extends ComponentProps<"div"> {
  href: string;
}
function NavbarLink({ href, children }: NavbarLinkProps) {
  return (
    <li>
      <Link href={href} className="block">
        {children}
      </Link>
    </li>
  );
}
