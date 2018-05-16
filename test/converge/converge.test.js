const test = require('tape');
const converge = require('./converge.js');

test('Testing converge', (t) => {
  //For more information on all the methods supported by tape
  //Please go to https://github.com/substack/tape
  t.true(typeof converge === 'function', 'converge is a Function');
  const average = converge((a, b) => a / b, [
    arr => arr.reduce((a, v) => a + v, 0),
    arr => arr.length,
  ]);
  t.equal(average([1, 2, 3, 4, 5, 6, 7]), 4, 'Produces the average of the array');
  const strangeConcat = converge((a, b) => a + b, [
    x => x.toUpperCase(),
    x => x.toLowerCase()]
  );
  t.equal(strangeConcat('Yodel'), "YODELyodel", 'Produces the strange concatenation');
  //t.deepEqual(converge(args..), 'Expected');
  //t.equal(converge(args..), 'Expected');
  //t.false(converge(args..), 'Expected');
  //t.throws(converge(args..), 'Expected');
  t.end();
});
