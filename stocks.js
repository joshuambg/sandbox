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
const { execFileSync, execFile, spawn, spawnSync } = require('child_process');

// spawnSync('curl', ['-o', path.resolve('nasdaqlisted.txt'), 'ftp://ftp.nasdaqtrader.com/SymbolDirectory/nasdaqlisted.txt']);
// spawnSync('curl', ['-o', path.resolve('otherlisted.txt'), 'ftp://ftp.nasdaqtrader.com/SymbolDirectory/otherlisted.txt']);
const nasdaqlisted = fs.readFileSync(path.resolve('nasdaqlisted.txt'), 'utf8');
const stocks = fs.readFileSync(path.resolve('stocks.json'), 'utf8');
const tickers = nasdaqlisted.split("\n").slice(1)
	.concat(fs.readFileSync(path.resolve('otherlisted.txt'), 'utf8').split("\n").slice(1))
	.map(line=>line.split("|")[0])
	// .slice(2000, 4000);
const calcDecrease = (num1, num2) => ((num2 - num1) / num1) * 100;

sequencePromises(tickers.filter(ticker => new RegExp('\/'+ticker + ":", 'g').test(stocks)), (ticker) => {
	return Promise.all([
		request(`https://www.marketwatch.com/investing/stock/${ticker}/downloaddatapartial?startdate=02/21/2020%2000:00:00&enddate=02/21/2020%2000:00:00&daterange=d30&frequency=p1d&csvdownload=true&downloadpartial=false&newdates=false`)
		.then(body => body.split("\n")[1] ? parseFloat(body.split("\n")[1].split(',"')[4].replace(/"/g,''), 10) : ''),
		request(`https://www.marketwatch.com/investing/stock/${ticker}/downloaddatapartial?startdate=03/02/2021%2000:00:00&enddate=03/02/2021%2000:00:00&daterange=d30&frequency=p1d&csvdownload=true&downloadpartial=false&newdates=false`)
		.then(body => body.split("\n")[1] ? parseFloat(body.split("\n")[1].split(',"')[4].replace(/"/g,''), 10) : '')
	]).then(([priceFeb, priceMarch]) => {
		const percentDecrease = calcDecrease(priceFeb, priceMarch);
		const numShares = (60000 / priceMarch);
		const pricePaid = numShares * priceMarch;
		const moneyMade = (numShares * priceFeb) - pricePaid;
		return { ticker, percentDecrease, moneyMade };
	})
	.catch(e => console.log(ticker))
}).then(results => results.flat())
.then((stocks) => {
	stocks.sort((a, b) => a.moneyMade - b.moneyMade);
	console.log(stocks.reduce((acc,stock) => stock.moneyMade+acc, 0))
})
return;
sequencePromises(tickers, (ticker) => {
	return request(`https://www.marketwatch.com/investing/stock/${ticker}/downloaddatapartial?startdate=01/15/2020%2000:00:00&enddate=03/15/2020%2000:00:00&daterange=d30&frequency=p1d&csvdownload=true&downloadpartial=false&newdates=false`)
	.then(body => {
		if (!body.split("\n")[1]) { throw ticker }
		const priceJan = parseFloat(body.trim().split("\n").pop().split(',"')[4].replace(/"/g,''), 10);
		const priceMar = parseFloat(body.split("\n")[1].split(',"')[4].replace(/"/g,''), 10);

		const percentDecrease = calcDecrease(priceJan, priceMar);

		if (percentDecrease > -50) { throw '' }
		
		return request(`https://www.marketwatch.com/investing/stock/${ticker}/downloaddatapartial?startdate=02/16/2021%2000:00:00&enddate=02/16/2021%2000:00:00&daterange=d30&frequency=p1d&csvdownload=true&downloadpartial=false&newdates=false`)
		// Date,Open,High,Low,Close,Volume
		.then(body => body.split("\n")[1] ? parseFloat(body.split("\n")[1].split(',"')[4].replace(/"/g,''), 10) : '')
		.then(price2021 => new Array(priceJan, priceMar, price2021))
	})
	.then(prices => {
		if (!prices[2] || prices[1] < 5) { throw ticker }
		const percentDecrease = calcDecrease(prices[0], prices[2]);
		if (percentDecrease > 15 || percentDecrease < -40) { throw '' }
		return { ticker, 'Jan2020': prices[0], 'Mar2020': prices[1], '2021': prices[2], diff: percentDecrease }
	})
	.catch(e => undefined)
})
.then((stocks) => stocks.flat().filter(stock=>stock))
.then((stocks) => {
	stocks.sort((a, b) => a.diff - b.diff);
	
	fs.writeFileSync(path.resolve('stocks.json'), stocks.map(stock=>{
		const listed = nasdaqlisted.split("\n").find(line=>line.match(new RegExp(`^${stock.ticker}\|`))) ? 'NASDAQ' : 'NYSE';
		return `https://www.google.com/finance/quote/${stock.ticker}:${listed}?window=5Y`;
	}).join("\n"), 'utf8')
})
.catch(e => {
	console.log(chalk.red(e.stack)); 
	return;
})
