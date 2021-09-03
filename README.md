# yaop

Yet another object pool. There are many like it, but this one is mine.

Heavily inspired by https://github.com/getify/deePool and is slightly faster.

```shell
npm install yaop
```

# Usage

```ts
import {createObjectPool} from 'yaop';

const pool = createObjectPool(() => {
  // Create and return a heavy object.
});

// Prepare 100 heavy objects.
pool.allocate(100);

// Take a heavy object from the pool.
const heavyObject = pool.take();

// Return heavy object back to the pool.
pool.release(heavyObject);
```
