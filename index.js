const glob = require('glob');
const path = require('path');

glob.sync('./helpers/**/*.js').forEach(file => {
	Object.assign(module.exports, require(path.resolve(file)));
});
