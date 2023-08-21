import { HostListing } from "@/types";

interface Props {
  hostListings: HostListing[];
}

export async function SearchResult({ hostListings }: Props) {
  // Ensure that they meet all the qualifier requirements
  // Access the database and get all the address latitudes/longitudes
  // Sort by distance
  // Display listings in order

  // const sortedListings = hostListings.sort(function ());

  // const sortedListings = hostListings.sort(function ());

  return (
    <div>
      <div>
        {/* Loop through host listings and display each */}
        {hostListings.map((listing) => (
          <div key={listing.id}>
            <h4>Host Listing</h4>
            <p>Address: {listing.address}</p>
            {/* Add other fields you want to display */}
          </div>
        ))}
      </div>
    </div>
  );
}
