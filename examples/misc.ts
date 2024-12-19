import { exec } from 'child_process';
import { sec } from '../src/index';

const logTitle = (text) => {
  console.log('');
  console.log('-'.repeat(text.length));
  console.log(text);
  console.log('-'.repeat(text.length));
};

logTitle('Difference between call, set-unset and toString.');
console.log(sec.b('bold message'));
console.log(sec.b.set() + 'bold message' + sec.b.unset());
console.log(sec.b.toString() + 'bold message' + sec.b.unset());
console.log(sec.b + 'bold message' + sec.b.unset());

logTitle('Stacked styles.');
console.log(sec.u.i.b.red('underline, italic, bold red message'));

logTitle('Nested styles.');
console.log(
  sec.u.i.b.red(
    `underline, italic, bold red ${sec.blue('with blue inside')} message`
  )
);

// this group has the same style output
// predefined colors might have slightly different values in each terminal
logTitle('Bold underline "red" message.');
console.log(sec.bold.underline.red('bold underline red message'));
console.log(sec.b.u.fgRed('bold underline red message'));
console.log(sec.b.u.fg.rgb(255, 0, 0)('bold underline red message'));
console.log(sec.b.u.fg.hex('ff0000')('bold underline red message'));
console.log(sec.b.u.fg.hex('f00')('bold underline red message'));
console.log(sec.b.u.fg.hex(0xff0000)('bold underline red message'));
console.log(sec.b.u.fg.hsl(0, 100, 50)('bold underline red message'));
console.log(sec.b.u.fgRed + 'bold underline red message' + sec.b.u.fg.unset());


logTitle('Disable styles. Care, saved styles are tricky.');
const myStyle = sec.b.u.fgRed;
// prints with styles
console.log(sec.b.u.fgRed('Important message'));
// prints with styles
console.log(myStyle('Important message'));
sec.disable();
// prints without styles
console.log(sec.b.u.fgRed('Important message'));
// prints with styles!!!
console.log(myStyle('Important message'));
sec.enable();

// you can get fancy
logTitle('Notification messages.');
console.log(
  '\n',
  `🛑 ${sec.u.o.fg.hex('f00').bg.hsl(0, 60, 20)(' Error: Something went wrong! ')}`,
  '\n\n',
  `⚠️  ${sec.u.o.fg.hex('ff0').bg.hsl(60, 60, 20)(' Warning: Proceed with caution! ')}`,
  '\n\n',
  `✅ ${sec.u.o.fg.hex('0f0').bg.hsl(120, 60, 20)(' Success: It worked! ')}`
);

// you can style the output of other tools too

logTitle('Global styles.');
console.log('This is a regular output');
// set global style by calling the .set() method or by using .toString()
console.log(sec.i.fg.hex('9').bg.hex('3') + '');
// using exec for the sake of the example
await exec(
  `echo This is an output from a different command, but it's styled as you can see. && \
  echo And this is another row. && \
  echo This is the third output from an echo command. `,
  (err, stdout) => {
    console.log(stdout);
    // don't forget to .unset() your global styles, or they will overflow
    // .b.fgRed will actually unset b and fg styles after the message
    console.log(sec.b.fgRed('Oops we have serious leak under the sink!'));
    console.log('Is it red or bold? Nope.');
    console.log(sec.i.fg.bg.unset());
    console.log('All ok now.');
  }
);

