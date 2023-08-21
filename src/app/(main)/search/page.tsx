import { SearchForm } from "@/app/(main)/search/search-form";
import { SearchResult } from "@/app/(main)/search/search-results";
import { Empty } from "@/components/empty";
import { Spacer } from "@/components/spacer";
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
    hostListings = await hostsService.searchHostListings(location, { qualifiers: qualifier ?? [] });
  }

  return (
    <>
      <SearchForm defaultAddress={location ?? address} />
      <Spacer className="h-3" />
      {hostListings ? <SearchResult hostListings={hostListings} /> : <Empty>Enter a location to start a search</Empty>}
    </>
  );
}
