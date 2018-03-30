var assert = require('assert');

var sum = require('../sum');
describe('#async sum', () => {
    describe('#sum()', () => {

        it(`#async function`, async () => {
            let r = await sum();
            assert.strictEqual(r, 15);
        });

        it('#sync function', () => {
            assert(true);
        });

    });

});