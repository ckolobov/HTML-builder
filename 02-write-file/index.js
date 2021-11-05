const fs = require('fs');
const readline = require("readline");
const file = fs.createWriteStream(`${__dirname}/output.txt`);
console.log('Input something, please');
const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', line => {
  file.write(line);
  if (line.includes('exit')) {
    rl.close();
  }
})

rl.on('close', () => {
  file.end();
  console.log('Thank you! Have a nice day!');
})

process.on('SIGINT', () => {
  rl.close();
})