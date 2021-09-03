export interface IObjectPool<T> {

  /**
   * Returns the next value from the pool. If there's no value available then `factory` is called to produce a new
   * value which is added to the pool.
   */
  take(): T;

  /**
   * Returns a value to the pool so it can be retrieved using {@link take}. There's no check that value was already
   * returned to the pool and no check that value was in the pool previously. So ensure you don't release the same
   * value twice or release a value that doesn't belong to the pool.
   */
  release(value: T): void;

  /**
   * Populates pool with `count` number of new values produced by `factory`.
   */
  allocate(count: number): void;
}

/**
 * The fast object pool implementation. Inspired by {@link https://github.com/getify/deePool deePool}.
 *
 * @param factory The factory that produces new values.
 * @param reset The callback that is invoked when value is returned to the pool via {@link release}.
 */
export function createObjectPool<T>(factory: () => T, reset?: (value: T) => void): IObjectPool<T> {
  const cache: Record<number, T> = {};

  let cacheLength = 0;
  let takenCount = 0;

  const take = (): T => {
    if (takenCount === cacheLength) {
      allocate();
    }
    const value = cache[takenCount];
    cache[takenCount++ | 0] = undefined as unknown as T;
    return value;
  };

  const release = (value: T): void => {
    reset?.(value);
    cache[takenCount === 0 ? cacheLength : --takenCount | 0] = value;
  };

  const allocate = (count = cacheLength / 2 + 1 | 0): void => {
    count |= 0;
    if (count <= 0) {
      return;
    }
    const prevLength = cacheLength;
    const nextLength = cacheLength += count;

    for (let i = prevLength; i < nextLength; i++) {
      cache[i] = factory();
    }
  };

  return {
    take,
    release,
    allocate,
  };
}