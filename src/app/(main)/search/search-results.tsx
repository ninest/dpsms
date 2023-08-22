import { ListingCard } from "@/components/ListingCard";
import { Empty } from "@/components/empty";
import { Spacer } from "@/components/spacer";
import { ComponentProps } from "react";

interface Props {
  hostListings: ComponentProps<typeof ListingCard>[];
}

export async function SearchResult({ hostListings }: Props) {
  return (
    <>
      {hostListings?.length > 0 ? (
        <>
          <p className="font-medium text-gray-600">Showing search results within 2 km of the provided address</p>
          <Spacer className="h-2" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {hostListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </>
      ) : (
        <Empty>No search results for location</Empty>
      )}
    </>
  );
}
