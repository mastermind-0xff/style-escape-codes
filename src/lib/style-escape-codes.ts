// import { Flags, FlagsType, type Flag } from './constants';

import type { FlagsType } from './constants';
import { Flags, Flag, StringEnd } from './constants';
import { SecSettings } from './settings';
import {
  assertType,
  hexNumberToRgb,
  hexStringToRgb,
  hslToRgb,
  indexOfReplaceAll,
  rgbToEcRgb,
} from './utils';

export type ColorMappingsType = typeof ColorMappings;
export type ColorMappingsAsCallable = {
  [K in keyof ColorMappingsType]: (
    ...args: Parameters<ColorMappingsType[K]>
  ) => CallableProperty;
};

export type FlagsAsCallable = {
  [K in keyof FlagsType]: CallableProperty;
};

export type CallableProperty = {
  /**
   * Surround text with currently set styles.
   */
  (message: string): string;
  /**
   * Outputs current escape codes sequence without closing it. Every console
   * message from now on will have the current styles until end()-ed or reset
   * flag is used. Same as executing toString() or implicitly coerce to string.
   */
  set: () => string;
  /** Outputs closing flags for the current escape codes sequence. */
  unset: () => string;
  /** Outputs current escape codes sequence without closing it. Same as
   * executing set() */
  toString: () => string;
  /** Current nested level escape codes that add styles. */
  queryCodesSet: string;
  /** Current nested level escape codes that remove styles. */
  queryCodesUnset: string;
} & ColorMappingsAsCallable &
  FlagsAsCallable;

export type StyleEscapeCodes = {
  (): never;
  queryCodesSet: '';
  queryCodesUnset: '';
  /**
   * Disable StyleEscapeCodes. Input text will become output without any escape
   * codes. Cached root styles are deleted from the chain and all branches will be
   * marked for garbage collection. Do not keep any references to a style if you
   * plan to dynamically disable and enable this tool as this will prevent the
   * garbage collection process.
   *
   * ```javascript
   * const myStyle = sec.b.u.fgRed;
   * // prints with styles
   * console.log(sec.b.u.fgRed('Important message'));
   * // prints with styles
   * console.log(myStyle('Important message'));
   * sec.disable();
   * // prints without styles
   * console.log(sec.b.u.fgRed('Important message'));
   * // prints with styles!!!
   * console.log(myStyle('Important message'));
   * sec.enable();
   * ```
   *
   * @returns true if status is changed to disabled, false otherwise.
   */
  disable: () => boolean;
  /**
   * Enable StyleEscapeCodes.
   * @returns true if status is changed to enabled, false otherwise.
   */
  enable: () => boolean;
} & ColorMappingsAsCallable &
  FlagsAsCallable;

/**
 * Holder object to redirect color calls to be converted to RGB escape code
 * sequence.
 */
const ColorMappings = {
  /**
   * Set foreground or background color using hex string or number.
   * @param hexInput number [0, 16777215] or string of length 6, 3 or 1
   * characters
   */
  hex: (hexInput: string | number) => {
    assertType<string | number>(
      typeof hexInput === 'number' || typeof hexInput === 'string',
      hexInput
    );
    if (typeof hexInput === 'string') return hexStringToRgb(hexInput);
    return hexNumberToRgb(hexInput);
  },
  /**
   * Set foreground or background color using hue, saturation and lightness.
   * @param h Hue - number [0, 360)
   * @param s Saturation - number [0, 100]
   * @param l Lightness - number [0, 100]
   */
  hsl: hslToRgb,
  /**
   * Set foreground or background color using red, green and blue.
   * @param r Red - number [0, 255]
   * @param g Green - number [0, 255]
   * @param b Blue - number [0, 255]
   * @returns
   */
  rgb: (r: number, g: number, b: number) =>
    [r, g, b] as [number, number, number],
} as const;

/** \_\_proto\_\_ base for each new branch. */
const branchBase = () => {};

const wrapCodes = (codes: string) => `\x1b[${codes.substring(1)}m`;

let spawnBranch: (set: string, unset: string) => (message: string) => string;

const branch = (queryCodesSet: string, queryCodesUnset: string) => {
  const callable = (message: string) =>
    wrapCodes(queryCodesSet) +
    indexOfReplaceAll(
      message,
      StringEnd,
      wrapCodes(queryCodesSet) + StringEnd
    ) +
    wrapCodes(queryCodesUnset) +
    StringEnd;

  callable.queryCodesSet = queryCodesSet;
  callable.queryCodesUnset = queryCodesUnset;
  callable.toString = callable.set = () => wrapCodes(queryCodesSet);
  callable.unset = () => wrapCodes(queryCodesUnset) + StringEnd;

  Object.setPrototypeOf(callable, branchBase);

  return callable;
};

/**
 * Swap function to replace creation of a new branch in case of disable signal.
 * @param args Sponge any arguments.
 * @returns Callable that will output the input.
 */
const branchDisabled = (queryCodesSet: string, queryCodesUnset: string) => {
  const callable = (message: string) => message;
  callable.queryCodesSet = queryCodesSet;
  callable.queryCodesUnset = queryCodesUnset;
  callable.toString = callable.set = () => '';
  callable.unset = () => '';

  Object.setPrototypeOf(callable, branchBase);
  return callable;
};

if (SecSettings.enabled) spawnBranch = branch;
else spawnBranch = branchDisabled;

// add flags to the base
(Object.entries(Flags) as [Flag, FlagsType[Flag]][]).forEach(
  ([name, value]) => {
    Object.defineProperty(branchBase, name, {
      get() {
        const branch = spawnBranch(
          this.queryCodesSet + ';' + value[0],
          this.queryCodesUnset + ';' + value[1]
        );

        Object.defineProperty(this, name, {
          enumerable: true,
          configurable: true,
          value: branch,
        });
        return branch;
      },
      enumerable: false,
      configurable: true,
    });
  }
);

// add color mappings to the base
(
  Object.entries(ColorMappings) as [
    keyof ColorMappingsType,
    ColorMappingsType[keyof ColorMappingsType],
  ][]
).forEach(([name]) => {
  Object.defineProperty(branchBase, name, {
    get() {
      const colorMapping = (...args: (string | number)[]) => {
        const color = rgbToEcRgb(
          // @ts-expect-error Each color mapping handles type safety during runtime using asserts
          ...ColorMappings[name](...args)
        );
        const branch = spawnBranch(
          this.queryCodesSet + ';' + color,
          this.queryCodesUnset
        );
        return branch;
      };

      Object.defineProperty(this, name, {
        enumerable: true,
        configurable: true,
        value: colorMapping,
      });
      return colorMapping;
    },
  });
});

/**
 * Change terminal output style, if ansi escape codes are supported. Each
 * terminal has slightly different output for predefined color values. Supports
 * stacking, nested and global styles, RGB, HSL and HEX color spaces.
 *
 * __examples:__
 * ```javascript
 * console.log(sec.bold.underline.red('bold underline red message'));
 * console.log(sec.b.u.fgRed('bold underline red message'));
 * console.log(sec.b.u.fg.rgb(255, 0, 0)('bold underline red message'));
 * console.log(sec.b.u.fg.hex('ff0000')('bold underline red message'));
 * console.log(sec.b.u.fg.hex('f00')('bold underline red message'));
 * console.log(sec.b.u.fg.hex(0xff0000)('bold underline red message'));
 * console.log(sec.b.u.fg.hsl(0, 100, 50)('bold underline red message'));
 * console.log(sec.b.u.fgRed + 'bold underline red message' + sec.b.u.fg.unset());
 * ```
 */
export const sec: StyleEscapeCodes = Object.setPrototypeOf(() => {
  throw new TypeError('Style Escape Codes should not be called directly.');
}, branchBase);

// set to empty to avoid writing this.queryCodesSet || '' in proto every time
sec.queryCodesSet = '';
sec.queryCodesUnset = '';

const deleteRootProperties = () => {
  const omitKeys = ['queryCodesSet', 'queryCodesUnset', 'disable', 'enable'];
  (Object.keys(sec) as Array<keyof StyleEscapeCodes>)
    .filter((v) => !omitKeys.includes(v))
    .forEach((p) => {
      delete sec[p];
    });
};

sec.disable = () => {
  if (!SecSettings.enabled) return false;
  deleteRootProperties();
  spawnBranch = branchDisabled;
  SecSettings.enabled = false;
  return true;
};

sec.enable = () => {
  if (SecSettings.enabled) return false;
  deleteRootProperties();
  spawnBranch = branch;
  SecSettings.enabled = true;
  return true;
};
