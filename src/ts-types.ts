/**
 * make all properties optional recursively.
 *
 * @source
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * pick all required properties from an object.
 *
 * @source
 */
export type RequiredKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Prepend tuple.
 *
 * @example
 * ```typescript
 * const const: Cons<1, [2, 3, 4]> = [1, 2, 3, 4]
 * ```
 *
 * @source
 */
export type Cons<H, T extends readonly any[]> = ((
  h: H,
  ...t: T
) => void) extends (...r: infer R) => void
  ? R
  : never;

/**
 * Prepend Parameter.
 *
 * @example
 * ```typescript
 * type F = (x: number) => boolean
 * type F2 = PrependParameter<string, F> // type F2 = (s: string, x: number) => boolean
 * ```
 *
 * @source
 */
export type PrependParameter<Param, F extends (...args: any[]) => any> = (
  ...args: Extract<Cons<Param, Parameters<F>>, readonly any[]>
) => ReturnType<F>;

/**
 * Fixed length tuple.
 *
 * @example
 * ```typescript
 * const x: FixedLengthTuple<number, 3> = [1, 2, 3]
 * ```
 *
 * @source
 */
export type FixedLengthTuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _FixedLengthTuple<T, N, []>
  : never;

type _FixedLengthTuple<
  T,
  N extends number,
  R extends unknown[],
> = R["length"] extends N ? R : _FixedLengthTuple<T, N, [T, ...R]>;

/**
 * Make some field required
 *
 * @source
 */
export type RequireField<T, K extends keyof T> = Required<Pick<T, K>> & T;

/**
 * Repeat string
 *
 * @example
 * ```typescript
 * const x: Repeat<'1' | '2', 4> = '1122'
 * ```
 *
 * @source
 */
export type Repeat<
  Char extends string,
  Count extends number,
  Joined extends string = ``,
  Acc extends Array<0> = [],
> = Acc["length"] extends Count
  ? Joined
  : Repeat<Char, Count, `${Joined}${Char}`, [0, ...Acc]>;

/**
 * Value of a array
 */
export type ValueOf<T> = T[keyof T];

/**
 * This is a type that removes the optional mark from the properties in the K union.
 * This means that they will be required.
 * @example
 * type Foo = {
 * bar?: string
 * baz?: number
 * }
 * type FooRequired = WithRequired<Foo, 'bar' | 'baz'>
 * // type FooRequired = {
 * // bar: string
 * // baz: number
 * // }
 */
export type WithRequired<T, K extends keyof T> = { [P in K]-?: T[P] } & T;

// https://stackoverflow.com/a/68866939/20030734
export type Copy<T extends object> = { [K in keyof T]: T[K] };

/**
 * The UnionToIntersection type in TypeScript is used to convert a union type to an intersection type.
 * This can be useful when you have a union type that contains multiple types,
 * and you want to use the properties of all of those types in a single type or value.
 *
 * @example
 * ```typescript
 *  const data: UnionToIntersection<{ a: string } | { b: string }> = { a: 'hello', b: 'world' }
 * ```
 */

export type UnionToIntersection<U> = (
  U extends U ? (x: U) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never;

/**
 * Check if type is `any`.
 *
 * @example
 * ```typescript
 * const isAny: IsAny<any> = true
 * ```
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * Check if type is `never`.
 *
 * @example
 * ```typescript
 * const isNever: IsNever<never> = true
 * ```
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Check if type is `unknown`.
 *
 * @example
 * ```typescript
 * const isUnknown: IsUnknown<unknown> = true
 * ```
 */
export type IsUnknown<T> =
  IsAny<T> extends true ? false : unknown extends T ? true : false;

/**
 * Check if type is union type.
 *
 * @example
 * ```typescript
 * const isUnion: IsUnion<"123" | "456"> = true
 * ```
 */
export type IsUnion<T, U extends T = T> = T extends unknown
  ? [U] extends [T]
    ? false
    : true
  : false;

/**
 * Make type writable
 *
 * @example
 * ```typescript
 * const readonly = {a: [1]} as const         // -> { readonly a: readonly [1] }
 * type writable = Writable<typeof readonly>  // -> {a: [1]}
 * ```
 */
export type Writable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Make type deeply writable
 */
export type DeepWriteable<T> = {
  -readonly [P in keyof T]: DeepWriteable<T[P]>;
};

/**
 * Prettify type.
 *
 * @example
 * ```typescript
 * type s = Prettify<{a: 1} & {b: 2}>        // {a: 1, b: 2}
 */
export type Prettify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

/**
 * Opaque type
 *
 * @example
 * ```typescript
 * type ColumnId = Opaque<string, 'ColumnId'>
 * type RowId = Opaque<string, 'RowId'>
 * ```
 */
type StringLiteral<T> = T extends string
  ? string extends T
    ? never
    : T
  : never;

declare const _OPAQUE_TYPE_: unique symbol;

export type Opaque<Type, Token extends string> =
  Token extends StringLiteral<Token>
    ? { readonly [_OPAQUE_TYPE_]: Token } & Type
    : never;

/**
 * Noninferential type parameter.
 *
 * https://github.com/Microsoft/TypeScript/issues/14829#issuecomment-504042546
 */
export type NoInfer<T> = [T][T extends any ? 0 : never];

/**
 * Xor.
 *
 * https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-533146244
 */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
  ? (T & Without<U, T>) | (U & Without<T, U>)
  : T | U;

/**
 * All Xor
 *
 * @example
 * ```typescript
 * type xor = AllXOR<[ { a: AModule }, { b: BModule } ]>
 * ```
 * https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-723571692
 */
export type AllXOR<T extends any[]> = T extends [infer Only]
  ? Only
  : T extends [infer A, infer B, ...infer Rest]
    ? AllXOR<[XOR<A, B>, ...Rest]>
    : never;

/**
 * Non empty array.
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 *  * A type that splits a string literal type `S` into an array of substrings using a separator `SEP`.
 *
 * @example
 * ```typescript
 * Split<'', ''> // -> []
 * Split<'Hi! How are you?', 'z'> // -> ['Hi! How are you?']
 * ```
 */
export type Split<
  S extends string,
  SEP extends string,
  Acc extends string[] = [],
> = string extends S
  ? S[]
  : S extends `${infer F}${SEP}${infer R}`
    ? Split<R, SEP, [...Acc, F]>
    : S extends ""
      ? SEP extends ""
        ? Acc
        : [""]
      : [...Acc, S];

/**
 * Convert union to tuple.
 *
 * @example
 * ```typescript
 * type Example = TuplifyUnion<'a' | 'b' | 'c'>; // Output: ['a' | 'b' | 'c']
 * ```
 */
type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => infer R
    ? R
    : never;

type Push<T extends any[], V> = [...T, V];

export type TuplifyUnion<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;

// https://github.com/microsoft/TypeScript/issues/13298#issuecomment-692864087
export type TupleUnion<U extends string, R extends string[] = []> = {
  [S in U]: Exclude<U, S> extends never
    ? [...R, S]
    : TupleUnion<Exclude<U, S>, [...R, S]>;
}[U] &
  string[];

type LastOfUnion<U> =
  UnionToIntersection<U extends unknown ? (arg: U) => unknown : never> extends (
    arg: infer I,
  ) => unknown
    ? I
    : never;

type UnionToTupleImpl<U, R extends unknown[] = []> = [U] extends [never]
  ? R
  : UnionToTupleImpl<Exclude<U, LastOfUnion<U>>, [...R, LastOfUnion<U>]>;

// https://github.com/type-challenges/type-challenges/issues/31874
export type UnionToTuple<U> = [U] extends [never]
  ? never
  : IsUnion<U> extends false
    ? U
    : UnionToTupleImpl<U>;

export type FastTuple<U> = U[];

/**
 * Enumerate and Range type.
 *
 * @example
 * ```typescript
 * type E = Enumerate<3> // 0 | 1 | 2
 * type R = Range<1, 3> // 1 | 2
 * ```
 */
// export type Enumerate<N extends number> = EnumerateInternal<[], N> extends Array<infer E> ? E : never
type Enumerate<N, A extends number[] = []> = A["length"] extends N
  ? A[number]
  : Enumerate<N, [...A, A["length"]]>;
export type Range<FROM extends number, TO extends number> = Exclude<
  Enumerate<TO>,
  Enumerate<FROM>
>;

/**
 * Check two type is same.
 *
 * @example
 * ```typescript
 * type E = IsEqual<3, 3> // true
 * ```
 */
export type IsEqual<A, B> =
  (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2
    ? true
    : false;

type Numeric = bigint | number;
type Zero = 0 | 0n;

/**
 * A negative `number`/`bigint` (`-∞ < x < 0`)
 */
export type Negative<T extends Numeric> = T extends Zero
  ? never
  : `${T}` extends `-${string}`
    ? T
    : never;

/**
 * A positive `number`/`bigint` (`0 < x < ∞`)
 */
export type Positive<T extends Numeric> = T extends Zero
  ? never
  : Negative<T> extends never
    ? T
    : never;

/**
 * Non negative `number`/`bigint` (`0 <= x < ∞`)
 */
export type NonNegative<T extends Numeric> = T extends Zero
  ? T
  : Negative<T> extends never
    ? T
    : never;

/**
 * Integer
 */
export type Integer<T extends number> = `${T}` extends `${bigint}` ? T : never;

/**
 * Float
 */
export type Float<T extends number> = T extends Integer<T> ? never : T;

type keyofAny = keyof any;
type AnyRecord<T = any> = Record<keyofAny, T>;
type AnyArray<Type = any> = Type[] | readonly Type[];

/**
 * StrictOmit<Type, Keys> constructs a type by picking all properties from Type and then removing Keys
 *
 * This is stricter version of Omit, meaning StrictOmit validates that properties Keys exist in type Type
 */
export type StrictOmit<
  Type extends AnyRecord,
  Keys extends keyof Type,
> = Type extends AnyArray ? never : Omit<Type, Keys>;

export type Constructor<I> = new (...args: any[]) => I;

export type { ScreamingSnakeCase } from "type-fest";

// https://github.com/sindresorhus/type-fest/issues/132#issuecomment-1278045631
type AllKeys<T> = T extends T ? keyof T : never;
export type DistributedOmit<T, K extends AllKeys<T>> = T extends T
  ? Prettify<Omit<T, K>>
  : never;
export type DistributedPick<T, K extends AllKeys<T>> = T extends T
  ? Prettify<Pick<T, K>>
  : never;

// fix js export

export const __TS_TYPES_EXPORTS__ = undefined;
