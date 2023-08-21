import { auth } from "@clerk/nextjs";
import { Title } from "@/components/typography/title";
import { usersService } from "@/services/users-service";
import { ListingCard } from "@/components/ListingCard";
import { hostsService } from "@/services/hosts-service";

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
      <div>
        <Title level={2}>Listings</Title>
        <div className="flex flex-row flex-wrap">
          {listings.map((listing) => {
            return (
              <div key={listing.id} className="m-2">
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
