"use client";

import { useSearchParams } from "next/navigation";

export function SearchResult() {
    const searchParams = useSearchParams()
    const latitude = searchParams.get('latitude')
    const longitude = searchParams.get('longitude')
    const location = searchParams.get('location')
    const qualifiers = searchParams.get('qualifiers')

    // Ensure that they meet all the 
    // Access the database and get all the address latitudes/longitudes
    // Sort by distance
    // Display listings in order

    const randomString = `Latitude: ${latitude} Longitude: ${longitude}`

    return (
        <div>
            <h1> {randomString} </h1>
            <h2> {location} </h2>
            <h3> {qualifiers} </h3>
        </div>
    );
}