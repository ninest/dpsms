import { Title } from "@/components/typography/title";
import { Button } from "@/components/ui/button";
import { usersService } from "@/services/users-service";
import Link from "next/link";

interface Props {
  params: {
    userId: string;
  };
}

export default async function UserProfilePage({ params }: Props) {
  const user = await usersService.getUserById(params.userId);
  const hostListings = user.hostUser?.listings;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Title level={1}>
          {user.firstName} {user.lastName}
        </Title>
        <Button asChild variant={"secondary"}>
          <Link href={"/profile/edit"}>Edit profile</Link>
        </Button>
      </div>

      {!!hostListings?.length && (
        <>
          <div>
            <Title level={2}>Host listings</Title>

            <div className="">
              {hostListings.map((listing) => {
                const numTenantRequests = listing.tenantRequestListing.length;
                return (
                  <Link key={listing.id} href={`/hosts/${listing.id}`} className="block border bg-gray-100 rounded p-3">
                    <b>{user.address}</b>
                    <div>Available: {listing.timings}</div>
                    <div>
                      {listing.sizeDescription} {listing.sqft}sqft
                    </div>
                    <div>{listing.qualifiers}</div>
                    <div>{numTenantRequests} tenants have requested</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
