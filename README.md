# yaop

Yet another object pool.

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
