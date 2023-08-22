import { SearchForm } from "@/app/(main)/search/search-form";
import { SearchResult } from "@/app/(main)/search/search-results";
import { Empty } from "@/components/empty";
import { Spacer } from "@/components/spacer";
import { Title } from "@/components/typography/title";
import { hostsService } from "@/services/hosts-service";
import { mapboxService } from "@/services/mapbox-service";
import { usersService } from "@/services/users-service";
import { HostListing } from "@/types";
import { auth } from "@clerk/nextjs";
import { Suspense } from "react";

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
  if (location) {
    const qualifierList = typeof qualifier === "string" ? [qualifier] : qualifier;
    hostListings = await hostsService.searchHostListings(location, { qualifiers: qualifierList ?? [] });
  }

  return (
    <>
      <Title level={1}>Search</Title>

      <Spacer className="h-3" />

      <SearchForm defaultAddress={location ?? address} />

      <Spacer className="h-3" />
      
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
