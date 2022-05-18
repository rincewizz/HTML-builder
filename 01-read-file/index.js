const path = require('path');
const fs = require('fs');
const {stdout} = process;

const readebleStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf8');
readebleStream.on('data', (chunk) => {
  stdout.write(chunk);
});
