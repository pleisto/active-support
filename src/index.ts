import { arrayToTree, type Config, type Item } from 'performant-array-to-tree'

export * from './byte-size'
export * from './is-type'
export * from './lodash-modern'
export * from './inflections'
export * from './results'
export * from './prepend-url-scheme'
export * from './sleep'
export * from './ts-types'
export * from './base58'
export * from './uuid'

// third utils
export * from 'ts-pattern' // rust style pattern matching

export * from './time'
/**
 * Converts an array of items with ids and parent ids to a nested tree in a performant way (time complexity `O(n)`).
 *
 * @param items array of items
 * @param config please see `performant-array-to-tree`
 */
export function array2Tree<TItem extends Item>(
  items: TItem[],
  config: Partial<Config> = {}
): Array<TItem & { children: TItem[] }> {
  return arrayToTree(items, {
    ...config,
    dataField: null,
    nestedIds: false
  }) as Array<TItem & { children: TItem[] }>
}

/**
 * Empty function.
 */
export function noop(..._: any[]): any {}
