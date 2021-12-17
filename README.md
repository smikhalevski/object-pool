# object-pool [![build](https://github.com/smikhalevski/object-pool/actions/workflows/master.yml/badge.svg?branch=master&event=push)](https://github.com/smikhalevski/object-pool/actions/workflows/master.yml)

[The tiny](https://bundlephobia.com/package/@smikhalevski/object-pool) and efficient object pool.

Heavily inspired by https://github.com/getify/deePool and is slightly faster.

```shell
npm install @smikhalevski/object-pool
```

# Usage

```ts
import {createObjectPool} from '@smikhalevski/object-pool';

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
