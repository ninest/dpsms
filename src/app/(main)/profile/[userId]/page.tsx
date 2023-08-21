import { roles } from "@/app/role-utils";
import { ListingCard } from "@/components/ListingCard";
import { Tenancy } from "@/components/Tenancy";
import { Empty } from "@/components/empty";
import { Spacer } from "@/components/spacer";
import { TenancyRequest } from "@/components/tenancy-request";
import { Title } from "@/components/typography/title";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tenancyService } from "@/services/tenancy-service";
import { usersService } from "@/services/users-service";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, ReactNode } from "react";

interface Props {
  children: ReactNode;
  params: {
    userId: string;
  };
}

export default async function UserProfilePage({ children, params }: Props) {
  // if (!params.tab) return redirect(`/profile`)

  const { userId: clerkId } = auth();
  // TODO: determine if this page is public
  if (!clerkId) return redirectToSignIn();

  const user = await usersService.getUserById(params.userId).catch(notFound);
  const hostListings = user.hostUser?.listings;

  const dbUser = await usersService.getUserByClerkId(clerkId);
  const isCurrentUsersPage = dbUser.id === params.userId;

  const tenancies = dbUser.tenancies;

  const allTenancies = await tenancyService.getTenancies();

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

      <Spacer className="h-2" />

      <Tabs defaultValue="host">
        <TabsList>
          {roles.map((role) => (
            <TabsTrigger key={role.slug} value={role.slug}>
              {role.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <Spacer className="h-2" />
        <TabsContent value="host">
          {!!hostListings?.length && (
            <>
              <div>
                <Title level={2}>My Host listings</Title>

                <Spacer className="h-2" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
                        numTenancyRequests={listing.tenantRequestListing.length}
                        numTenancies={listing.tenancy.length}
                      />
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </TabsContent>
        <TabsContent value="tenant">
          {isCurrentUsersPage && (
            <>
              <Title level={2}>My requests</Title>

              <Spacer className="h-3" />

              <div className="max-w-[80ch] grid grid-cols-1 gap-3">
                {(!user.tenantUser || user.tenantUser?.requests.length === 0) && <Empty>No requests</Empty>}

                {user.tenantUser?.requests.map((request) => {
                  return (
                    <Fragment key={request.id}>
                      {request.tenantRequestListing.map((trl) => {
                        return (
                          <Link href={`/hosts/${trl.hostListingId}`} className="block">
                            <TenancyRequest
                              key={trl.id}
                              request={{
                                id: trl.id,
                                address: trl.hostListing.address,
                                description: request.itemsDescription,
                                sqft: request.sqft,
                                hostAccepted: trl.hostAccepted,
                                tenantAccepted: trl.tenantAccepted,
                                startTime: trl.startTime,
                                endTime: trl.endTime,
                              }}
                            />
                          </Link>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </div>

              {!!tenancies && (
                <>
                  <Spacer className="h-6" />

                  <Title level={2}>My tenancies</Title>
                  <Spacer className="h-3" />
                  {tenancies.length == 0 ? (
                    <>
                      <Empty>No tenancies yet</Empty>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
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
        </TabsContent>
        <TabsContent value="mover">
          <Title level={2}>All tenancies</Title>
          <Spacer className="h-3" />
          {allTenancies.length == 0 ? (
            <>
              <Empty>No tenancies yet</Empty>
            </>
          ) : (
            <>
              <div className="max-w-[80ch] space-y-4">
                {allTenancies.map((t) => (
                  <div key={t.id}>
                    <Tenancy
                      id={t.id}
                      address={t.hostListing.address}
                      startTime={t.startTime}
                      endTime={t.endTime}
                      sqft={t.sqft}
                      itemsDescription={t.itemsDescription}
                      className="rounded-br-none"
                    />
                    <form className="flex justify-end">
                      <Button variant={"secondary"} size="sm" className="rounded-t-none">
                        Become a mover
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
