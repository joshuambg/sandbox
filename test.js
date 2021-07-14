
const fs = require('fs');
const path = require('path');

const filenames = fs.readFileSync('filenames.txt', 'utf8').split("\n");
filenames.forEach(name => {
	fs.appendFileSync(path.resolve(__dirname, `./filenames/${name}`),' ', 'utf8');
});
