const assert = require('assert');
const sum = require('./sum');

assert.strictEqual(sum(), 0);
console.log(sum());
assert.strictEqual(sum(1), 1);
console.log(sum(1));
assert.strictEqual(sum(1, 2), 3);
console.log(sum(1, 2));
assert.strictEqual(sum(1, 2, 3), 6);
console.log(sum(1, 2, 3));