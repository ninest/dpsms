import { SearchForm } from "@/app/(main)/search/search-form";
import { SearchResult } from "@/app/(main)/search/search-results";
import { usersService } from "@/services/users-service";
import { auth } from "@clerk/nextjs";
import { Suspense } from 'react'

export default async function SearchPage() {
  const { userId: clerkId } = auth();
  const address = clerkId ? (await usersService.getUserByClerkId(clerkId)).address : "";

  return (
    <Suspense fallback="" >
      <SearchForm defaultAddress={address} />
      <SearchResult />
    </Suspense>
  );
}