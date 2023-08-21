import { acceptTenancyRequestListingAction } from "@/app/(main)/tenant-actions";
import { ListingCard } from "@/components/ListingCard";
import { Tenancy } from "@/components/Tenancy";
import { Empty } from "@/components/empty";
import { HostListing } from "@/components/host-listing";
import { Spacer } from "@/components/spacer";
import { Title } from "@/components/typography/title";
import { Button } from "@/components/ui/button";
import { tenancyService } from "@/services/tenancy-service";
import { usersService } from "@/services/users-service";
import { cn } from "@/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { LucideCheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: {
    userId: string;
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { userId: clerkId } = auth();
  // TODO: determine if this page is public
  if (!clerkId) return redirectToSignIn();

  const user = await usersService.getUserById(params.userId).catch(notFound);
  const hostListings = user.hostUser?.listings;

  const dbUser = await usersService.getUserByClerkId(clerkId);
  const isCurrentUsersPage = dbUser.id === params.userId;

  const tenancies = dbUser.tenancies;
  console.log(tenancies);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Title level={1}>
          {user.firstName} {user.lastName}
        </Title>
        <Button asChild variant={"secondary"}>
          <Link href={"/profile/edit"}>Edit profile</Link>
        </Button>
      </div>

      <Spacer className="h-4" />

      {!!hostListings?.length && (
        <>
          <div>
            <Title level={2}>My Host listings</Title>

            <Spacer className="h-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {hostListings.map((listing) => {
                const numTenantRequests = listing.tenantRequestListing.length;
                return (
                  <ListingCard
                    id={listing.id}
                    address={listing.address}
                    timings={listing.timings}
                    qualifiers={listing.qualifiers}
                    hostClerkId={listing.host.user.clerkId}
                    hostTrustedBy={listing.host.user.trustedBy.length}
                    sqft={listing.sqft}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}

      <Spacer className="h-6" />

      {isCurrentUsersPage && (
        <>
          <Title level={2}>My requests</Title>

          <Spacer className="h-3" />

          <div className="mb-4 space-y-2">
            {(!user.tenantUser || user.tenantUser?.requests.length === 0) && <Empty>No requests</Empty>}
            {user.tenantUser?.requests.map((request) => {
              return (
                <div key={request.id} className="border p-3 rounded bg-gray-100">
                  <div>
                    <div>
                      {request.itemsDescription} - {request.sqft}sqft
                    </div>

                    <div className="space-y-2">
                      {request.tenantRequestListing.map((trl) => {
                        return (
                          <div key={trl.id}>
                            <b>{trl.hostListing.address}</b>

                            <div>
                              <div className="flex items-center space-x-2">
                                <LucideCheckCircle2
                                  className={cn("text-gray-300", {
                                    "text-green-600": trl.hostAccepted,
                                  })}
                                />
                                {trl.hostAccepted ? "Host accepted" : "Host pending"}
                              </div>
                              <div className="flex items-center space-x-2">
                                <LucideCheckCircle2
                                  className={cn("text-gray-300", {
                                    "text-green-600": trl.tenantAccepted,
                                  })}
                                />
                                {trl.tenantAccepted ? "Host accepted" : "Tenant pending"}
                              </div>
                              {trl.hostAccepted && (
                                <form action={acceptTenancyRequestListingAction}>
                                  <input type="hidden" name="tenancyRequestListingId" value={trl.id} />
                                  <Button>Accept</Button>
                                </form>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!!tenancies && (
            <>
              <Title level={2}>My tenancies</Title>
              {tenancies.length == 0 ? (
                <>
                  <div>No tenancies</div>
                </>
              ) : (
                <>
                  <div className="mt-2 space-y-4">
                    {tenancies.map((t) => (
                      <Tenancy
                        id={t.id}
                        address={t.hostListing.address}
                        startTime={t.startTime}
                        endTime={t.endTime}
                        sqft={t.sqft}
                        itemsDescription={t.itemsDescription}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
