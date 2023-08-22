import { becomeMoverForTenancyAction } from "@/app/mover-actions";
import { roles } from "@/app/role-utils";
import { ListingCard } from "@/components/ListingCard";
import { ProfileCard } from "@/components/ProfileCard";
import { Tenancy } from "@/components/Tenancy";
import { Empty } from "@/components/empty";
import { Spacer } from "@/components/spacer";
import { TenancyRequest } from "@/components/tenancy-request";
import { Title } from "@/components/typography/title";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { moversService } from "@/services/movers-service";
import { tenancyService } from "@/services/tenancy-service";
import { usersService } from "@/services/users-service";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, ReactNode } from "react";
import TrustForm, { TrustCreateForm } from "./trust-forms";
import { Card } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  params: {
    userId: string;
  };
}

export default async function UserProfilePage({ children, params }: Props) {
  // if (!params.tab) return redirect(`/profile`)

  const { userId: clerkId } = auth();
  const isAuthed = !!clerkId;
  // TODO: determine if this page is public
  // if (!clerkId) return redirectToSignIn();

  const user = await usersService.getUserById(params.userId).catch(notFound);
  const hostListings = user.hostUser?.listings;

  const isCurrentUsersPage = clerkId === user.clerkId;

  const tenancies = user.tenancies;

  // Filter out tenancies I am already helping move
  const allTenancies = (await tenancyService.getTenancies()).filter((t) => {
    const inMoverUser = t.moverUsers.some((u) => u.user.clerkId === user.clerkId);
    return !inMoverUser;
  });

  const moverUserTenancies = await moversService.getMoverTenancies(user.clerkId);

  const isActiveHost = await usersService.isActiveHost(user.clerkId);
  const trustInfo = await usersService.getTrustInfo(user.id);
  const youTrust = trustInfo.trustedBy.some((t) => t.truster.clerkId === clerkId);
  const otherTrusts = trustInfo.trustedBy.filter((t) => t.truster.clerkId !== clerkId).length;

  let defaultActiveTab = isActiveHost ? "host" : "tenant";
  if (!isAuthed) defaultActiveTab = "host";

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Title level={1}>
          {user.firstName} {user.lastName}
        </Title>
        {isCurrentUsersPage && (
          <Button asChild variant={"secondary"}>
            <Link href={"/profile/edit"}>Edit profile</Link>
          </Button>
        )}
      </div>

      {isCurrentUsersPage ? (
        <>
          <Spacer className="h-2" />
          <Tabs defaultValue={defaultActiveTab}>
            <TabsList>
              {roles.map((role) => (
                <TabsTrigger key={role.slug} value={role.slug}>
                  {role.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <Spacer className="h-2" />
            <TabsContent value="host">
              {isAuthed && (
                <>
                  {!isActiveHost && (
                    <>
                      <p>
                        <Link href={`/profile/edit`}>
                          You are not an active host. To become a host, please change your settings on the{" "}
                          <span className="underline">edit profile page</span>.
                        </Link>
                      </p>
                      <Spacer className="h-3" />
                    </>
                  )}
                </>
              )}
              {!!hostListings?.length && (
                <>
                  <div>
                    <Title level={2}>Host listings</Title>

                    <Spacer className="h-2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {hostListings.map((listing) => {
                        return (
                          <ListingCard
                            key={listing.id}
                            id={listing.id}
                            address={listing.address}
                            timings={listing.timings}
                            qualifiers={listing.qualifiers}
                            hostClerkId={listing.host.user.clerkId}
                            hostTrustedBy={listing.host.user.trustScore}
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
              {!isAuthed && (
                <>
                  <p>
                    <Link href="/sign-in">
                      Please <span className="underline">sign in</span> to view this.
                    </Link>
                  </p>
                  <Spacer className="h-3" />
                </>
              )}
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
                              <Link key={trl.id} href={`/hosts/${trl.hostListingId}`} className="block">
                                <TenancyRequest
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
                      <div className="max-w-[80ch]">
                        {tenancies.length == 0 ? (
                          <>
                            <Empty>No tenancies to help move</Empty>
                          </>
                        ) : (
                          <>
                            <div className="space-y-4">
                              {tenancies.map((t) => (
                                <Tenancy
                                  key={t.id}
                                  id={t.id}
                                  address={t.hostListing.address}
                                  startTime={t.startTime}
                                  endTime={t.endTime}
                                  sqft={t.sqft}
                                  itemsDescription={t.itemsDescription}
                                  movers={t.moverUsers.map((mu) => mu.userId)}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </TabsContent>
            <TabsContent value="mover">
              <Title level={2}>Tenancies I&apos;m helping move</Title>
              <Spacer className="h-3" />

              <div className="max-w-[80ch]">
                {!isAuthed && (
                  <>
                    <p>
                      <Link href="/sign-in">
                        Please <span className="underline">sign in</span> to view this.
                      </Link>
                    </p>
                    <Spacer className="h-3" />
                  </>
                )}
                {moverUserTenancies?.length == 0 ? (
                  <>
                    <Empty>No tenancies yet</Empty>
                  </>
                ) : (
                  <>
                    <div className="max-w-[80ch] space-y-4">
                      {moverUserTenancies?.map((t) => (
                        <Tenancy
                          key={t.id}
                          id={t.id}
                          address={t.hostListing.address}
                          startTime={t.startTime}
                          endTime={t.endTime}
                          sqft={t.sqft}
                          itemsDescription={t.itemsDescription}
                          movers={t.moverUsers.map((mu) => mu.userId)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <Spacer className="h-6" />

              <Title level={2}>All tenancies</Title>
              <Spacer className="h-3" />

              <div className="max-w-[80ch]">
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
                            movers={t.moverUsers.map((mu) => mu.userId)}
                            className="rounded-br-none"
                          />
                          <form action={becomeMoverForTenancyAction} className="flex justify-end">
                            <input type="hidden" name="tenancyId" value={t.id} />
                            <Button variant={"secondary"} size="sm" className="rounded-t-none">
                              Become a mover
                            </Button>
                          </form>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            <TabsContent value="trust">
              <Title level={2}>Trusted by</Title>
              <Spacer className="h-3" />
              {trustInfo.trustedBy.length === 0 ? (
                <Empty>No one trusts you yet</Empty>
              ) : (
                <>
                  {trustInfo.trustedBy.length} people trust you on average {""}
                  {trustInfo.trustedBy.reduce((a, b) => a + b.amountPercent, 0) / trustInfo.trustedBy.length}%
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {trustInfo.trustedBy.map((t) => (
                      <ProfileCard
                        key={t.id}
                        id={t.trusterId}
                        firstName={t.truster.firstName ?? ""}
                        lastName={t.truster.lastName ?? ""}
                        trustPercent={t.amountPercent}
                      />
                    ))}
                  </div>
                </>
              )}
              <Spacer className="h-6" />
              <Title level={2}>Trusting</Title>
              <Spacer className="h-3" />
              {trustInfo.trusting.length === 0 ? (
                <Empty>You trust no one</Empty>
              ) : (
                <>
                  You trust {trustInfo.trusting.length} people on average {""}
                  {trustInfo.trusting.reduce((a, b) => a + b.amountPercent, 0) / trustInfo.trusting.length}%
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {trustInfo.trusting.map((t) => (
                      <ProfileCard
                        key={t.id}
                        id={t.targetId}
                        firstName={t.target.firstName ?? ""}
                        lastName={t.target.lastName ?? ""}
                        trustPercent={t.amountPercent}
                      >
                        <TrustForm trustTarget={t.targetId} startingPercent={t.amountPercent} />
                      </ProfileCard>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
          <Title level={4}>
            Trusted by {youTrust && "you and"} {otherTrusts} {youTrust && "other"}{" "}
            {otherTrusts === 1 ? "person" : "people"}
          </Title>
          {isAuthed && (
            <Card className="p-5 rounded-md border bg-gray-50">
              <TrustCreateForm
                trustTarget={user.id}
                startingPercent={
                  youTrust ? trustInfo.trustedBy.find((t) => t.truster.clerkId === clerkId)?.amountPercent : 100
                }
              />
            </Card>
          )}
          <Spacer className="h-2" />
          <Title level={2}>Host listings</Title>

          <Spacer className="h-2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {hostListings?.map((listing) => {
              return (
                <ListingCard
                  key={listing.id}
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
        </>
      )}
    </>
  );
}
