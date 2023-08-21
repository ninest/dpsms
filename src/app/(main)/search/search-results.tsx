import { HostListing } from "@/types";
import { hostsService } from "@/services/hosts-service";

interface Props {
    hostListings: HostListing[];
}

export function SearchResult({ hostListings }: Props) {
    // Ensure that they meet all the qualifier requirements
    // Access the database and get all the address latitudes/longitudes
    // Sort by distance
    // Display listings in order

    // const sortedListings = hostListings.sort(function ());

    const randomString = `Latitude: ${latitude} Longitude: ${longitude}`

    const hostListings = await hostsService.getHostListings();

    // const sortedListings = hostListings.sort(function ());

    return (
        <div>
            <h1> {randomString} </h1>
            <h2> {location} </h2>
            <h3> {qualifiers} </h3>
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
