import { isPlainObject } from './is-type'
import { pickBy } from './lodash-modern'

export type JsonObject = Record<string, unknown>

/**
 * Narrows unknown values to plain JSON objects.
 */
export function isRecord(value: unknown): value is JsonObject {
  return isPlainObject(value)
}

/**
 * Returns a JSON object when the value has one.
 */
export function recordValue(value: unknown): JsonObject | undefined {
  return isRecord(value) ? value : undefined
}

/**
 * Removes only undefined fields from an object.
 */
export function compactRecord<T extends Record<string, unknown>>(value: T): T {
  return pickBy(value, entry => entry !== undefined) as T
}

/**
 * Reads one object field from optional JSON arguments.
 */
export function recordArg(args: JsonObject | undefined, key: string): JsonObject | undefined {
  const value = args?.[key]
  return isRecord(value) ? value : undefined
}

/**
 * Reads one string field from optional JSON arguments.
 */
export function stringArg(args: JsonObject | undefined, key: string): string | undefined {
  const value = args?.[key]
  return typeof value === 'string' ? value : undefined
}

/**
 * Reads a nested object path, returning an empty object when absent.
 */
export function objectPath(source: unknown, path: string[]): JsonObject {
  const value = path.reduce<unknown>((current, key) => (isRecord(current) ? current[key] : undefined), source)
  return isRecord(value) ? value : {}
}

/**
 * Reads a nested string path from unknown JSON.
 */
export function deepString(value: unknown, path: string[]): string | undefined {
  let current = value
  for (const key of path) {
    if (!isRecord(current)) return undefined
    current = current[key]
  }
  return typeof current === 'string' ? current : undefined
}

/**
 * Reads a nested array path from unknown JSON.
 */
export function arrayPath(value: unknown, path: string[]): unknown[] {
  let current = value
  for (const key of path) {
    if (!isRecord(current)) return []
    current = current[key]
  }
  return Array.isArray(current) ? current : []
}

/**
 * Returns the first non-empty string among candidate keys.
 */
export function firstString(record: JsonObject, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.length > 0) return value
  }
}

/**
 * Returns the first finite number among candidate keys.
 */
export function firstNumber(record: JsonObject, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'number' && Number.isFinite(value)) return value
  }
}

/**
 * Stringifies unknown values without throwing on cyclic or unusual inputs.
 */
export function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? 'undefined'
  } catch {
    return String(value)
  }
}

/**
 * Normalizes unknown input to a JSON object shape.
 */
export function jsonObject(value: unknown): JsonObject {
  const normalized = jsonValue(value)
  return isRecord(normalized) ? normalized : {}
}

/**
 * Converts unknown values into JSON-safe primitives, arrays, and objects.
 */
export function jsonValue(value: unknown): unknown {
  if (value === null || value === undefined) return null
  if (Array.isArray(value)) return value.map(jsonValue)
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value
  if (isRecord(value)) return Object.fromEntries(Object.entries(value).map(([key, value]) => [key, jsonValue(value)]))
  return String(value)
}
