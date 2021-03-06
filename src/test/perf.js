const {test} = require('@smikhalevski/perf-test');
const chalk = require('chalk');
const deepool = require('deepool');
const objectPool = require('../../lib/index-cjs');

const objectFactory = () => Object.create(null);

console.log(chalk.bold('Take/release'));
{
  const deepoolInstance = deepool.create(objectFactory);
  const objectPoolInstance = new objectPool.ObjectPool(objectFactory);

  deepoolInstance.grow(3);
  objectPoolInstance.allocate(3);

  gc();
  test('deepool    ', () => {
    for (let i = 0; i < 1000; ++i) {
      const obj1 = deepoolInstance.use();
      const obj2 = deepoolInstance.use();
      const obj3 = deepoolInstance.use();
      deepoolInstance.recycle(obj1);
      deepoolInstance.recycle(obj2);
      deepoolInstance.recycle(obj3);
    }
  });

  gc();
  test('object-pool', () => {
    for (let i = 0; i < 1000; ++i) {
      const obj1 = objectPoolInstance.take();
      const obj2 = objectPoolInstance.take();
      const obj3 = objectPoolInstance.take();
      objectPoolInstance.release(obj1);
      objectPoolInstance.release(obj2);
      objectPoolInstance.release(obj3);
    }
  });
}

console.log('\n' + chalk.bold('Allocation'));
{
  let deepoolInstance;
  let objectPoolInstance;

  gc();
  test('deepool    ', () => {
    for (let i = 0; i < 1000; ++i) {
      deepoolInstance.use();
    }
  }, {
    beforeCycle: () => {
      deepoolInstance = deepool.create(objectFactory);
    },
  });

  gc();
  test('object-pool', () => {
    for (let i = 0; i < 1000; ++i) {
      objectPoolInstance.take();
    }
  }, {
    beforeCycle: () => {
      objectPoolInstance = new objectPool.ObjectPool(objectFactory);
    },
  });
}
