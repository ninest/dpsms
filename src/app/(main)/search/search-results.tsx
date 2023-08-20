"use client";

import { HostListing } from "@/types";

interface Props {
  hostListings: HostListing[];
}

export function SearchResult({ hostListings }: Props) {
  // Ensure that they meet all the qualifier requirements
  // Access the database and get all the address latitudes/longitudes
  // Sort by distance
  // Display listings in order

  // const sortedListings = hostListings.sort(function ());

  return <div></div>;
}
