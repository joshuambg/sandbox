// const glob = require('glob');
// const path = require('path');

// glob.sync('./helpers/**/*.js').forEach(file => {
// 	Object.assign(module.exports, require(path.resolve(file)));
// });

Object.assign(module.exports, 
	require('./get-img-head'),
	require('./replace-html-entites'),
	require('./sequence-promises'),
	require('./uniq'),
);