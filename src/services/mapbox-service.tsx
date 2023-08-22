const language = "en";
const sessionToken = process.env.SESSION_TOKEN;
const accessToken = process.env.MAPBOX_TOKEN;

export const mapboxService = {
  async getSearchboxService(search_text: string) {
    const location = search_text.trim().replaceAll(" ", "+");

    const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${location}&language=${language}&session_token=${sessionToken}&access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  async getForwardGeocoding(searchText: string) {
    const location = searchText.trim().replaceAll(" ", "%20");

    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${location}&access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const { latitude, longitude }: { latitude: number; longitude: number } =
          data.features[0].properties.coordinates;
        return { latitude, longitude };
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
};
