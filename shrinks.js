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

function step2(){
  // const goodschools = /tufts|york|wake|virginia|carnegie|michigan|georgetown|berkeley|emory|notre|cornell|louis|rice|vanderbilt|brown|dartmouth|duke|northwestern|hopkins|penn|chicago|stanford|yale|columbia|harvard|princeton|Wright/ig;
  const goodschools = /stanford|yale|columbia|harvard|princeton/ig;
  const shrinks = fs.readFileSync('shrinks.txt', 'utf8').split("\n").filter(shrink => shrink[0] === '{' && /phd/i.test(JSON.parse(shrink).title))
  .map(shrink=>JSON.parse(shrink)).filter(shrink => goodschools.test(shrink.school))
  .map(shrink=>({ ...shrink, url: shrink.url.replace(/\?.*$/,'')}));
  console.log(uniq(shrinks.map(shrink=>shrink.url)).join("\n"))

  const schools = {};
  shrinks.forEach(shrink => {
    if (schools.hasOwnProperty(shrink.school)) {
      schools[shrink.school]++;
    } else schools[shrink.school] = 1;
  })
  // console.log(schools)
  const schoolssorted = []
  Object.keys(schools).forEach(school => {
    schoolssorted.push({[school]: schools[school]});
  })
  schoolssorted.sort((a,b) => Object.values(a).pop() - Object.values(b).pop())
  // console.log(Object.assign({}, ...schoolssorted));
}
step2();
const debug = false;
const headers = {
    Origin: `https://www.psychologytoday.com`,
    Referer: `https://www.psychologytoday.com`,
    Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3`,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
    cookie: `_ga=GA1.2.85707523.1620347660; _fbp=fb.1.1620347659683.1869295290; _hjTLDTest=1; _hjid=69335faa-9226-45ba-adbf-bfedde898197; CookieConsent={stamp:%27-1%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:1%2Cutc:1620347660471%2Cregion:%27US%27}; has_js=1; __gads=ID=09c8f616698d7237:T=1620347819:S=ALNI_MZ-X8F816_YuIr0BK_cVilK2Eltiw; preferred_language=en; _gid=GA1.2.1122120319.1620603174; _hjIncludedInPageviewSample=1; _hjAbsoluteSessionInProgress=0; _hjIncludedInSessionSample=1; _uetsid=e03d22a0b11e11eba93239946142d27f; _uetvid=f62349e0aecb11eb9150e51de2f042f2`,
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1"
}

const requestOpts = { resolveWithFullResponse: false, timeout: 60000, gzip: true, rejectUnauthorized: false, headers };

function crawlSite(url, total) {
  return request({
  	    url,
  	    ...requestOpts
  	})
  .then(body => {
    if (!/Offers online therapy/g.test(body)){
      console.log('/Offers online therapy')
      fs.writeFileSync('shrinks.txt', fs.readFileSync('shrinks.txt', 'utf8').replace(url, ' ' + url), 'utf8')
    }

  	const window = new JSDOM(body).window;
    const profile ={};
    profile.title = ((window.document.querySelector('.profile-title') || {}).innerHTML || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ');
    profile.school = ((body.match(/School:[^<]*<[^<]*/g) || []).pop() || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').replace('School: ', '');
    profile.url = url;
    // console.log(JSON.stringify(profile))
    fs.writeFileSync('shrinks.txt', fs.readFileSync('shrinks.txt', 'utf8').replace(url, JSON.stringify(profile)), 'utf8')

    // const links = Array.from(body.matchAll(/<a href="([^"]*)"[^>]*>View/g)).map(link => link[1].replace(/\?.*$/,''));
    // fs.appendFileSync('shrinks.txt', links.join("\n") + "\n", 'utf8')
  }).catch(e => { console.log(e.message)})
}

// sequencePromises(fs.readFileSync('shrinks.txt', 'utf8').split("\n").filter(line => /^http/.test(line)), crawlSite, 0)
// sequencePromises(Array(650).fill(undefined).map((empty, index) => `https://www.psychologytoday.com/us/psychiatrists/94102?sid=609a945d6c834&zipdist=100&rec_next=${index*10}`), crawlSite, 0)
// .then(() => { fs.writeFileSync('shrinks.txt', uniq(fs.readFileSync('shrinks.txt', 'utf8').split("\n")).join("\n"), 'utf8') });
