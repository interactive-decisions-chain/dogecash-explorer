
import Actions from '../core/Actions';
import Component from '../core/Component';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import React from 'react';

import HorizontalRule from '../component/HorizontalRule';
import Table from '../component/Table';
var blacklistval = "";
var orderdata = [];
class Market extends Component {
  static defaultProps = {
    coin: {}
  };

  static propTypes = {
    coin: PropTypes.object.isRequired,
    getOrderBookCryptoBridge: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      cols: [
        { key: 'price', title: 'BTC' },
        { key: 'quantity', title: 'DOGEC' },      ],
      orderbookasks:[],orderbookbids:[]
    };
  };

  async componentDidMount() {

  //  this.props.getOrderBookCryptoBridge().then(orderbookasks => this.setState({ orderbookasks }));

    var BitShares = require("btsdex-fix")
    await BitShares.connect("wss://bitshares.openledger.info/ws")
     var base_id = "BRIDGE.BTC"
     var quote_id = "BRIDGE.DOGEC"
   const data = await BitShares.getOrderBook(base_id,quote_id,50)

  
   //  await BitShares.disconnect()
  
    this.setState({ orderbookasks: data.asks });
    this.setState({ orderbookbids: data.bids });

        console.log(this.state.orderbookasks)
  };


  render() {

    return (
        <div>
      <div>
        <HorizontalRule title="Sell Orders" />
        <Table
          cols={ this.state.cols }
          data={ this.state.orderbookasks.map((order, idx) => ({
            
            ...order,
            price: order.price,
            quantity: order.quote ,
          })) } />
      </div>
         <div>
         <HorizontalRule title="Buy Orders" />
         <Table
           cols={ this.state.cols }
           data={ this.state.orderbookbids.map((order, idx) => ({
             
             ...order,
             price: order.price,
             quantity: order.quote ,
           })) } />
       </div>
       </div>
    );
  };
}

const mapDispatch = dispatch => ({
    getOrderBookCryptoBridge: () => Actions.getOrderBookCryptoBridge()
});

const mapState = state => ({
  coin: state.coin
});

export default connect(mapState, mapDispatch)(Market);
