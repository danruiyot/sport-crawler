var scrapeYoutube = require("scrape-youtube");

scrapeYoutube.youtube.search('Short Change Hero').then(results => {
    console.log(results)
});