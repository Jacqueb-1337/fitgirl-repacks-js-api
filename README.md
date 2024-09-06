# fitgirl-repacks-js-api
A JavaScript API to search titles in the official FitGirl Repacks site.

Obviously, you won't be able to use this on your website unless you have some way to disable CORS. This is actually intended for web-based apps such as Electron.js or NW.js.

It allows for custom callbacks, and will (in a future update very soon) handle outages such as when FitGirl's site is being DDoSed.

The `api.js` file has an example of how to use the API at EOF.

# Usage
search(`query`, `pageNumber`);


Where `query` is a string representing the Search Query Term and should be enclosed in quotes. eg. "Witcher 3" or "Far Cry 5"

and `pageNumber` is an integer representing the page number of the scraped search results (based on the query) you want to return, and should **NOT** be enclosed in quotes.

For example:
``search("Witcher", 1).then(({ results, currentPage, lastPage }) => {
    console.log(`Search results (page ${currentPage} of ${lastPage}):`, results);
});`` would return 10 objects (because FitGirl's search page only includes 10 results per page) and get the index of the last page, saving it as `lastPage`, and the currently selected page as `currentPage`.
