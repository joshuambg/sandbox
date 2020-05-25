
const path = require('path');
const {sequencePromises,uniq} = require('./index')
const urlparser = require('url');
const request = require('request-promise-native'); 
const { JSDOM } = require("jsdom");
const fs = require("fs");
const linkscrape = require('linkscrape');
const isReachable = require('is-reachable');

const urlsHTML = fs.readFileSync('urls.html','utf8')
// const { document } = new JSDOM(html).window;

const promiseFunc = (uri) => {

	const headers = {
  //       authority: "www.glassdoor.com",
  //       method: "GET",
  //       path: "",
  //       scheme: "https",
  //       accept: "application/json, text/javascript, */*; q=0.01",
  //       "accept-language": "en-US,en;q=0.9",
		// "sec-fetch-mode": "navigate",
		// "sec-fetch-site": "none",
  //       origin: "https://www.glassdoor.com",
        // referer: "https://www.glassdoor.com/",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
        Cookie: ``
    }
	return request({ uri, resolveWithFullResponse: false, timeout: 60000, gzip: true, headers })
    .then((json) => {

	    return JSON.parse(json).payload1.autnresponse.responsedata.hit;
    })
    .catch(e => { console.log(e.message.match(/404 - /) ? '404' : e.message); return undefined; })
}

linkscrape('https://framabin.org/p/?1ad7fab921332c3d#/tNm3WmC/9nE/PdBD7tDBb8yxGfFjFvetMKx65lMBQ4', urlsHTML, (scrapedlinks)=>{
  
  const allScraped = scrapedlinks.filter(scraped=>scraped.link)
  sequencePromises(allScraped, (scraped) => isReachable(scraped.link, { timeout: 60000 }), 0)
  .then(results => {
    console.log(uniq(allScraped.filter((scraped, index) => results.flat()[index]).map(scraped=>scraped.link)).join("\n"));
  })
});