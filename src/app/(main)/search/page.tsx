import { SearchForm } from "@/app/(main)/search/search-form";
import { SearchResult } from "@/app/(main)/search/search-results";
import { Empty } from "@/components/empty";
import { Spacer } from "@/components/spacer";
import { Title } from "@/components/typography/title";
import { Button } from "@/components/ui/button";
import { hostsService } from "@/services/hosts-service";
import { usersService } from "@/services/users-service";
import { auth } from "@clerk/nextjs";
import { LucideMap } from "lucide-react";

interface Props {
  searchParams: {
    location?: string;
    qualifier?: string[];
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { userId: clerkId } = auth();
  const address = clerkId ? (await usersService.getUserByClerkId(clerkId)).address : "";

  const { location, qualifier } = searchParams;

  let hostListings = null;
  let mapUrl = null;
  if (location) {
    const qualifierList = typeof qualifier === "string" ? [qualifier] : qualifier;
    const result = await hostsService.searchHostListings(location, { qualifiers: qualifierList ?? [] });
    hostListings = result.hostListings;
    mapUrl = result.mapUrl;
  }

  return (
    <>
      <Title level={1}>Search</Title>

      <Spacer className="h-3" />

      <div className="max-w-[80ch]">
        <SearchForm defaultAddress={location ?? address} />

        <Spacer className="h-3" />
        {mapUrl && (
          <>
            <Button variant={"secondary"} className="space-x-2" asChild>
              <a href={mapUrl} target="_blank">
                <LucideMap className="w-4" /> <span>Open map</span>
              </a>
            </Button>

            <Spacer className="h-3" />
          </>
        )}
      </div>

      {hostListings ? (
        <SearchResult
          hostListings={(hostListings ?? []).map((hl) => {
            return {
              id: hl.id,
              address: hl.address,
              qualifiers: hl.qualifiers,
              timings: hl.timings,
              numTenantsRequested: hl.tenantRequestListing.length,
              hostClerkId: hl.host.user.clerkId,
              hostTrustedBy: hl.host.user.trustedBy.length,
              numTenancies: hl.tenancy.length,
              numTenancyRequests: hl.tenantRequestListing.length,
              sqft: hl.sqft,
            };
          })}
        />
      ) : (
        <Empty>Enter a location to start a search</Empty>
      )}
    </>
  );
}
