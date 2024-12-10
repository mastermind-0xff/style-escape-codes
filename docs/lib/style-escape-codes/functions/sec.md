[**style-escape-codes-test-package**](../../../README.md) • **Docs**

***

[style-escape-codes-test-package](../../../modules.md) / [lib/style-escape-codes](../README.md) / sec

# Function: sec()

> **sec**(): `never`

Change terminal output style, if ansi escape codes are supported. Each
terminal has slightly different output for predefined color values. Supports
stacking, nested and global styles, RGB, HSL and HEX color spaces.

__examples:__
```javascript
console.log(sec.bold.underline.red('bold underline red message'));
console.log(sec.b.u.fgRed('bold underline red message'));
console.log(sec.b.u.fg.rgb(255, 0, 0)('bold underline red message'));
console.log(sec.b.u.fg.hex('ff0000')('bold underline red message'));
console.log(sec.b.u.fg.hex('f00')('bold underline red message'));
console.log(sec.b.u.fg.hex(0xff0000)('bold underline red message'));
console.log(sec.b.u.fg.hsl(0, 100, 50)('bold underline red message'));
console.log(sec.b.u.fgRed + 'bold underline red message' + sec.b.u.fg.unset());
```

## Returns

`never`

## Defined in

[lib/style-escape-codes.ts:178](https://github.com/mastermind-0xff/style-escape-codes/blob/35eeb3b5ab03f193c615000622ad5113dacfdf6d/src/lib/style-escape-codes.ts#L178)
