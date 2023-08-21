import { auth } from "@clerk/nextjs";
import { Title } from "@/components/typography/title";
import { usersService } from "@/services/users-service";
import { ListingCard } from "@/components/ListingCard";
import { hostsService } from "@/services/hosts-service";
import { Spacer } from "@/components/spacer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  let welcomeMessage = "Welcome to DPSMS!";
  let dbUser;

  const { userId: clerkId } = auth();
  const isAuthenticated = !!clerkId;
  if (clerkId) {
    dbUser = await usersService.getUserByClerkId(clerkId);
    welcomeMessage = `Welcome back, ${dbUser.firstName}!`;
  }

  const listings = await hostsService.getHostListings();

  const isProfileComplete = clerkId ? await usersService.profileComplete(clerkId) : false;
  const isActiveHost = clerkId ? await usersService.isActiveHost(clerkId) : false;

  return (
    <main>
      {/* <div className="flex items-center justify-center mb-4">
        <Title level={1}>{welcomeMessage}</Title>
      </div> */}
      <div className=" border rounded-md p-6">
        <h1 className="font-semibold text-2xl">DPSMS</h1>
        <Spacer className="h-2" />
        <div className="space-y-1">
          <p>A decentralized storage network designed to store your stuff.</p>
          {isAuthenticated ? (
            <>
              {!isProfileComplete && (
                <Link href={"/profile"} className="text-gray-500 text-sm">
                  Your profile is incomplete. Go to your <span className="underline">profile page</span> to complete it!
                </Link>
              )}
              {isActiveHost ? (
                <>
                  <Spacer className="h-2" />
                  <Button asChild className="w-full">
                    <Link href={"new-host"}>New Host Listing</Link>
                  </Button>
                </>
              ) : (
                <p className="text-gray-500 text-sm">
                  You are not a host. To create a host listing, go to your{" "}
                  <span className="underline">profile page</span> and become an active host.
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-gray-500 text-sm">
                You are currently not logged in.{" "}
                <span className="text-gray-700">
                  <Link href={"/sign-in"} className="underline">
                    Log in
                  </Link>
                  {"  "}
                  <Link href={"/sign-up"} className="underline">
                    Sign up
                  </Link>
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      <Spacer className="h-6" />

      <div>
        <Title level={2}>Listings</Title>

        <Spacer className="h-2" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {listings.map((listing) => {
            return (
              <div key={listing.id}>
                <ListingCard
                  id={listing.id}
                  address={listing.address}
                  hostClerkId={listing.host.user.clerkId}
                  hostTrustedBy={listing.host.user.trustedBy.length}
                  sqft={listing.sqft}
                  timings={listing.timings}
                  qualifiers={listing.qualifiers}
                />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
