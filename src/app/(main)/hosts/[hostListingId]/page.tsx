import { acceptTenantRequestListingAction } from "@/app/(main)/host-actions";
import { TenantForm } from "@/app/(main)/hosts/[hostListingId]/tenant-form";
import { Empty } from "@/components/empty";
import { Spacer } from "@/components/spacer";
import { Title } from "@/components/typography/title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { hostsService } from "@/services/hosts-service";
import { tenantsService } from "@/services/tenants-service";
import { usersService } from "@/services/users-service";
import { cn } from "@/utils";
import { auth } from "@clerk/nextjs";
import { LucideCheckCircle2, LucideClock, LucideRuler } from "lucide-react";

interface Props {
  params: {
    hostListingId: string;
  };
}

export default async function HostListingPage({ params }: Props) {
  const { userId: clerkId } = auth();

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
      <div>
        {hostUser.firstName} {hostUser.lastName}
      </div>

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

      <Spacer className="h-2" />

      <section className="max-w-[80ch]">
        {isCurrentUserOwner && (
          <div className="mb-4 p-3 rounded border bg-gray-50">
            <Title level={3}>Requests</Title>
            <div className="space-y-2 mt-2">
              {allTenancyRequests.map((tenancyRequestListing) => {
                const { itemsDescription, sqft, tenant } = tenancyRequestListing.tenantRequest;
                return (
                  <div key={tenancyRequestListing.id}>
                    <div>{tenant.userId}</div>
                    <b>
                      {itemsDescription} - {sqft}sqft
                    </b>
                    <div>
                      {tenancyRequestListing.startTime.toISOString()} - {tenancyRequestListing.endTime.toISOString()}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <LucideCheckCircle2
                          className={cn("text-gray-300", {
                            "text-green-600": tenancyRequestListing.hostAccepted,
                          })}
                        />
                        {tenancyRequestListing.hostAccepted ? "Host accepted" : "Host pending"}
                      </div>
                      <div className="flex items-center space-x-2">
                        <LucideCheckCircle2
                          className={cn("text-gray-300", {
                            "text-green-600": tenancyRequestListing.tenantAccepted,
                          })}
                        />
                        {tenancyRequestListing.tenantAccepted ? "Host accepted" : "Tenant pending"}
                      </div>
                    </div>

                    {!tenancyRequestListing.hostAccepted && (
                      <div>
                        <form action={acceptTenantRequestListingAction}>
                          <input type="hidden" name="tenancyRequestListingId" value={tenancyRequestListing.id} />
                          <Button>Accept</Button>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!!myTenancyRequests?.length && (
          <div className="mb-4 p-3 rounded border bg-gray-50">
            <Title level={3}>My requests</Title>
            <div className="space-y-2 mt-2">
              {myTenancyRequests.length === 0 && <Empty>No requests</Empty>}
              {myTenancyRequests.map((tenancyRequest) => {
                return (
                  <div key={tenancyRequest.id}>
                    <div className="font-bold">
                      {tenancyRequest.itemsDescription} - {tenancyRequest.sqft} sqft
                    </div>
                    <div>
                      {tenancyRequest.tenantRequestListing.map((trl) => {
                        return (
                          <div key={trl.id}>
                            <div>
                              {trl.startTime.toISOString()} - {trl.endTime.toISOString()}
                            </div>
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
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isCurrentUserOwner && (
          <Card className="p-5 rounded-md border bg-gray-50">
            <Title level={3}>Request a tenancy</Title>
            <Spacer className="h-3" />
            <TenantForm hostListingId={hostListing.id} suggestions={myTenancyRequestSuggestions} />
          </Card>
        )}
      </section>
    </>
  );
}
