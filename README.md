# @pleisto/active-support

A TypeScript utility library designed to optimize for programmer happiness.

> NOTES: If you want to add a new methods, make sure it will be used on both the client and the server side.
> Any methods that will only used in a browser or NodeJS environment should not be added here.

## Features

### Alternative to `lodash`

You could directly use `@pleisto/active-support` instead of `lodash` and `lodash-es`.

```ts
import { differenceBy, zip, isString } from '@pleisto/active-support'
```

If some of the methods in lodash do not exist in `@pleisto/active-support`, it is because
the are natively supported in modern ECMAScript. see [YOU MIGHT NOT NEED LODASH](https://youmightnotneed.com/lodash/) for more information.

### Unit Converter

#### Millisecond conversion

```ts
import { ms } from '@pleisto/active-support';
ms('2 days') // 172800000
ms('2.5 h') // 9000000
ms('-3 days) // -259200000
ms('-200') // -200
ms(60000) // '1m'
ms(ms('10 hours)) // '10h'
ms(6000, { long: true }) // '1 minute'
ms(2*6000, { long: true }) // '2 minutes'
```

see [vercel/ms](https://github.com/vercel/ms#readme) for more information.

#### ByteSize conversion

```ts
import { byteSize } from '@pleisto/active-support'
byteSize('3 mb') // 24_000_000
byteSize('2 Gigabytes') // 16_000_000_000
byteSize(32_000_000) // '4 MB'
```

> NOTICE:
>
> We use base 10 instead of base 2 for bit.
> See [IEC 60027-2 A.2 and ISO/IEC 80000](https://en.wikipedia.org/wiki/Binary_prefix#IEC_prefixes) for more information.

### Type Checking Utilities

You could use most of the type checking utilities in lodash directly, such as `isString`, `isEmpty` and `isBuffer`.
In addition we support methods such as `isUUID` nad `isBlack`. See `src/isType.ts` for more information.

#### isBlack

`isBlack` method could be used to check if any value is empty or undefined/null, just as it does in [Ruby on Rails](https://guides.rubyonrails.org/active_support_core_extensions.html#blank-questionmark-and-present-questionmark).

### Inflections

```ts
import { pluralize, singularize } from '@pleisto/active-support'

pluralize('word') // 'words'
pluralize('datum') // 'data'
singularize('quizzes') // 'quiz'
singularize('news') // 'news'
singularize('are') // 'is'
```

### Rust style error handling

```ts
import { ok, err } from '@pleisto/active-support'

// something awesome happend

const yesss = ok(someAesomeValue)

// moments later ...

const mappedYes = yesss.map(doingSuperUsefulStuff)

// neverthrow uses type-guards to differentiate between Ok and Err instances
// Mode info: https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types
if (mappedYes.isOk()) {
  // using type guards, we can access an Ok instance's `value` field
  doStuffWith(mappedYes.value)
} else {
  // because of type guards
  // typescript knows that mappedYes is an Err instance and thus has a `error` field
  doStuffWith(mappedYes.error)
}
```

See [neverthrow](https://github.com/supermacro/neverthrow/wiki) for more information.

#### Rust style pattern matching

```ts
import { match, P } from '@pleisto/active-support'

type Data =
  | { type: 'text'; content: string }
  | { type: 'img'; src: string };

type Result =
  | { type: 'ok'; data: Data }
  | { type: 'error'; error: Error };

const result: Result = ...;

return match(result)
  .with({ type: 'error' }, () => `<p>Oups! An error occured</p>`)
  .with({ type: 'ok', data: { type: 'text' } }, (res) => `<p>${res.data.content}</p>`)
  .with({ type: 'ok', data: { type: 'img', src: P.select() } }, (src) => `<img src=${src} />`)
  .exhaustive();
```

See [ts-pattern](https://github.com/gvergnaud/ts-pattern) for more information.

### Utilities

#### array2Tree

Converts an array of items with ids and parent ids to a nested tree in a performant way (time complexity `O(n)`).

Se [Performant array to tree](https://github.com/philipstanislaus/performant-array-to-tree) for more information.

#### equals

The fastest deep equal with ES6 Map, Set and Typed arrays support.
Based on [fast-deep-equal/es6/react](https://github.com/epoberezkin/fast-deep-equal)
