// Define the base URL for FitGirl
const BASE_URL = "https://fitgirl-repacks.site/";

// Utility function to make a GET request and fetch HTML content
async function fetchHTML(url) {
    try {
        const response = await fetch(url);
        return await response.text(); // Return raw HTML text
    } catch (error) {
        console.error(`Error fetching HTML from ${url}:`, error);
        throw error;
    }
}

// Function to search for repacks with a query and optional page number
async function search(query, page = 1) {
    const searchUrl = `${BASE_URL}page/${page}/?s=${encodeURIComponent(query)}`;
    console.log(`Fetching search results from: ${searchUrl}`); // Debugging output
    const html = await fetchHTML(searchUrl);

    // Extract titles and URLs using regex
    const regex = /<h1 class="entry-title"><a href="(.+?)" rel="bookmark">(.+?)<\/a><\/h1>/g;
    const matches = [...html.matchAll(regex)];

    // Build the search result list
    const results = matches.map(match => ({
        url: match[1],
        title: match[2]
    }));

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
// 1. Searching for "Witcher" on page 1 and displaying total pages

/**
search("Witcher", 1).then(({ results, currentPage, lastPage }) => {
    console.log(`Search results (page ${currentPage} of ${lastPage}):`, results);
});
**/
