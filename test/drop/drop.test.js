const test = require('tape');
const drop = require('./drop.js');

test('Testing drop', (t) => {
  //For more information on all the methods supported by tape
  //Please go to https://github.com/substack/tape
  t.true(typeof drop === 'function', 'drop is a Function');
  t.deepEqual(drop([1, 2, 3]), [2,3], 'Works without the last argument');
  t.deepEqual(drop([1, 2, 3], 2), [3], 'Removes appropriate element count as specified');
  t.deepEqual(drop([1, 2, 3], 42), [], 'Empties array given a count greater than length');
  //t.deepEqual(drop(args..), 'Expected');
  //t.equal(drop(args..), 'Expected');
  //t.false(drop(args..), 'Expected');
  //t.throws(drop(args..), 'Expected');
  t.end();
});
