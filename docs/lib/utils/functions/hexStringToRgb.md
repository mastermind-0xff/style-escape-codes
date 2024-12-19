[**style-escape-codes**](../../../README.md) • **Docs**

***

[style-escape-codes](../../../modules.md) / [lib/utils](../README.md) / hexStringToRgb

# Function: hexStringToRgb()

> **hexStringToRgb**(`hexInput`): [`number`, `number`, `number`]

Convert hex string to r, g, b tuple.
```javascript
hexStringToRgb('00AAFF') // => [0, 170, 255]
hexStringToRgb('0AF') // => [0, 170, 255]
hexStringToRgb('F') // => [255, 255, 255]
```

## Parameters

• **hexInput**: `string`

6, 3 or 1 char hex input.

## Returns

[`number`, `number`, `number`]

[R, G, B] tuple. Each component is in the range of [0, 255].

## Defined in

[lib/utils.ts:72](https://github.com/mastermind-0xff/style-escape-codes/blob/86f72e47c8a4169fb2601208e7c23c504221a7fb/src/lib/utils.ts#L72)
