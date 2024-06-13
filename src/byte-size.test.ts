import { expect, test, describe } from 'vitest'
import { byteSize } from './byte-size'

describe('.byteSize', () => {
  test('should work', () => {
    expect(byteSize('2 EB')).toEqual(byteSize('2000 PB'))
    expect(byteSize('0.001 TB')).toEqual(byteSize('1 gb'))
    expect(byteSize('3 mb')).toEqual(24_000_000)
    expect(byteSize('2 Gigabytes')).toEqual(16_000_000_000)
    expect(byteSize('1 Byte')).toEqual(8)
    expect(byteSize(32_000_000)).toEqual('4 MB')
    expect(byteSize('99 kb')).toEqual(byteSize('99 kilobytes'))
    expect(byteSize(2)).toEqual('2 Bits')
    expect(byteSize('8 bit')).toEqual(byteSize('1 bytes'))
    // @ts-expect-error test case
    expect(byteSize('3xxx')).toEqual(NaN)
    // @ts-expect-error test case
    expect(() => byteSize({ foo: 1 })).toThrowError()
  })
})
