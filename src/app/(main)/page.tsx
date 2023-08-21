import { auth } from "@clerk/nextjs";
import { Title } from "@/components/typography/title";
import { usersService } from "@/services/users-service";
import { ListingCard } from "@/components/ListingCard";
import { hostsService } from "@/services/hosts-service";
import { Spacer } from "@/components/spacer";

export default async function Home() {
  let welcomeMessage = "Welcome to DPSMS!";
  let dbUser;

  const { userId: clerkId } = auth();
  if (clerkId) {
    dbUser = await usersService.getUserByClerkId(clerkId);
    welcomeMessage = `Welcome back, ${dbUser.firstName}!`;
  }

  const listings = await hostsService.getHostListings();

  return (
    <main>
      <div className="flex items-center justify-center mb-4">
        <Title level={1}>{welcomeMessage}</Title>
      </div>
      {clerkId && (
        <div>
          <Title level={2}>My Something</Title>
        </div>
      )}

      <Spacer className="h-4" />

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
