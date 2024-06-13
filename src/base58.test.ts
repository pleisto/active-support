import { describe, test, expect } from 'vitest'
import { base58Decode, base58Encode } from './base58'

const testSetString = [
  ['f', '2m'],
  ['ß', 'FtS'],
  ['foobar', 't1Zv2yaZ'],
  ['Hello World!', '2NEpo7TZRRrLZSi2U'],
  [new Uint8Array([0, 0, 0, 40, 127, 180, 205]), '111233QC4']
]

describe('base58', () => {
  test('should encode', () => {
    for (const [input, output] of testSetString) {
      expect(base58Encode(input!)).toBe(output)
    }
  })
  test('should decode', () => {
    const enc = new TextEncoder()
    for (const [input, output] of testSetString) {
      expect(base58Decode(output as string)).toStrictEqual(typeof input === 'string' ? enc.encode(input) : input)
    }
  })
})
