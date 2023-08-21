"use server";

import { SearchFormData, searchFormSchema } from "@/app/(main)/search/search-schemas";
import { mapboxService } from "@/services/mapbox-service";
import { hostsService } from "@/services/hosts-service";

export async function searchLocationAction(params: SearchFormData) {
    searchFormSchema.parse(params);

    const { latitude, longitude } = await mapboxService.getForwardGeocoding(params.location);

    return { latitude, longitude }
}
