"use server";

import { SearchFormData, searchFormSchema } from "@/app/(main)/search/search-schemas";
import { mapboxService } from "@/services/mapbox-service";

export async function searchLocationAction(params: SearchFormData) {
    searchFormSchema.parse(params);

    await mapboxService.getSearchboxService(params.location);
    await mapboxService.getForwardGeocoding(params.location);
}
