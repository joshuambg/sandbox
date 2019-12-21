
const request = require('request-promise-native'); 

module.exports.getImageHead = (url, key = 'last-modified') => {
	return request({ timeout: 30000, url, method: "HEAD" })
		.then(headers => !!headers[key] ? headers : Promise.reject())
    	.catch(err => {
    		if (process.env.hasOwnProperty('debug')) console.error("Error image", url);
    		return Promise.resolve({ 'last-modified': new Date() });
		});
}