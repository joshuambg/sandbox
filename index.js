const glob = require('glob');
const path = require('path');

glob.sync('./helpers/**/*.js').forEach(file => {
	require(path.resolve(file));
});
