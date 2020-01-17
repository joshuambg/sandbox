
const path = require('path');
const {sequencePromises} = require('./helpers')
const urlparser = require('url');
const request = require('request-promise-native'); 
const { JSDOM } = require("jsdom");

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

sequencePromises(Array(100).fill(undefined).map((empty, index) => `https://www.sutterhealth.org/widgets/json-doctor-results?accepting-new=open^^limited^^unknown&online-service-type=&provider-gender=&medical-group=&location=San+Francisco%2C+CA&zip=&lat=37.7749295&lng=-122.4194155&q=&online-services=numberincreasing&specialty=Family+Medicine^^Internal+Medicine&provider-language=&health-plan=&health-plan-product=&start=${(index*10)+1}`), promiseFunc, 0)
.then(pages => pages.flat().filter(doctor=>doctor && doctor.content)
				.filter(doctor => {
					if (Array.isArray(doctor.content.PROVIDER.ADDRESSES.ADDRESS)) {
						return doctor.content.PROVIDER.ADDRESSES.ADDRESS.some(address => address.ADDRESS1['$'].match(/1375 Sutter Street/i))
					} else {
						return doctor.content.PROVIDER.ADDRESSES.ADDRESS.ADDRESS1['$'].match(/1375 Sutter Street/i)
					}
				}))
.then(results => {
	console.log(results);
})