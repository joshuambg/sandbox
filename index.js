// const glob = require('glob');
// const path = require('path');

// glob.sync('./helpers/**/*.js').forEach(file => {
// 	Object.assign(module.exports, require(path.resolve(file)));
// });

Object.assign(module.exports, 
	require('./helpers/get-img-head'),
	require('./helpers/replace-html-entites'),
	require('./helpers/sequence-promises'),
	require('./helpers/uniq'),
);