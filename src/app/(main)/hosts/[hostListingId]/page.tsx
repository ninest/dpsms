import { acceptTenantRequestListingAction } from "@/app/(main)/hosts/[hostListingId]/host-actions";
import { TenantForm } from "@/app/(main)/hosts/[hostListingId]/tenant-form";
import { Title } from "@/components/typography/title";
import { Button } from "@/components/ui/button";
import { hostsService } from "@/services/hosts-service";
import { tenantsService } from "@/services/tenants-service";
import { usersService } from "@/services/users-service";
import { cn } from "@/utils";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { LucideCheck, LucideCheckCircle, LucideCheckCircle2 } from "lucide-react";

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
      <Title className="mt-1" level={1}>
        {hostListing.host.user.address}
      </Title>

      <div className="mt-4 flex items-center space-x-1">
        {hostListing.qualifiers.map((qualifier) => (
          <div key={qualifier} className="px-1 py-0.5 border rounded bg-gray-100">
            {qualifier}
          </div>
        ))}
      </div>

      <div className="mt-2 tabular-nums">{hostListing.sqft} sqft</div>

      <div className="mt-2 mb-4 tabular-nums">{hostListing.timings} </div>

      {isCurrentUserOwner && (
        <div className="mb-4 p-3 rounded border bg-gray-50">
          <Title level={3}>Requests</Title>
          <div className="space-y-2 mt-2">
            {allTenancyRequests.map((tenancyRequestListing) => {
              const { duration, itemsDescription, sqft, tenant } = tenancyRequestListing.tenantRequest;
              return (
                <div key={tenancyRequestListing.id}>
                  <div>{tenant.userId}</div>
                  <b>
                    {itemsDescription} - {sqft}sqft
                  </b>
                  <div>
                    {tenancyRequestListing.startTime.toISOString()} - {duration} days
                  </div>
                  <div className="flex items-center space-x-2">
                    <LucideCheckCircle2
                      className={cn("text-gray-300", { "text-green-600": tenancyRequestListing.hostAccepted })}
                    />
                    {tenancyRequestListing.hostAccepted ? "Host accepted" : "Host pending"}
                  </div>
                  <div className="flex items-center space-x-2">
                    <LucideCheckCircle2
                      className={cn("text-gray-300", { "text-green-600": tenancyRequestListing.tenantAccepted })}
                    />
                    {tenancyRequestListing.tenantAccepted ? "Host accepted" : "Tenant pending"}
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
            {myTenancyRequests.map((tenancyRequest) => {
              return (
                <div key={tenancyRequest.id}>
                  <div className="font-bold">
                    {tenancyRequest.itemsDescription} - {tenancyRequest.sqft} sqft
                  </div>
                  <div>
                    {tenancyRequest.tenantRequestListing.map((trl) => {
                      return (
                        <div>
                          <div>
                            {trl.startTime.toISOString()} - {tenancyRequest.duration} days
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <LucideCheckCircle2
                                className={cn("text-gray-300", { "text-green-600": trl.hostAccepted })}
                              />
                              {trl.hostAccepted ? "Host accepted" : "Host pending"}
                            </div>
                            <div className="flex items-center space-x-2">
                              <LucideCheckCircle2
                                className={cn("text-gray-300", { "text-green-600": trl.tenantAccepted })}
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
        <div className="p-3 rounded border bg-gray-50">
          <TenantForm hostListingId={hostListing.id} suggestions={myTenancyRequestSuggestions} />
        </div>
      )}
    </>
  );
}
