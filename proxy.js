
var proxy = require('express-http-proxy');
const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const chalk = require('chalk');
const bodyParser =require('body-parser');
const { exec } = require('child_process');
const port = 8080;

app.use(proxy('joshuaisthe.best:8096', {
	// proxyReqBodyDecorator: function(bodyContent, srcReq) {
	// 	return new Promise(function(resolve) {
	// 		console.log(bodyContent.toString('utf8'))

	// 		resolve(bodyContent.toString('utf8'));
	// 	});
	// },
	userResDecorator: function(proxyRes, proxyResData) {
		return new Promise(function(resolve) {
			// console.log(proxyResData.toString('utf8'))

			const proxyResDataString = proxyResData.toString('utf8');

			let modified = proxyResData;

			if (/is="emby-button"/g.test(proxyResDataString)) {
				console.log('hbere')
				modified = proxyResDataString.replace(/is="emby-button"/g, 'is="emby-button" style="display: none"');
			}

			resolve(modified);
		});
	}
}));

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.text());
app.listen(process.env.PORT || port, () => console.log(chalk.blue(`Listening on port ${port}`)));