const message = process.argv[2];
console.log(message, 'Continue Y/N(N)?');

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (inputChunk) => {
  const userInput = inputChunk.toString();
  const status = userInput[0] && userInput[0].toLowerCase() === 'y' ? 0 : 1;
  console.log(status ? '[N] Operation aborted.' : '[Y] Proceeding...');
  process.exit(status);
});
