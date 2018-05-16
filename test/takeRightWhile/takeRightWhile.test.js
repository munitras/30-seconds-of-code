const test = require('tape');
const takeRightWhile = require('./takeRightWhile.js');

test('Testing takeRightWhile', (t) => {
  //For more information on all the methods supported by tape
  //Please go to https://github.com/substack/tape
  t.true(typeof takeRightWhile === 'function', 'takeRightWhile is a Function');
  t.deepEqual(takeRightWhile([1, 2, 3, 4], n => n < 3), [3, 4], 'Removes elements until the function returns true');
  //t.deepEqual(takeRightWhile(args..), 'Expected');
  //t.equal(takeRightWhile(args..), 'Expected');
  //t.false(takeRightWhile(args..), 'Expected');
  //t.throws(takeRightWhile(args..), 'Expected');
  t.end();
});
