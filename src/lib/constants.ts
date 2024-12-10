const FOREGROUND_COLOR_DEFAULT = 39;
const BACKGROUND_COLOR_DEFAULT = 49;

/**
 * List of foreground color ansi escape codes. [set code, unset code].
 */
export const ForegroundColors = {
  foregroundColor: ['38;2', FOREGROUND_COLOR_DEFAULT],
  fgBlack: [30, FOREGROUND_COLOR_DEFAULT],
  fgRed: [31, FOREGROUND_COLOR_DEFAULT],
  fgGreen: [32, FOREGROUND_COLOR_DEFAULT],
  fgYellow: [33, FOREGROUND_COLOR_DEFAULT],
  fgBlue: [34, FOREGROUND_COLOR_DEFAULT],
  fgMagenta: [35, FOREGROUND_COLOR_DEFAULT],
  fgCyan: [36, FOREGROUND_COLOR_DEFAULT],
  fgWhite: [37, FOREGROUND_COLOR_DEFAULT],
  fgBrightBlack: [90, FOREGROUND_COLOR_DEFAULT],
  fgBrightRed: [91, FOREGROUND_COLOR_DEFAULT],
  fgBrightGreen: [92, FOREGROUND_COLOR_DEFAULT],
  fgBrightYellow: [93, FOREGROUND_COLOR_DEFAULT],
  fgBrightBlue: [94, FOREGROUND_COLOR_DEFAULT],
  fgBrightMagenta: [95, FOREGROUND_COLOR_DEFAULT],
  fgBrightCyan: [96, FOREGROUND_COLOR_DEFAULT],
  fgBrightWhite: [97, FOREGROUND_COLOR_DEFAULT],
} as const;

export type ForegroundColorsType = typeof ForegroundColors;

/**
 * List of background color ansi escape codes. [set code, unset code].
 */
export const BackgroundColors = {
  backgroundColor: ['48;2', BACKGROUND_COLOR_DEFAULT],
  bgBlack: [40, BACKGROUND_COLOR_DEFAULT],
  bgRed: [41, BACKGROUND_COLOR_DEFAULT],
  bgGreen: [42, BACKGROUND_COLOR_DEFAULT],
  bgYellow: [43, BACKGROUND_COLOR_DEFAULT],
  bgBlue: [44, BACKGROUND_COLOR_DEFAULT],
  bgMagenta: [45, BACKGROUND_COLOR_DEFAULT],
  bgCyan: [46, BACKGROUND_COLOR_DEFAULT],
  bgWhite: [47, BACKGROUND_COLOR_DEFAULT],
  bgBrightBlack: [100, BACKGROUND_COLOR_DEFAULT],
  bgBrightRed: [101, BACKGROUND_COLOR_DEFAULT],
  bgBrightGreen: [102, BACKGROUND_COLOR_DEFAULT],
  bgBrightYellow: [103, BACKGROUND_COLOR_DEFAULT],
  bgBrightBlue: [104, BACKGROUND_COLOR_DEFAULT],
  bgBrightMagenta: [105, BACKGROUND_COLOR_DEFAULT],
  bgBrightCyan: [106, BACKGROUND_COLOR_DEFAULT],
  bgBrightWhite: [107, BACKGROUND_COLOR_DEFAULT],
} as const;

export type BackgroundColorsType = typeof BackgroundColors;

/**
 * List of text style ansi escape codes. [set code, unset code].
 */
export const Style = {
  reset: [0, 0],
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  invert: [7, 27],
  hide: [8, 28],
  strike: [9, 29],
  underlineDouble: [21, 24],
  overline: [53, 55],
} as const;

const Shorts = {
  /** Short flag for reset. */
  r: Style.reset,
  /** Short flag for bold. */
  b: Style.bold,
  /** Short flag for dim. */
  d: Style.dim,
  /** Short flag for italic. */
  i: Style.italic,
  /** Short flag for underline. */
  u: Style.underline,
  /** Short flag for invert. */
  inv: Style.invert,
  /** Short flag for hide. */
  h: Style.hide,
  /** Short flag for strike. */
  s: Style.strike,
  /** Short flag for underlineDouble. */
  ud: Style.underlineDouble,
  /** Short flag for overline. */
  o: Style.overline,
  /** Short flag for foregroundColor. */
  fg: ForegroundColors.foregroundColor,
  /** Short flag for backgroundColor. */
  bg: BackgroundColors.backgroundColor,
  /** Short flag for fgBlack. */
  black: ForegroundColors.fgBlack,
  /** Short flag for fgRed. */
  red: ForegroundColors.fgRed,
  /** Short flag for fgGreen. */
  green: ForegroundColors.fgGreen,
  /** Short flag for fgYellow. */
  yellow: ForegroundColors.fgYellow,
  /** Short flag for fgBlue. */
  blue: ForegroundColors.fgBlue,
  /** Short flag for fgMagenta. */
  magenta: ForegroundColors.fgMagenta,
  /** Short flag for fgCyan. */
  cyan: ForegroundColors.fgCyan,
  /** Short flag for fgWhite. */
  white: ForegroundColors.fgWhite,
  /** Short flag for fgBrightBlack. */
  brightBlack: ForegroundColors.fgBrightBlack,
  /** Short flag for fgBrightRed. */
  brightRed: ForegroundColors.fgBrightRed,
  /** Short flag for fgBrightGreen. */
  brightGreen: ForegroundColors.fgBrightGreen,
  /** Short flag for fgBrightYellow. */
  brightYellow: ForegroundColors.fgBrightYellow,
  /** Short flag for fgBrightBlue. */
  brightBlue: ForegroundColors.fgBrightBlue,
  /** Short flag for fgBrightMagenta. */
  brightMagenta: ForegroundColors.fgBrightMagenta,
  /** Short flag for fgBrightCyan. */
  brightCyan: ForegroundColors.fgBrightCyan,
  /** Short flag for fgBrightWhite. */
  brightWhite: ForegroundColors.fgBrightWhite,
} as const;

/**
 * Escape code sequence termination string.
 */
export const StringEnd = '\x1b[99m';

/**
 * Complete list of supported ansi escape codes.
 */
export const Flags = {
  ...Shorts,
  ...ForegroundColors,
  ...BackgroundColors,
  ...Style,
} as const;

export type FlagsType = typeof Flags;
export type Flag = keyof FlagsType;
