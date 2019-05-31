require('babel-polyfill');
const { exit, rpc } = require('../lib/cron');
const locker = require('../lib/locker');
// Models.
const Blocks = require('../model/block');

/**
 * Clear Coin db.
 */
async function clearDatabase() {
    await Blocks.remove({});
}

/**
 * Handle locking.
 */
async function update() {
    let code = 0;

    try {
        locker.lock('block');
        await clearDatabase();
    } catch (err) {
        console.log(err);
        code = 1;
    } finally {
        try {
            locker.unlock('blocks');
        } catch (err) {
            console.log(err);
            code = 1;
        }
        exit(code);
    }
}

update();