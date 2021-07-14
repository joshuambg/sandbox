const request = require('request-promise-native');
const readline = require('readline');
const chalk = require('chalk');
const path = require('path');
const { uniq, sequencePromises } = require('./index')
const urlparser = require('url');
const { JSDOM } = require("jsdom");
const fs = require("fs");
const linkscrape = require('linkscrape');
const isReachable = require('is-reachable');
const args = process.argv;

require('events').EventEmitter.defaultMaxListeners = 50;

const serverhunter =
{
  theaquariumwiki: 'http://www.theaquariumwiki.com',
};


let linkToStart = 'http://www.theaquariumwiki.com';
const formatURL = (url) => url.replace(/\#.*$/i,'').replace(/www\./gi,'').replace(/^http[s]?/i,'').replace(/language=[^&]*/,'language=');
const debug = false;
const headers = {
    Origin: linkToStart,
    Referer: linkToStart,
    Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3`,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
}

// const lines = fs.readFileSync(path.join(__dirname, './pets.txt'), 'utf8').split("\n").filter(line=>/^http/.test(line))
// sequencePromises(lines, (url) => {
// return request({
// 	    url,
// 	    headers
// 	}).then(body => {
// 		if (/The Spruce Pets\|Reptiles & Amphibians/g.test(body))
// 			return url;
// 	})
// }, 0)
// .then(results => {
// 	console.log(results.flat().filter(link=>link).join("\n"))
// })
// return;
const requestOpts = { resolveWithFullResponse: true, timeout: 60000, gzip: true, rejectUnauthorized: false, headers };

fs.writeFileSync(path.resolve(__dirname, './crawled_links.txt'), '', 'utf8');

const parseBody = (url, body) => {
	// const window = new JSDOM(body).window;
  let regexp = /fish page needs some help/gi;
  if (regexp.test(body)) return false;
  regexp = /Fish Difficulty - (?:Simple|Easy|Moderate)/gi;
  if (!regexp.test(body)) return false;
  regexp = /profilebox Fish freshwater/gi;
  if (!regexp.test(body)) return false;
  regexp = /peaceful/gi;
  if (!regexp.test(body)) return false;
  regexp = />Flake Foods</gi;
  if (!regexp.test(body)) return false;
  regexp = /(\/\/(?:assets\.)?theaquariumwiki.com\/w\/images\/thumb\/[^"]*)/gi;
  let image = '';
  if (regexp.test(body)) {
    image = `<img src="${body.exec(regexp)[1]}"/>`
  }
  console.log(`<a href="http${url}">${image}${/<title>([^-]*)/gi.exec(body)[1]}</a>`)
}

const scrapePageLinks = (url) => request({
	    url,
	    ...requestOpts
	}).then(response  => new Promise((resolve, reject) => {

		if (!response) reject();
		const requestedURI = response.request.uri.href;
		if (!requestedURI) reject('null' + url);

		fs.appendFileSync(
			path.resolve(__dirname, './crawled_links.txt'),
			formatURL(url) + "\n" + formatURL(requestedURI) + "\n",
		'utf8');

		parseBody(formatURL(requestedURI), response.body);

		if (debug) console.log(requestedURI);
		linkscrape(requestedURI, response.body, scraped => resolve(
      scraped.filter(scrape => scrape.link && /^http.*/i.test(scrape.link) &&
      /Special:/gi.test(scrape.link) === false &&
      /User:/gi.test(scrape.link) === false &&
      /Help_talk:/gi.test(scrape.link) === false &&
      /Help:/gi.test(scrape.link) === false &&
      /Talk:/gi.test(scrape.link) === false &&
      /User_talk:/gi.test(scrape.link) === false &&
      /action=edit/gi.test(scrape.link) === false &&
      /action=history/gi.test(scrape.link) === false &&
      /File:/gi.test(scrape.link) === false
    )));
	}))
	.catch(e => {
		let message;
		if (e.statusCode) {
			message = `${e.statusCode} ${e.response.request.uri.href}`;

  		fs.appendFileSync(
  			path.resolve(__dirname, './crawled_links.txt'),
  			formatURL(url) + "\n" + formatURL(e.response.request.uri.href) + "\n",
  		'utf8');
		} else if (e.message) {
			message = e.stack;
		} else if(typeof e === 'string') {
			message = e;
		}

		if (debug) console.log(chalk.red(message));
		return null;
	});

function crawlSite(linkToGet) {
	if (!linkToGet) return null;

	return scrapePageLinks(linkToGet)
	.then(scraped => {
		if (!scraped) return Promise.resolve();

		const crawledLinks = uniq(fs.readFileSync(path.resolve(__dirname, './crawled_links.txt'), 'utf8').split("\n"));

		const newLinks = uniq(
      scraped.filter(({ link }) => urlparser.parse(linkToStart).host.replace(/www\./,'') === urlparser.parse(link).host.replace(/www\./,''))
      .filter(({ link }) => !crawledLinks.includes(formatURL(link)))
      .map(({ link }) => link)
      .filter(link => link)
    );

		return sequencePromises(newLinks, (newLink) => crawlSite(newLink), 3)
		.then(results => results.flat());
	});
}

sequencePromises(Object.values(serverhunter), (newServer) => request({
	    url: newServer,
	    ...requestOpts,
      method: 'HEAD'
	}).catch(e=>e.response && e.response.request.uri.href), 0)
.then(results => sequencePromises(results.flat().map(response=>response && response.request && response.request.uri.href).filter(link=>link), (resolvedServer) => {
  linkToStart = resolvedServer;
  return crawlSite(resolvedServer);
}, 0))
