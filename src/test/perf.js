const {test} = require('@smikhalevski/perf-test');
const chalk = require('chalk');
const deepool = require('deepool');
const {createObjectPool} = require('../../lib/index-cjs');

console.log(chalk.bold('Huge pool'));
{
  const yaopPool = createObjectPool(() => 123);
  const deePool = deepool.create(() => 123);

  yaopPool.allocate(100_000_000);
  deePool.grow(100_000_000);

  test('deePool', () => {
    for (let i = 0; i < 1000; ++i) {
      deePool.recycle(deePool.use());
    }
  });

  gc();
  gc();

  test('yaop   ', () => {
    for (let i = 0; i < 1000; ++i) {
      yaopPool.release(yaopPool.take());
    }
  });
}

console.log('\n' + chalk.bold('Allocation'));
{
  let deePool;
  let yaopPool;

  test('deePool', () => {
    for (let i = 0; i < 1000; ++i) {
      deePool.use();
    }
  }, {
    beforeCycle: () => deePool = deepool.create(() => 123),
  });

  gc();
  gc();

  test('yaop   ', () => {
    for (let i = 0; i < 1000; ++i) {
      yaopPool.take();
    }
  }, {
    beforeCycle: () => yaopPool = createObjectPool(() => 123),
  });
}
