import {
  assertNotNullish,
  assertRange,
  assertType,
  hexNumberToRgb,
  hexStringToRgb,
  hslToRgb,
  indexOfReplaceAll,
  rgbToEcRgb,
} from './utils';

describe('Testing utils', () => {
  describe('assertType', () => {
    test('string is number should throw', () => {
      expect(() => {
        const testConst = 'abc';
        assertType<unknown>(typeof testConst === 'number', testConst);
      }).toThrow();
    });

    test('string is string should not throw', () => {
      expect(() => {
        const testConst = 'abc';
        assertType<unknown>(typeof testConst === 'string', testConst);
      }).not.toThrow();
    });
  });

  describe('assertNotNullish', () => {
    test('null and undefined should throw', () => {
      expect(() => {
        assertNotNullish(null);
        assertNotNullish(undefined);
      }).toThrow();
    });
    test('non-null should not throw', () => {
      expect(() => {
        assertNotNullish(0);
        assertNotNullish(false);
        assertNotNullish('0');
        assertNotNullish('Apt.'); // abc -> абц -> AБъЦъ -> АПъЦе ~ Apt.
        assertNotNullish(123);
      }).not.toThrow();
    });
  });

  describe('assertRange', () => {
    test('out of range should throw', () => {
      expect(() => {
        assertRange(5 < 1, 'Value is bigger than 1.');
        assertRange(1 > 100, 'Value is less than 100.');
      }).toThrow();
    });
    test('in range should not throw', () => {
      expect(() => {
        assertRange(1 < 5, 'Value is bigger than 1.');
        assertRange(100 > 1, 'Value is less than 100.');

        assertRange(
          // eslint-disable-next-line no-constant-binary-expression
          100 > 1 && 100 < 200,
          'Value is less than 100 and more than 200.'
        );
      }).not.toThrow();
    });
  });

  describe('indexOfReplaceAll', () => {
    test('replaces all instances of searchValue with replaceValue', () => {
      const string = 'hello world, hello universe';
      const searchValue = 'hello';
      const replaceValue = 'hi';
      const result = indexOfReplaceAll(string, searchValue, replaceValue);
      expect(result).toBe('hi world, hi universe');
    });
    test('returns the original string if searchValue is not found', () => {
      const string = 'hello world';
      const searchValue = 'hi';
      const replaceValue = 'hello';
      const result = indexOfReplaceAll(string, searchValue, replaceValue);
      expect(result).toBe(string);
    });
    test('handles an empty string', () => {
      const string = '';
      const searchValue = 'hello';
      const replaceValue = 'hi';
      const result = indexOfReplaceAll(string, searchValue, replaceValue);
      expect(result).toBe('');
    });
    test('handles replacing with an empty string', () => {
      const string = 'hello world, hello universe';
      const searchValue = 'hello';
      const replaceValue = '';
      const result = indexOfReplaceAll(string, searchValue, replaceValue);
      expect(result).toBe(' world,  universe');
    });
    test('handles a searchValue that is a substring of replaceValue', () => {
      const string = 'foofoofoo';
      const searchValue = 'foo';
      const replaceValue = 'foofoo';
      const result = indexOfReplaceAll(string, searchValue, replaceValue);
      expect(result).toBe('foofoofoofoofoofoo');
    });
    test('handles a searchValue that is the entire string', () => {
      const string = 'hello';
      const searchValue = 'hello';
      const replaceValue = 'hi';
      const result = indexOfReplaceAll(string, searchValue, replaceValue);
      expect(result).toBe('hi');
    });
  });

  describe('hexStringToRgb', () => {
    test('converts 6-char hex string to RGB', () => {
      expect(hexStringToRgb('00AAFF')).toEqual([0, 170, 255]);
    });
    test('converts 3-char hex string to RGB', () => {
      expect(hexStringToRgb('0AF')).toEqual([0, 170, 255]);
    });
    test('converts 1-char hex string to RGB', () => {
      expect(hexStringToRgb('F')).toEqual([255, 255, 255]);
    });
    test('throws error for invalid hex string length', () => {
      expect(() => hexStringToRgb('00')).toThrow();
    });
    test('throws error for non-string input', () => {
      // @ts-expect-error Testing purposes.
      expect(() => hexStringToRgb(123)).toThrow();
    });
  });

  describe('hexNumberToRgb', () => {
    test('converts hex number to RGB', () => {
      expect(hexNumberToRgb(0x00aaff)).toEqual([0, 170, 255]);
    });
    test('throws error for invalid hex number range', () => {
      expect(() => hexNumberToRgb(-1)).toThrow();
      expect(() => hexNumberToRgb(0x1000000)).toThrow();
    });
    test('throws error for non-number input', () => {
      // @ts-expect-error Testing purposes.
      expect(() => hexNumberToRgb('00AAFF')).toThrow();
    });

    describe('hslToRgb', () => {
      test('converts HSL to RGB', () => {
        expect(hslToRgb(0, 100, 50)).toEqual([255, 0, 0]);
        expect(hslToRgb(120, 100, 50)).toEqual([0, 255, 0]);
        expect(hslToRgb(240, 100, 50)).toEqual([0, 0, 255]);
      });
      test('throws error for invalid HSL range', () => {
        expect(() => hslToRgb(360, 100, 50)).toThrow();
        expect(() => hslToRgb(0, 101, 50)).toThrow();
        expect(() => hslToRgb(0, 100, 101)).toThrow();
      });
      test('throws error for non-number input', () => {
        //@ts-expect-error Testing purposes.
        expect(() => hslToRgb('0', 100, 50)).toThrow();
        //@ts-expect-error Testing purposes.
        expect(() => hslToRgb(0, '100', 50)).toThrow();
        //@ts-expect-error Testing purposes.
        expect(() => hslToRgb(0, 100, '50')).toThrow();
      });
    });
  });

  describe('rgbToEcRgb', () => {
    test('converts RGB to escape code string', () => {
      expect(rgbToEcRgb(255, 0, 0)).toBe('255;0;0');
    });
    test('throws error for invalid RGB range', () => {
      expect(() => rgbToEcRgb(256, 0, 0)).toThrow();
      expect(() => rgbToEcRgb(255, -1, 0)).toThrow();
      expect(() => rgbToEcRgb(255, 0, 256)).toThrow();
    });
    test('throws error for non-number input', () => {
      //@ts-expect-error Testing purposes.
      expect(() => rgbToEcRgb('255', 0, 0)).toThrow();
      //@ts-expect-error Testing purposes.
      expect(() => rgbToEcRgb(255, '0', 0)).toThrow();
      //@ts-expect-error Testing purposes.
      expect(() => rgbToEcRgb(255, 0, '0')).toThrow();
    });
  });
});
