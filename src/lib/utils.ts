export type ECNumber = `${number};${number};${number}`;

/**
 * Asserts the value is of type T if the condition is met.
 * @param condition Assert condition.
 * @param value Value to assert for.
 */
export function assertType<T>(
  condition: boolean,
  value: unknown
): asserts value is T {
  if (!condition) throw new TypeError(`${value} is not of the expected type.`);
}
/**
 * Asserts the value if non nullish.
 * @param value Value to check for nullish.
 */
export function assertNotNullish(
  value: unknown
): asserts value is NonNullable<typeof value> {
  if (null == value) throw TypeError('Value is nullish.');
}

/**
 * Asserts range condition and throws RangeError otherwise.
 * @param condition Range condition.
 * @param errorMessage Error message if condition is not met.
 */
export function assertRange(
  condition: boolean,
  errorMessage: string = 'Value is out of range.'
) {
  if (!condition) throw new RangeError(errorMessage);
}

/**
 * Find and replace all occurrences of a given string with another string.
 * @param string String to search in.
 * @param searchValue String to search for.
 * @param replaceValue String to replace all occurrences with.
 * @returns String with all matches replaced, or exact same source string if non
 * found.
 */
export const indexOfReplaceAll = (
  string: string,
  searchValue: string,
  replaceValue: string
) => {
  let currentIndex = string.indexOf(searchValue);
  if (currentIndex === -1) return string;
  let lastIndex = 0;
  let newString = '';

  while (currentIndex !== -1) {
    newString += string.slice(lastIndex, currentIndex) + replaceValue;
    lastIndex = currentIndex + searchValue.length;
    currentIndex = string.indexOf(searchValue, lastIndex);
  }
  return newString + string.slice(lastIndex);
};

/**
 * Convert hex string to r, g, b tuple.
 * ```javascript
 * hexStringToRgb('00AAFF') // => [0, 170, 255]
 * hexStringToRgb('0AF') // => [0, 170, 255]
 * hexStringToRgb('F') // => [255, 255, 255]
 * ```
 * @param hexInput 6, 3 or 1 char hex input.
 * @returns [R, G, B] tuple. Each component is in the range of [0, 255].
 */
export const hexStringToRgb = (hexInput: string): [number, number, number] => {
  assertType<string>(typeof hexInput === 'string', hexInput);
  assertRange(
    hexInput.length === 6 || hexInput.length === 3 || hexInput.length === 1
  );
  let newHex = hexInput;
  if (hexInput.length !== 6) {
    newHex = hexInput
      .split('')
      .reduce(
        (acc, singleHexChar) =>
          (acc += singleHexChar.repeat(6 / hexInput.length)),
        ''
      );
  }
  return hexNumberToRgb(parseInt(newHex, 16));
  // return newHex.match(/(.{2})/g)!.reduce((acc, hexPair) => {
  //   acc.push(parseInt(hexPair, 16));
  //   return acc;
  // }, [] as number[]) as [number, number, number];
};

/**
 * Convert hex number to r, g, b tuple.
 * @param hexInput Hex number.
 * @returns [R, G, B] tuple. Each component is in the range of [0, 255].
 */
export const hexNumberToRgb = (hexInput: number) => {
  assertType<number>(typeof hexInput === 'number', hexInput);
  assertRange(hexInput >= 0 && hexInput <= 16777215);
  const b = hexInput & 0xff;
  const g = (hexInput >> 8) & 0xff;
  const r = hexInput >> 16;
  return [r, g, b] as [number, number, number];
};

/**
 * Convert hue, saturation, lightness to r, g, b tuple.
 * @param h Hue - number [0, 360).
 * @param s Saturation - number [0, 100].
 * @param l Lightness - number [0, 100].
 * @returns [R, G, B] tuple. Each component is in the range of [0, 255].
 */
export const hslToRgb = (h: number, s: number, l: number) => {
  assertType<number>(typeof h === 'number', h);
  assertType<number>(typeof s === 'number', s);
  assertType<number>(typeof l === 'number', l);
  assertRange(h >= 0 && h < 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100);

  const f = (n: number) => {
    const S = s / 100,
      L = l / 100,
      k = (n + h / 30) % 12,
      a = S * Math.min(L, 1 - L);
    return Math.round((L - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
  };

  return [f(0), f(8), f(4)] as [number, number, number];
};

/**
 * Convert red, green, blue to escape code sequence for r, g, b.
 * @param r number [0, 255].
 * @param g number [0, 255].
 * @param b number [0, 255].
 * @returns String representation of the r, g, b color to be used in escape code
 * sequence.
 */
export const rgbToEcRgb = (r?: number, g?: number, b?: number): ECNumber => {
  assertType<number>(typeof r === 'number', r);
  assertType<number>(typeof g === 'number', g);
  assertType<number>(typeof b === 'number', b);
  assertRange(r >= 0 && r < 256 && g >= 0 && g < 256 && b >= 0 && b < 256);
  return `${r};${g};${b}`;
};

/**
 * Get environment variable value for both NodeJS and Deno.
 * @param name Environment variable name.
 * @returns Value or undefined.
 */
export const getEnv = (name: string): unknown | undefined => {
  if (process && process.env) return process.env[name];
  // @ts-expect-error Deno types might not be available.
  if (Deno && Deno.env) return Deno.env.get(name);
  return undefined;
};
