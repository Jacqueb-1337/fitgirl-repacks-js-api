# fitgirl-repacks-js-api
A JavaScript API to search titles in the official FitGirl Repacks site.

Obviously, you won't be able to use this on your website unless you have some way to disable CORS. This is actually intended for web-based apps such as Electron.js or NW.js.\
*Edit: I have added a fallback to a CORS proxy to bypass this, so you can in fact use the API on your website. I will soon add an arg for you to specify a custom proxy, but for now it uses whateverorigin.org. At present, whateverorigin is having some issues with their web app, so the API uses up to 10 refresh attempts and will fail after the 10th attempt, throwing an error.* 

It allows for custom callbacks, and will (in a future update very soon) handle outages such as when FitGirl's site is being DDoSed.

The `api.js` file has an example of how to use the API at EOF.

# Usage
search(`query`, `pageNumber`);


Where `query` is a string representing the Search Query Term and should be enclosed in quotes. eg. "Witcher 3" or "Far Cry 5"

and `pageNumber` is an integer representing the page number of the scraped search results (based on the query) you want to return, and should **NOT** be enclosed in quotes.

For example:
``search("Witcher", 1).then(({ results, currentPage, lastPage }) => {
    console.log(`Search results (page ${currentPage} of ${lastPage}):`, results);
}).catch(error => {
    console.error('Search failed:', error);
});`` would return 10 objects (because FitGirl's search page only includes 10 results per page) and get the index of the last page, saving it as `lastPage`, and the currently selected page as `currentPage`. In the callback, `results[3]` would get the object data of the fourth Title result. Furthermore, you could also do `results[3].imageurl` or `results[3].title` or `results[3].url` to get the corresponding values individually.

Following the example code at the end of api.js, if you did ``search("Witcher", 1).then(({ results, currentPage, lastPage }) => {window.results = results; }).catch(error => { window.results = "Search failed:" + error); });``, you could set the results to a global variable, so you can later call `results[3]`, `results[2].imageurl`, etc.
