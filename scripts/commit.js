import { spawn } from 'child_process';

console.log('Enter commit message:');
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
  const message = data.toString();
  let stdout = '';
  let stderr = '';
  const git = spawn('git', ['commit', `-m '${message}'`]);
  // const git = spawn('echo', [`'${message}'`]);
  git.stdout.on('data', (data) => {
    stdout += data;
  });
  git.stderr.on('data', (data) => {
    stderr += data;
  });
  git.on('close', (code) => {
    if (stderr) console.error(stderr);
    if (stdout) console.log(stdout);
    process.exit(code);
  });
});
