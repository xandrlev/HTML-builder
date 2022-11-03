const fs = require('fs');
const path = require('path');
const { stdout, stdin } = process;
const writeData = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Enter your text:');
stdin.on('data', data => {
  const myData = data.toString().trim();
  if (myData === 'exit'){
    process.exit();
  } else {
    writeData.write(data);
  }
})

process.on('exit', () => stdout.write('Thank you for participating!'));
process.on('SIGINT', () => process.exit());