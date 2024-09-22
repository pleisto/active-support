import { Result } from 'neverthrow'

/**
 * JSON Parser with result wrapper
 */
export const safeJsonParse = Result.fromThrowable(JSON.parse)

export * from 'neverthrow' // rust style error handing
