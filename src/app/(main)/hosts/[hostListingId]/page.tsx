import { acceptTenantRequestListingAction } from "@/app/(main)/host-actions";
import { TenantForm } from "@/app/(main)/hosts/[hostListingId]/tenant-form";
import { acceptTenancyRequestListingAction } from "@/app/(main)/tenant-actions";
import { Empty } from "@/components/empty";
import { Spacer } from "@/components/spacer";
import { TenancyRequest } from "@/components/tenancy-request";
import { Title } from "@/components/typography/title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { hostsService } from "@/services/hosts-service";
import { tenantsService } from "@/services/tenants-service";
import { usersService } from "@/services/users-service";
import { cn } from "@/utils";
import { auth } from "@clerk/nextjs";
import { LucideCheckCircle2, LucideClock, LucideRuler } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

interface Props {
  params: {
    hostListingId: string;
  };
}

export default async function HostListingPage({ params }: Props) {
  const { userId: clerkId } = auth();
  const isAuthed = !!clerkId;

  const hostListing = await hostsService.getHostListing(params.hostListingId);
  const hostUser = await usersService.getUserByClerkId(hostListing.host.user.clerkId);

  // If currently logged in user is a tenant
  const myTenancyRequests = clerkId
    ? await tenantsService.getTenancyRequestsByHostListing(clerkId, hostListing.id)
    : null;
  const myTenancyRequestSuggestions = clerkId
    ? await tenantsService.getTenancyRequestsSuggestionsForHostListing(clerkId, hostListing.id)
    : null;

  // Is the currently logged in user the owner of this listing
  const isCurrentUserOwner = hostListing.host.user.clerkId === clerkId;

  const allTenancyRequests = await hostsService.getTenantRequests(params.hostListingId);

  return (
    <>
      <Link href={`/profile/${hostUser.hostUser?.userId}`}>
        {hostUser.firstName} {hostUser.lastName}
      </Link>

      <Spacer className="h-1" />

      <Title className="mt-1" level={1}>
        {hostListing.address}
      </Title>

      <Spacer className="h-6" />

      <div className="flex items-center flex-wrap -mt-1">
        {hostListing.qualifiers.map((qualifier) => (
          <div key={qualifier} className="mr-1 mt-1 px-1 py-0.5 border rounded-md bg-gray-100 text-sm">
            {qualifier}
          </div>
        ))}
      </div>

      <Spacer className="h-3" />

      <div className="tabular-nums flex items-center">
        <LucideRuler className="w-4 mr-2" />
        {hostListing.sqft} sqft
      </div>
      <Spacer className="h-2" />
      <div className="mb-4 tabular-nums flex items-center">
        <LucideClock className="w-4 mr-2" />
        {hostListing.timings}{" "}
      </div>

      <section className="max-w-[80ch]">
        {isCurrentUserOwner && (
          <>
            <Spacer className="h-6" />
            <Title level={2}>Requests</Title>

            <Spacer className="h-3" />

            {allTenancyRequests.length === 0 && <Empty>No tenancies requested yet</Empty>}

            <div className="space-y-2">
              {allTenancyRequests.map((trl) => {
                const { itemsDescription, sqft, tenant } = trl.tenantRequest;
                const { hostAccepted } = trl;
                return (
                  <div>
                    <TenancyRequest
                      key={trl.id}
                      request={{
                        id: trl.id,
                        address: hostListing.address,
                        description: itemsDescription,
                        sqft: sqft,
                        startTime: trl.startTime,
                        endTime: trl.endTime,
                        hostAccepted: trl.hostAccepted,
                        tenantAccepted: trl.tenantAccepted,
                      }}
                      className={cn({ "rounded-br-none": !hostAccepted })}
                    />
                    {!hostAccepted && (
                      <form action={acceptTenantRequestListingAction} className="flex justify-end">
                        <input type="hidden" name="tenancyRequestListingId" value={trl.id} />
                        <Button variant={"secondary"} size={"sm"} className="rounded-t-none">
                          Accept tenant
                        </Button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!!myTenancyRequests?.length && (
          <div>
            <Title level={2}>My requests</Title>
            <div className="space-y-2 mt-2">
              {myTenancyRequests.length === 0 && <Empty>No requests</Empty>}
              {myTenancyRequests.map((request) => {
                return (
                  <Fragment key={request.id}>
                    {request.tenantRequestListing.map((trl) => {
                      const { hostAccepted, tenantAccepted } = trl;
                      return (
                        <div>
                          <TenancyRequest
                            key={trl.id}
                            request={{
                              id: trl.id,
                              address: hostListing.address,
                              description: request.itemsDescription,
                              sqft: request.sqft,
                              hostAccepted: trl.hostAccepted,
                              tenantAccepted: trl.tenantAccepted,
                              startTime: trl.startTime,
                              endTime: trl.endTime,
                            }}
                            className={cn({ "rounded-br-none": hostAccepted && !tenantAccepted })}
                          />
                          {hostAccepted && !tenantAccepted && (
                            <form action={acceptTenancyRequestListingAction} className="flex justify-end">
                              <input type="hidden" name="tenancyRequestListingId" value={trl.id} />
                              <Button variant={"secondary"} size={"sm"} className="rounded-t-none">
                                Accept host
                              </Button>
                            </form>
                          )}
                        </div>
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>
          </div>
        )}

        <Spacer className="h-6" />

        {!isCurrentUserOwner && (
          <Card className="p-5 rounded-md border bg-gray-50">
            <Title level={3}>Request a tenancy</Title>
            <Spacer className="h-3" />

            {isAuthed ? (
              <TenantForm hostListingId={hostListing.id} suggestions={myTenancyRequestSuggestions} />
            ) : (
              <Link href={"/sign-in"}>
                Please <span className="underline">click here to sign in</span> before requesting tenancy
              </Link>
            )}
          </Card>
        )}
      </section>
    </>
  );
}
