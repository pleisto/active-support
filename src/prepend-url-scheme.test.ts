import { describe, expect, it } from 'vitest'

import { prependUrlScheme } from './prepend-url-scheme'

describe('prependUrlScheme', () => {
  it('keeps it as custom protocol correctly', () => {
    const link1 = 'some-custom-protocol://send/abc@example.org'
    expect(prependUrlScheme(link1)).toEqual(link1)

    const link2 = 'some-custom-protocol://example.org'
    expect(prependUrlScheme(link2)).toEqual(link2)
  })

  it('prepends http correctly', () => {
    const httpUrl = 'http://mashpod.cloud'
    const httpsUrl = 'https://mashpod.cloud'

    expect(prependUrlScheme('mashpod.cloud')).toEqual(httpUrl)
    expect(prependUrlScheme('http://mashpod.cloud')).toEqual(httpUrl)
    expect(prependUrlScheme('http://mashpod.cloud?id=123')).toEqual(`${httpUrl}?id=123`)
    expect(prependUrlScheme('https://mashpod.cloud')).toEqual(httpsUrl)
    expect(prependUrlScheme('//mashpod.cloud')).toEqual('//mashpod.cloud')
  })

  it('prepends mail correctly', () => {
    const mailUrl = 'mailto:people@mashpod.cloud'

    expect(prependUrlScheme('people@mashpod.cloud')).toEqual(mailUrl)
    expect(prependUrlScheme('mailto:people@mashpod.cloud')).toEqual(mailUrl)
  })
})
