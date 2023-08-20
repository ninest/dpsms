import { SearchForm } from "@/app/(main)/search/search-form";
import { usersService } from "@/services/users-service";
import { auth } from "@clerk/nextjs";

export default async function SearchPage() {
  const { userId: clerkId } = auth();
  const address = clerkId ? (await usersService.getUserByClerkId(clerkId)).address : "";

  return (
    <>
      <SearchForm defaultAddress={address} />
    </>
  );
}