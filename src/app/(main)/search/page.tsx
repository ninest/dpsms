import { SearchForm } from "@/app/(main)/search/search-form";
import { SearchResult } from "@/app/(main)/search/search-results";
import { usersService } from "@/services/users-service";
import { auth } from "@clerk/nextjs";
import { Suspense } from "react";

interface Props {
  searchParams: {
    latitude?: string;
    longitude?: string;
    location?: string;
    qualifiers?: string[];
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { userId: clerkId } = auth();
  const address = clerkId ? (await usersService.getUserByClerkId(clerkId)).address : "";

  let hostListings = [];
  if (Object.keys(searchParams).length > 0) {
    const { latitude, longitude, location, qualifiers } = searchParams;
    // Call search service and update hostListings
    // hostListings = []
  }

  return (
    <Suspense fallback="">
      <SearchForm defaultAddress={address} />
      <SearchResult hostListings={[]} />
    </Suspense>
  );
}
