
import fetchWorker from '../../lib/fetch.worker';
import promise from 'bluebird';
import BitShares from 'btsdex-fix';

import {
  COIN,
  COINS,
  ERROR,
  TXS,
  WATCH_ADD,
  WATCH_REMOVE
} from '../constants';

const promises = new Map();
const worker = new fetchWorker();

worker.onerror = (err) => {
  console.log(err);
  return err;
};

worker.onmessage = (ev) => {
  const p = promises.get(ev.data.type);
  if (!p) {
    return false;
  }

  if (ev.data.error) {
    p.reject(ev.data.error);
    promises.delete(ev.data.type);
    return false;
  }

  p.resolve(ev.data.data);
  return true;
};

const getFromWorker = (type, resolve, reject, query = null) => {
  promises.set(type, { resolve, reject });
  worker.postMessage({ query, type });
  return true;
};

export const getAddress = (query) => {
  return new promise((resolve, reject) => {
    return getFromWorker('address', resolve, reject, query);
  });
};

export const getBlock = (query) => {
  return new promise((resolve, reject) => {
    return getFromWorker('block', resolve, reject, query);
  });
};

export const getCoinHistory = (dispatch, query) => {
  return new promise((resolve, reject) => {
    return getFromWorker(
      'coins',
      (payload) => {
        if (payload && payload.length) {
          dispatch({ payload: payload[0], type: COIN });
        }
        dispatch({ payload, type: COINS });
        resolve(payload);
      },
      (payload) => {
        dispatch({ payload, type: ERROR });
        reject(payload);
      },
      query
    );
  });
};

export const getCoinsWeek = () => {
  return new promise((resolve, reject) => {
    return getFromWorker('coins-week', resolve, reject);
  });
};
export const getCoinsMonth = () => {
  return new promise((resolve, reject) => {
    return getFromWorker('coins-month', resolve, reject);
  });
};
export const getIsBlock = (query) => {
  return new promise((resolve, reject) => {
    return getFromWorker('is-block', resolve, reject, query);
  });
};

export const getMNs = (query) => {
  return new promise((resolve, reject) => {
    return getFromWorker('mns', resolve, reject, query); // Resolves to getMNs in fetch.worker.js
  });
};

export const getPPs = (query) => {
  return new promise((resolve, reject) => {
    return getFromWorker('pps', resolve, reject, query);
  });
};

export const getPeers = () => {
  return new promise((resolve, reject) => {
    return getFromWorker(
      'peers',
      (peers) => {
        resolve(peers.map((peer) => {
          const parts = peer.ip.split('.');
          parts[3] = 'XXX';
          peer.ip = parts.join('.');
          return peer;
        }));
      },
      reject
    );
  });
};

export const getSupply = (dispatch) => {
  return new promise((resolve, reject) => {
    return getFromWorker('supply', resolve, reject);
  });
};

export const getTop100 = () => {
  return new promise((resolve, reject) => {
    return getFromWorker('top-100', resolve, reject);
  });
};

export const getTX = (query) => {
  return new promise((resolve, reject) => {
    return getFromWorker('tx', resolve, reject, query);
  });
};

export const getOrderBookCryptoBridge = async()  => {
  await BitShares.connect();
let quote = "DOGEC"
  let base = "BTC"
  quote =  `BRIDGE.${quote}`;
  base = `BRIDGE.${base}` ;

  BitShares.subscribe('connected', async () => {
    const [baseId, basePres] = await BitShares.assets[base].then(r => [r.id, r.precision]);
    const [quoteId, quotePres] = await BitShares.assets[quote].then(r => [r.id, r.precision]);
    const data = await BitShares.db.get_limit_orders(baseId, quoteId, 300);
    const asks = {};
    const bids = {};
    const result = {
      bids: [],
      asks: [],
      type: 'snapshot',
      exchange: 'cryptobridge',
      symbol: "DOGEC/BTC"
    };
    data.forEach(el => {
      if (el.sell_price.base.asset_id === baseId) {
        let price =
          el.sell_price.base.amount / el.sell_price.quote.amount / 10 ** (basePres - quotePres);
        price = +price.toFixed(8);
        const volume = el.sell_price.quote.amount / 10 ** quotePres;
        if (Object.prototype.hasOwnProperty.call(bids, price)) {
          bids[price] += volume;
        } else {
          bids[price] = volume;
        }
      } else {
        let price =
          el.sell_price.quote.amount / el.sell_price.base.amount / 10 ** (basePres - quotePres);
        price = +price.toFixed(8);
        const volume = el.sell_price.base.amount / 10 ** quotePres;
        if (Object.prototype.hasOwnProperty.call(asks, price)) {
          asks[price] += volume;
        } else {
          asks[price] = volume;
        }
      }
    });
    result.asks = Object.keys(asks)
      .sort((a, b) => +a - +b)
      .map(price => [+price, asks[price]]);
    result.bids = Object.keys(bids)
      .sort((a, b) => +b - +a)
      .map(price => [+price, bids[price]]);
    return result;
  });
}

export const getTXLatest = (dispatch, query) => {
  return new promise((resolve, reject) => {
    return getFromWorker(
      'txs-latest',
      (payload) => {
        if (dispatch) {
          dispatch({ payload, type: TXS });
        }
        resolve(payload);
      },
      (payload) => {
        if (dispatch) {
          dispatch({ payload, type: ERROR });
        }
        reject(payload);
      },
      query
    );
  });
};

export const getTXs = (dispatch, query) => {
  return new promise((resolve, reject) => {
    return getFromWorker(
      'txs',
      (payload) => {
        if (dispatch) {
          dispatch({ payload, type: TXS });
        }
        resolve(payload);
      },
      (payload) => {
        if (dispatch) {
          dispatch({ payload, type: ERROR });
        }
        reject(payload);
      },
      query
    );
  });
};

export const getTXsWeek = () => {
  return new promise((resolve, reject) => {
    return getFromWorker('txs-week', resolve, reject);
  });
};
export const getTXsMonth = () => {
  return new promise((resolve, reject) => {
    return getFromWorker('txs-month', resolve, reject);
  });
};

export const setTXs = (dispatch, txs) => {
  dispatch({ payload: txs, type: TXS });
};

export const setWatch = (dispatch, term) => {
  dispatch({ payload: term, type: WATCH_ADD });
};

export const removeWatch = (dispatch, term) => {
  dispatch({ payload: term, type: WATCH_REMOVE });
};

export default {
  getAddress,
  getBlock,
  getCoinHistory,
  getCoinsWeek,
  getCoinsMonth,
  getIsBlock,
  getMNs,
  getPPs,
  getPeers,
  getSupply,
  getTop100,
  getOrderBookCryptoBridge,
  getTX,
  getTXLatest,
  getTXs,
  getTXsWeek,
  getTXsMonth,
  setTXs,
  setWatch,
  removeWatch
};
