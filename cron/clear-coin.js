require('babel-polyfill');
const { exit, rpc } = require('../lib/cron');
const locker = require('../lib/locker');
// Models.
const Coin = require('../model/coin');

/**
 * Clear Coin db.
 */
async function clearDatabase() {
    await Coin.remove({});
}

/**
 * Handle locking.
 */
async function update() {
    let code = 0;

    try {
        locker.lock('coin');
        await clearDatabase();
    } catch (err) {
        console.log(err);
        code = 1;
    } finally {
        try {
            locker.unlock('coin');
        } catch (err) {
            console.log(err);
            code = 1;
        }
        exit(code);
    }
}

update();