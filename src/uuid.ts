import { base58Encode } from './base58'
/**
 * Generates a Shortened UUID
 *
 * **Warning**:
 * This only supports browser environment.
 * for NodeJS environment please use `import { UUIDShorten } form '@pleisto/rusty-support'` instead.
 */
export const uuidShort = (): string => {
  const buffer = crypto.getRandomValues(new Uint8Array(16))

  // https://tools.ietf.org/html/rfc4122#section-4.4
  buffer[6] = (buffer[6]! & 0x0f) | 0x40
  buffer[8] = (buffer[8]! & 0x3f) | 0x80

  return base58Encode(buffer)
}

export { v4 as uuidV4 } from '@lukeed/uuid'
