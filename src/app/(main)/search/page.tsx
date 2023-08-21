import { SearchForm } from "@/app/(main)/search/search-form";
import { SearchResult } from "@/app/(main)/search/search-results";
import { hostsService } from "@/services/hosts-service";
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

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number, unit: 'K' | 'N') {
  var radlat1 = Math.PI * lat1 / 180
  var radlat2 = Math.PI * lat2 / 180
  var radlon1 = Math.PI * lon1 / 180
  var radlon2 = Math.PI * lon2 / 180
  var theta = lon1 - lon2
  var radtheta = Math.PI * theta / 180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180 / Math.PI
  dist = dist * 60 * 1.1515
  if (unit == "K") { dist = dist * 1.609344 }
  if (unit == "N") { dist = dist * 0.8684 }
  return dist
}

export default async function SearchPage({ searchParams }: Props) {
  const { userId: clerkId } = auth();
  const address = clerkId ? (await usersService.getUserByClerkId(clerkId)).address : "";

  const { latitude, longitude, location, qualifiers } = searchParams;
  const hostListings = Object.keys(searchParams).length ? await hostsService.getHostListings({ qualifiers }) : [];
  if (latitude && longitude) {
    const lat = parseInt(latitude, 10);
    const lon = parseInt(longitude, 10);

  }

  return (
    <Suspense fallback="">
      <SearchForm defaultAddress={location ?? address} />
      <SearchResult hostListings={hostListings} />
    </Suspense>
  );
}
