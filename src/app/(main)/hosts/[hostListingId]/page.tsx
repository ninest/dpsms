import { TenantForm } from "@/app/(main)/hosts/[hostListingId]/tenant-form";
import { Title } from "@/components/typography/title";
import { hostsService } from "@/services/hosts-service";
import { usersService } from "@/services/users-service";

interface Props {
  params: {
    hostListingId: string;
  };
}

export default async function HostListingPage({ params }: Props) {
  const hostListing = await hostsService.getHostListing(params.hostListingId);
  const hostUser = await usersService.getUserByClerkId(hostListing.host.user.clerkId);

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

      <div className="p-3 rounded border bg-gray-50">
        <TenantForm hostListingId={hostListing.id} />
      </div>
    </>
  );
}
