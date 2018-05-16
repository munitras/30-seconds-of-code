const test = require('tape');
const isTravisCI = require('./isTravisCI.js');

test('Testing isTravisCI', (t) => {
  //For more information on all the methods supported by tape
  //Please go to https://github.com/substack/tape
  t.true(typeof isTravisCI === 'function', 'isTravisCI is a Function');
  if(isTravisCI())
    t.true(isTravisCI(), 'Running on Travis, correctly evaluates');
  else
    t.false(isTravisCI(), 'Not running on Travis, correctly evaluates');
  //t.deepEqual(isTravisCI(args..), 'Expected');
  //t.equal(isTravisCI(args..), 'Expected');
  //t.false(isTravisCI(args..), 'Expected');
  //t.throws(isTravisCI(args..), 'Expected');
  t.end();
});
