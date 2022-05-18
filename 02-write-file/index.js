const {stdin, stdout} = process;
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Введите текст:\n\r');

const rl = readline.createInterface({ input: stdin, output: output});

rl.on('line', (line) => {
  if(line=='exit') {
    process.exit();
  }
  output.write(line+'\n');
});

process.on('exit', () => {
  stdout.write('Пока!\n\r');
});
process.on('SIGINT', () => {
  process.exit();
});
