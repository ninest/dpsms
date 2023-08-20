const language = "en";
const sessionToken = process.env.SESSION_TOKEN;
const accessToken = process.env.MAPBOX_TOKEN;

export const mapboxService = {
    async getSearchboxService(search_text: string) {
        const location = search_text.trim().replaceAll(" ", "+");

        const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${location}&language=${language}&session_token=${sessionToken}&access_token=${accessToken}`;
        console.log(url);
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                return data;
            } else {
                throw new Error(`Request failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    },
    async getForwardGeocoding(search_text: string) {
        const location = search_text.trim().replaceAll(" ", "%20");

        const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${location}&access_token=${accessToken}`;
        console.log(url);

        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                return data;
            } else {
                throw new Error(`Request failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    }
};