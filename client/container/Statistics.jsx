
import Actions from '../core/Actions';
import Component from '../core/Component';
import { connect } from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import React from 'react';

import GraphLineFull from '../component/Graph/GraphLineFull';
import HorizontalRule from '../component/HorizontalRule';
import Notification from '../component/Notification';

class Statistics extends Component {
  static propTypes = {
    // State
    coin: PropTypes.object.isRequired,
    // Dispatch
    getCoins: PropTypes.func.isRequired,
    getTXs: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      coins: [],
      error: null,
      loading: true,
      txs: []
    };
  };

  componentDidMount() {
    Promise.all([
        this.props.getCoins(),
        this.props.getTXs()
      ])
      .then((res) => {
        this.setState({
          coins: res[0], // 30 Days at 5 min = 2016 coins
          loading: false,
          txs: res[1]
        });
      });
  };

  render() {
    if (!!this.state.error) {
      return this.renderError(this.state.error);
    } else if (this.state.loading) {
      return this.renderLoading();
    }

    let tTX = 0;
    this.state.txs.forEach((tx) => {
      tTX += tx.total;
    });
    const avgTX = ((tTX / 30) / 24) / this.state.txs.length;

    // Setup graph data objects.
    const hashes = new Map();
    const mns = new Map();
    const prices = new Map();
    const supply = new Map();
    const difficulty = new Map();
    const marketcap = new Map();
    const peers = new Map();

    this.state.coins.forEach((c, idx) => {
      const k = moment(c.createdAt).format('MMM DD');

      if (hashes.has(k)) {
        hashes.set(k, hashes.get(k) + c.netHash);
      } else {
        hashes.set(k, c.netHash);
      }

      if (mns.has(k)) {
        mns.set(k, mns.get(k) + c.mnsOn);
      } else {
        mns.set(k, c.mnsOn);
      }

      if (prices.has(k)) {
        prices.set(k, prices.get(k) + c.usd);
      } else {
        prices.set(k, c.usd);
      }
      if (supply.has(k)) {
        supply.set(k, supply.get(k) + c.supply);
      } else {
        supply.set(k, c.supply);
      }

      if (difficulty.has(k)) {
        difficulty.set(k, difficulty.get(k) + c.diff);
      } else {
        difficulty.set(k, c.diff);
      }

      if (marketcap.has(k)) {
        marketcap.set(k, marketcap.get(k) + c.cap);
      } else {
        marketcap.set(k, c.cap);
      }

      if (peers.has(k)) {
        peers.set(k, peers.get(k) + c.peers);
      } else {
        peers.set(k, c.peers);
      }
    });

    // Generate averages for each key in each map.
    const l = (24 * 60) / 5; // How many 5 min intervals in a day.
    let avgHash, avgMN, avgPrice ,avgSupply,avgDiff,avgMrktCap,avgPeers= 0.0;
    let hashLabel = 'H/s';
    hashes.forEach((v, k) => {
      const { hash, label } = this.formatNetHash(v / l);
      hashLabel = label; // For use in graph.
      avgHash += hash;
      hashes.set(k, numeral(hash).format('0,0.00'));
    });
    supply.forEach((v, k) => {
      avgSupply += v / l;
      supply.set(k, numeral(v / l).format('0,0.00'));
    });
    difficulty.forEach((v, k) => {
      avgDiff += v / l;
      difficulty.set(k, numeral(v / l).format('0,0.00'));
    });
    marketcap.forEach((v, k) => {
      avgMrktCap += v / l;
      marketcap.set(k, numeral(v / l).format('0,0.00'));
    });
    peers.forEach((v, k) => {
      avgPeers += v / l;
      peers.set(k, numeral(v / l).format('0,0.00'));
    });
    mns.forEach((v, k) => {
      avgMN += v / l;
      mns.set(k, numeral(v / l).format('0,0'));
    });
    prices.forEach((v, k) => {
      avgPrice += v / l;
      prices.set(k, numeral(v / l).format('0,0.00'));
    });
  
    avgHash = avgHash / hashes.size;
    avgMN = avgMN / mns.size;
    avgPrice = avgPrice / prices.size;
    avgSupply = avgSupply / supply.size;
    avgDiff = avgDiff / difficulty.size;
    avgMrktCap = avgMrktCap / marketcap.size;
    avgPeers = avgPeers / peers.size;

    // Get the current hash format and label.
    const netHash = this.formatNetHash(this.props.coin.netHash);

    // Setup the labels for the transactions per day map.
    const txs = new Map();
    this.state.txs.forEach((t) => {
      txs.set(moment(t._id, 'YYYY-MM-DD').format('MMM DD'), t.total);
    });

    // Get the current day of the month.
    const day = (<small>{ moment().format('MMM DD') }</small>);

    return (
      <div className="animated fadeInUp">
        <HorizontalRule title="Statistics" />
        { Array.from(hashes.keys()).slice(1, -1).length <= 6 && <Notification /> }
        <div>
          <div className="row">
            <div className="col-md-12 col-lg-6">
              <h3>Network Hash Rate Last 30 Days</h3>
              <h4>{ numeral(netHash.hash).format('0,0.0000') } { netHash.label }/s { day }</h4>
              <h5>Difficulty: { numeral(this.props.coin.diff).format('0,0.0000') }</h5>
              <div>
                <GraphLineFull
                  color="#1991eb"
                  data={ Array.from(hashes.values()).slice(1, -1) }
                  height="420px"
                  labels={ Array.from(hashes.keys()).slice(1, -1) } />
              </div>
            </div>
            <div className="col-md-12 col-lg-6">
              <h3>PoS Difficulty</h3>
              <h4>{ numeral(this.props.coin.diff).format('0,0.0000') } { day }</h4>
              <div>
                <GraphLineFull
                  color="#1991eb"
                  data={ Array.from(difficulty.values()).slice(1, -1) }
                  height="420px"
                  labels={ Array.from(difficulty.keys()).slice(1, -1) } />
              </div>
            </div>
            <div className="col-md-12 col-lg-6">
              <h3>DogeCash Supply</h3>
              <h4>{ numeral(this.props.coin.supply).format('0,0.00') } DOGEC</h4>
              <div>
                <GraphLineFull
                  color="#1991eb"
                  data={ Array.from(supply.values()).slice(1, -1) }
                  height="410px"
                  labels={ Array.from(supply.keys()).slice(1, -1) } />
              </div>
            </div>
            <div className="col-md-12 col-lg-6">
              <h3>Transactions Last 30 Days</h3>
              <h4>{ numeral(tTX).format('0,0') } { day }</h4>
              <h5>Average: { numeral(avgTX).format('0,0') * 24*30 } Per Day</h5>
              <div>
                <GraphLineFull
                  color="#1991eb"
                  data={ Array.from(txs.values()) }
                  height="420px"
                  labels={ Array.from(txs.keys()) } />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-6">
              <h3>DogeCash Price USD</h3>
              <h4>{ numeral(this.props.coin.usd).format('$0,0.00') } { day }</h4>
              <h5>{ numeral(this.props.coin.btc).format('0.00000000') } BTC</h5>
              <div>
                <GraphLineFull
                  color="#1991eb"
                  data={ Array.from(prices.values()).slice(1, -1) }
                  height="420px"
                  labels={ Array.from(prices.keys()).slice(1, -1) } />
              </div>
            </div>
            <div className="col-md-12 col-lg-6">
              <h3>DogeCash Marketcap </h3>
              <h4>{ numeral(this.props.coin.cap).format('0,0.00') } USD</h4>
              <div>
                <GraphLineFull
                  color="#1991eb"
                  data={ Array.from(marketcap.values()).slice(1, -1) }
                  height="420px"
                  labels={ Array.from(marketcap.keys()).slice(1, -1) } />
              </div>
            </div>
            <div className="col-md-12 col-lg-6">
              <h3>Masternodes Online Last 30 Days</h3>
              <h4>{ this.props.coin.mnsOn } { day }</h4>
              <h5>Seen: { this.props.coin.mnsOn + this.props.coin.mnsOff }</h5>
              <div>
                <GraphLineFull
                  color="#1991eb"
                  data={ Array.from(mns.values()).slice(1, -1) }
                  height="420px"
                  labels={ Array.from(mns.keys()).slice(1, -1) } />
              </div>
            </div>
            <div className="col-md-12 col-lg-6">
              <h3>Peers Connected</h3>
              <h4>{ numeral(this.props.coin.peers).format('0') } { day }</h4>
              <h5>Average: { numeral(avgPeers).format('0,0') } </h5>

              <div>
                <GraphLineFull
                  color="#1991eb"
                  data={ Array.from(peers.values()).slice(1, -1) }
                  height="420px"
                  labels={ Array.from(peers.keys()).slice(1, -1) } />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

const mapDispatch = dispatch => ({
  getCoins: () => Actions.getCoinsMonth(dispatch),
  getTXs: () => Actions.getTXsMonth(dispatch)
});

const mapState = state => ({
  coin: state.coin
});

export default connect(mapState, mapDispatch)(Statistics);
