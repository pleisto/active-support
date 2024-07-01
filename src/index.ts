import { type Config, type Item, arrayToTree } from 'performant-array-to-tree'

export * from './base58'
export * from './byte-size'
export * from './inflections'
export * from './is-type'
export * from './lodash-modern'
export * from './prepend-url-scheme'
export * from './results'
export * from './sleep'
export * from './time'
export * from './ts-types'
export * from './uuid'

// third utils
export * from 'mutative'
export * from 'ts-pattern' // rust style pattern matching

/**
 * Converts an array of items with ids and parent ids to a nested tree in a performant way (time complexity `O(n)`).
 *
 * @param items array of items
 * @param config please see `performant-array-to-tree`
 */
export function array2Tree<TItem extends Item>(
  items: TItem[],
  config: Partial<Config> = {}
): Array<{ children: TItem[] } & TItem> {
  return arrayToTree(items, {
    ...config,
    dataField: null,
    nestedIds: false
  }) as Array<{ children: TItem[] } & TItem>
}

/**
 * Empty function.
 */
export function noop(..._: any[]): any {}
