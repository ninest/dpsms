import { auth } from "@clerk/nextjs";
import { Title } from "@/components/typography/title";
import { usersService } from "@/services/users-service";
import { ListingCard } from "@/components/ListingCard";
import { hostsService } from "@/services/hosts-service";
import { Spacer } from "@/components/spacer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import { Tenancy } from "@/components/Tenancy";

export default async function Home() {
  let dbUser;

  const { userId: clerkId } = auth();
  const isAuthenticated = !!clerkId;
  if (clerkId) {
    dbUser = await usersService.getUserByClerkId(clerkId);
  }

  const listings = await hostsService.getHostListings();
  const tenancies = dbUser?.tenancies || [];

  const isProfileComplete = clerkId ? await usersService.profileComplete(clerkId) : false;
  const isActiveHost = clerkId ? await usersService.isActiveHost(clerkId) : false;

  const hostListingButton = (
    <Button asChild className="w-full lg:w-auto">
      <Link href={"/new-host"}>New Host Listing</Link>
    </Button>
  );

  return (
    <main>
      <div className="border rounded-md p-6">
        <div className="lg:flex justify-between align-top">
          <div>
            <h1 className="font-semibold text-2xl">DPSMS</h1>
            <Spacer className="h-2" />
            <div className="space-y-1">
              <p>A decentralized storage network designed to store your stuff.</p>
              {isAuthenticated ? (
                <>
                  {!isProfileComplete && (
                    <p>
                      <Link href={"/profile"} className="text-gray-500 text-sm">
                        Your profile is incomplete. Go to your <span className="underline">profile page</span> to
                        complete it!
                      </Link>
                    </p>
                  )}
                  {isActiveHost ? (
                    <div className="lg:hidden">
                      <Spacer className="h-2" />
                      {hostListingButton}
                    </div>
                  ) : (
                    <p>
                      <Link href={"/profile"} className="text-gray-500 text-sm">
                        You are not a host. To create a host listing, go to your{" "}
                        <span className="underline">profile page</span> and become an active host.
                      </Link>
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
          <div className="hidden lg:block">{hostListingButton}</div>
        </div>
      </div>

      <Spacer className="h-4" />

      {isAuthenticated && tenancies.length > 0 && (
        <div>
          <Title level={2}>My Tenancies</Title>

          <Spacer className="h-2" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {tenancies.map((tenancy) => {
              return (
                <div key={tenancy.id}>
                  <Tenancy
                    id={tenancy.id}
                    hostListingId={tenancy.hostListingId}
                    tenantUserId={tenancy.tenant.userId}
                    address={tenancy.hostListing.address}
                    startTime={tenancy.startTime}
                    endTime={tenancy.endTime}
                    sqft={tenancy.sqft}
                    itemsDescription={tenancy.itemsDescription}
                    movers={tenancy.moverUsers.map((mover) => mover.userId)}
                  />
                </div>
              );
            })}
          </div>

          <Spacer className="h-4" />
        </div>
      )}

      <div>
        <Title level={2}>Listings</Title>

        <Spacer className="h-2" />

        {listings.length === 0 ? (
          <Empty>No host listings</Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {listings.map((listing) => {
              return (
                <div key={listing.id}>
                  <ListingCard
                    id={listing.id}
                    address={listing.address}
                    hostClerkId={listing.host.user.clerkId}
                    hostTrustedBy={listing.host.user.trustScore}
                    sqft={listing.sqft}
                    timings={listing.timings}
                    qualifiers={listing.qualifiers}
                    numTenancyRequests={listing.tenantRequestListing.length}
                    numTenancies={listing.tenancy.length}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
