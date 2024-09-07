const BASE_URL = "https://fitgirl-repacks.site/";

// Utility function to try fetching without proxy first, and use proxy if it fails
async function fetchHTMLWithFallback(url, retries = 10) {
    try {
        console.log("Attempting to fetch without proxy...");
        const response = await fetch(url);

        if (response.ok) {
            return await response.text();
        } else {
            throw new Error(`Failed with status: ${response.status}`);
        }
    } catch (error) {
        console.warn(`Direct fetch failed: ${error.message}, switching to proxy.`);
        return await fetchViaProxy(url, retries);
    }
}

// Utility function to make a GET request through the proxy
async function fetchViaProxy(url, retries = 10) {
    const proxyUrl = `https://www.whateverorigin.org/get?url=${encodeURIComponent(url)}`;

    for (let i = 0; i < retries; i++) {
        try {
            const proxyResponse = await fetch(proxyUrl);
            const proxyData = await proxyResponse.json();
            return proxyData.contents;
        } catch (error) {
            console.error(`Proxy fetch failed on attempt ${i + 1}: ${error.message}`);
        }
    }

    throw new Error(`Failed to fetch via proxy after ${retries} attempts`);
}

// Function to fetch an image from the repack page
async function fetchImageFromPage(url) {
    const html = await fetchHTMLWithFallback(url); // Use the fallback logic for image fetching as well
    const imageRegex = /<meta property="og:image" content="(.+?)" \/>/i;
    const imageMatch = html.match(imageRegex);
    
    return imageMatch ? imageMatch[1] : "../../store.akamai.steamstatic.com/public/images/mobile/steam_link_bg.png";
}

// Function to search for repacks with a query and optional page number
async function search(query, page = 1) {
    const searchUrl = `${BASE_URL}page/${page}/?s=${encodeURIComponent(query)}`;
    console.log(`Fetching search results from: ${searchUrl}`);

    // Fetch the main search page HTML
    const html = await fetchHTMLWithFallback(searchUrl);

    // Extract titles and URLs using regex
    const regex = /<h1 class="entry-title"><a href="(.+?)" rel="bookmark">(.+?)<\/a><\/h1>/g;
    const matches = [...html.matchAll(regex)];

    // Build the search result list and fetch images
    const results = await Promise.all(
        matches.map(async (match) => {
            const imageUrl = await fetchImageFromPage(match[1]);
            return {
                url: match[1],
                title: match[2],
                imageurl: imageUrl // Add the fetched image URL to the result
            };
        })
    );

    // Extract the total number of pages by finding the pagination section
    const paginationRegex = /<a class="page-numbers" href="[^"]+\/page\/(\d+)\/\?s=[^"]+">(\d+)<\/a>/g;
    const paginationMatches = [...html.matchAll(paginationRegex)];
    const lastPage = paginationMatches.length > 0 ? Math.max(...paginationMatches.map(match => parseInt(match[1], 10))) : page;

    // Return the results along with pagination data
    return {
        results: results.length > 0 ? results : { message: "No results found" },
        currentPage: page,
        lastPage: lastPage
    };
}

// Example usage of the API with pagination and last page detection:
search("Witcher", 1).then(({ results, currentPage, lastPage }) => {
    console.log(`Search results (page ${currentPage} of ${lastPage}):`, results);
}).catch(error => {
    console.error('Search failed:', error);
});
