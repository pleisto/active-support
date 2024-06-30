/* eslint-disable @typescript-eslint/no-use-before-define */
import { Err, Result } from 'neverthrow'

/**
 * JSON Parser with result wrapper
 */
export const safeJsonParse = Result.fromThrowable(JSON.parse)

export { Result, ResultAsync, ok } from 'neverthrow' // rust style error handing

// https://github.com/supermacro/neverthrow/blob/master/src/result.ts#L312
class ExplicitErr<T, E extends Error> extends Err<T, E> {
  override _unsafeUnwrap(): T {
    console.error('unsafeUnwrapError', this.error)
    throw this.error
  }

  override andThen(_f: any): any {
    return err(this.error)
  }

  override map<A>(_f: (t: T) => A): Result<A, E> {
    return err(this.error)
  }

  override mapErr<U>(f: (e: E) => U): Result<T, U> {
    return err(f(this.error) as any)
  }

  override match<A>(_ok: (t: T) => A, err: (e: E) => A): A {
    return err(this.error)
  }
}

export const err = <T = never, E extends Error = Error>(err: E): Err<T, E> => new ExplicitErr(err)
