import { acceptTenancyRequestListingAction } from "@/app/(main)/tenant-actions";
import { Title } from "@/components/typography/title";
import { Button } from "@/components/ui/button";
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

      {!!hostListings?.length && (
        <>
          <div>
            <Title level={2}>Host listings</Title>

            <div className="">
              {hostListings.map((listing) => {
                const numTenantRequests = listing.tenantRequestListing.length;
                return (
                  <Link key={listing.id} href={`/hosts/${listing.id}`} className="block border bg-gray-100 rounded p-3">
                    <b>{user.address}</b>
                    <div>Available: {listing.timings}</div>
                    <div>
                      {listing.sizeDescription} {listing.sqft}sqft
                    </div>
                    <div>{listing.qualifiers}</div>
                    <div>{numTenantRequests} tenants have requested</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {isCurrentUsersPage && (
        <>
          <Title level={2}>My requests</Title>

          <div className="mb-4 space-y-2">
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

          <Title level={2}>My tenancies</Title>
        </>
      )}
    </>
  );
}
