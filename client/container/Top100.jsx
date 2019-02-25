
import Actions from '../core/Actions';
import Component from '../core/Component';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import React from 'react';

import HorizontalRule from '../component/HorizontalRule';
import Table from '../component/Table';

class Top100 extends Component {
  static defaultProps = {
    coin: {}
  };

  static propTypes = {
    coin: PropTypes.object.isRequired,
    getTop100: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      cols: [
        { key: 'index', title: '#' },
        { key: 'address', title: 'Address' },
        { key: 'value', title: 'Total' },
        { key: 'percent', title: '%' },
        { key: 'label', title: 'Special' },

      ],
      wallets: []
    };
  };

  componentDidMount() {
    this.props.getTop100().then(wallets => this.setState({ wallets }));
   
   
        var premineindex = wallets.address.indexOf("DR9WPNi1AeRjLuodQtWcqYms115euojZij")
        wallets[premineindex].label = "Premine"
      var blacklistval = ""
      var blacklistindex = 0;
      switch(address){
        case 'DMycmpxf3xEKgSU2JaKRq68ZXjvfZzPvEd': blacklistindex = wallets.address.indexOf("DMycmpxf3xEKgSU2JaKRq68ZXjvfZzPvEd");break;
        case 'DSw7if1HXa9NBXa4uMCKdYfobrZpE2KUVY': blacklistindex = wallets.address.indexOf("DSw7if1HXa9NBXa4uMCKdYfobrZpE2KUVY");break;
        case 'DE9X5DnbTj6ramXRC4a2rd5e3jdLguES1s': blacklistindex = wallets.address.indexOf("DE9X5DnbTj6ramXRC4a2rd5e3jdLguES1s");break;
        case 'DJyygjtpWKEZctcvghgJZhVzoajiReVfG5': blacklistindex = wallets.address.indexOf("DJyygjtpWKEZctcvghgJZhVzoajiReVfG5");break;
        case 'DAxMuFzvLvmiVptoXJErNGaPbx429Y6R7L': blacklistindex = wallets.address.indexOf("DAxMuFzvLvmiVptoXJErNGaPbx429Y6R7L");break;
        case 'DDEPjbLFqZ3XyfEqqj3k33va7mvuQDfB4a': blacklistindex = wallets.address.indexOf("DDEPjbLFqZ3XyfEqqj3k33va7mvuQDfB4a");break;
        case 'DC5AVzGj27UKEqQEnRuGXWxrMqKadsw5BU': blacklistindex = wallets.address.indexOf("DC5AVzGj27UKEqQEnRuGXWxrMqKadsw5BU");break;
        case 'DT9LxyfGn91gAWhXedSf81B7ATLseSxuVv': blacklistindex = wallets.address.indexOf("DT9LxyfGn91gAWhXedSf81B7ATLseSxuVv");break;
        case 'DJM1uEdrCiSzZRk9hwpaFi1DmYNFh2gpxL': blacklistindex = wallets.address.indexOf("DJM1uEdrCiSzZRk9hwpaFi1DmYNFh2gpxL");break;
        case 'DBHP5rx1dyhgyo6Chpt4mqe5ZXYBc7zpHb': blacklistindex = wallets.address.indexOf("DBHP5rx1dyhgyo6Chpt4mqe5ZXYBc7zpHb");break;
        case 'DRaaCkzhk9zM76rwcgBmgf5UfemS7bCRBC': blacklistindex = wallets.address.indexOf("DRaaCkzhk9zM76rwcgBmgf5UfemS7bCRBC");break;
        case 'DAYyhPf9iijgjWU9nf52BveccLdgWp5DLw': blacklistindex = wallets.address.indexOf("DAYyhPf9iijgjWU9nf52BveccLdgWp5DLw");break;
        case 'DU3xQ2uX6BmmWzAHsqENoyJA8SLVpQQjk8': blacklistindex = wallets.address.indexOf("DU3xQ2uX6BmmWzAHsqENoyJA8SLVpQQjk8");break;
        case 'DNEmMeB8FbQesnk6zRtPcznwPxDXADUXAg': blacklistindex = wallets.address.indexOf("DNEmMeB8FbQesnk6zRtPcznwPxDXADUXAg");break;
      blacklistval = 'Blacklisted';
      }

        wallets[blacklistindex].label = blacklistval;

      


    
  };

  render() {
    return (
      <div>
        <HorizontalRule title="Top 100" />
        <Table
          cols={ this.state.cols }
          data={ this.state.wallets.map((wallet, idx) => ({
            ...wallet,
            address: (
              <Link to={ `/address/${ wallet.address }` }>{ wallet.address }</Link>
            ),
            index: idx + 1,
            percent: numeral((wallet.value / this.props.coin.supply) * 100.0).format('0,0.00'),
            value: numeral(wallet.value).format('0,0.0000'),
            label: wallet.label
          })) } />
      </div>
    );
  };
}

const mapDispatch = dispatch => ({
  getTop100: () => Actions.getTop100()
});

const mapState = state => ({
  coin: state.coin
});

export default connect(mapState, mapDispatch)(Top100);
