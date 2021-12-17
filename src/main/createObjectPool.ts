export interface IObjectPool<T> {

  /**
   * Returns the next value from the pool. If there's no value available then `factory` is called to produce a new
   * value which is added to the pool.
   */
  take(): T;

  /**
   * Returns a value to the pool so it can be retrieved using {@link IObjectPool.take}. There's no check that value was
   * already returned to the pool and no check that value was in the pool previously. So ensure you don't release the
   * same value twice or release a value that doesn't belong to the pool.
   */
  release(value: T): void;

  /**
   * Populates pool with `count` number of new values produced by `factory`.
   */
  allocate(count: number): void;
}

/**
 * Creates the new {@link IObjectPool} instance.
 *
 * @param factory The factory that produces new values.
 * @param reset The callback that is invoked when value is returned to the pool via {@link release}.
 * @returns The new {@link IObjectPool} instance.
 */
export function createObjectPool<T>(factory: () => T, reset?: (value: T) => void): IObjectPool<T> {
  const cache: Array<T> = [];

  let takenCount = 0;

  const take = (): T => {
    if (takenCount === cache.length) {
      _allocate(cache.length || 5);
    }
    const value = cache[takenCount];
    cache[takenCount++] = null as unknown as T;
    return value;
  };

  const release = (value: T) => {
    cache[takenCount === 0 ? cache.length : --takenCount] = value;
  };

  const _allocate = (count: number): void => {
    const prevLength = cache.length;
    const nextLength = cache.length += count;

    for (let i = prevLength; i < nextLength; i++) {
      cache[i] = factory();
    }
  };

  const allocate = (count: number): void => {
    count |= 0;

    if (count > 0) {
      _allocate(count);
    }
  };

  return {
    take,
    release,
    allocate,
  };
}
