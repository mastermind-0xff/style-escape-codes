import { sec } from './style-escape-codes';

describe('EC tests', () => {
  test('changes foreground color', () => {
    expect(sec.fgRed('hello world').replaceAll('\x1b', '\\x1b')).toStrictEqual(
      `\\x1b[31mhello world\\x1b[39m\\x1b[99m`
    );
  });
  test('changes foreground color using rgb', () => {
    expect(
      sec.fg.hex('0af')('hello world').replaceAll('\x1b', '\\x1b')
    ).toStrictEqual(`\\x1b[38;2;0;170;255mhello world\\x1b[39m\\x1b[99m`);
    expect(
      sec.fg.hex(0x00aaff)('hello world').replaceAll('\x1b', '\\x1b')
    ).toStrictEqual(`\\x1b[38;2;0;170;255mhello world\\x1b[39m\\x1b[99m`);
    expect(
      sec.fg.hsl(200, 100, 50)('hello world').replaceAll('\x1b', '\\x1b')
    ).toStrictEqual(`\\x1b[38;2;0;170;255mhello world\\x1b[39m\\x1b[99m`);
    expect(
      sec.fg.rgb(0, 170, 255)('hello world').replaceAll('\x1b', '\\x1b')
    ).toStrictEqual(`\\x1b[38;2;0;170;255mhello world\\x1b[39m\\x1b[99m`);
  });
  test('stacks styles', () => {
    expect(sec.b.u('hello world').replaceAll('\x1b', '\\x1b')).toStrictEqual(
      `\\x1b[1;4mhello world\\x1b[22;24m\\x1b[99m`
    );
  });
  test('nests styles', () => {
    expect(
      sec.b.u(`hello ${sec.fgRed('red')} world`).replaceAll('\x1b', '\\x1b')
    ).toStrictEqual(
      `\\x1b[1;4mhello \\x1b[31mred\\x1b[39m\\x1b[1;4m\\x1b[99m world\\x1b[22;24m\\x1b[99m`
    );
  });
  test('sets and unset global styles', () => {
    expect(
      (sec.b.u + `hello world` + sec.b.u.unset()).replaceAll('\x1b', '\\x1b')
    ).toStrictEqual(`\\x1b[1;4mhello world\\x1b[22;24m\\x1b[99m`);
  });
  test('ec is not callable', () => {
    expect(() => sec()).toThrow();
  });
});
