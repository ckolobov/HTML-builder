const fs = require('fs');
const stream = fs.createReadStream(`${__dirname}/text.txt`);
stream.pipe(process.stdout);