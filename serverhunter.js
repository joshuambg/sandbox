
const request = require('request-promise-native');
const readline = require('readline');
const path = require('path');
const {sequencePromises } = require('./helpers/sequence-promises')
const urlparser = require('url');
const { JSDOM } = require("jsdom");
const fs = require("fs");
const linkscrape = require('linkscrape');
const isReachable = require('is-reachable');

const har = fs.readFileSync("/Users/jglasman/Downloads/www.serverhunter.com.har", "utf8").split("\n");
let content = '';
let capture = false;
har.forEach(line => {
  if (!capture && line === `          "content": {`) {
        content += '{';
    capture = true;
  } else if (capture && line === `          },`) {
    capture = false;
          content += line;
  } else if (capture){

      content += line;}
})
const servers = JSON.parse(`[${content}{}]`).filter(content => content.text && /All information in this JS/.test(content.text))
  .map(content => JSON.parse(content.text).data)
  .reduce((acc, data) => Object.assign(acc, data), {})

const companies = {};
Object.values(servers).forEach(offer => {
  companies[offer.company] = offer.link + 'visit';
})
console.log(companies)
