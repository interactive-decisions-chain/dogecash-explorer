
import Component from '../../core/Component';
import PropTypes from 'prop-types';
import React from 'react';

import Card from './Card';
import CountUp from '../CountUp';
import GraphLine from '../Graph/GraphLine';


export default class CardActiveAddrs extends Component {
  static defaultProps = {
    activewallets: 0,
    xAxis: [],
    yAxis: []
  };

  static propTypes = {
    activewallets: PropTypes.number.isRequired,
    xAxis: PropTypes.arrayOf(PropTypes.string).isRequired,
    yAxis: PropTypes.arrayOf(PropTypes.number).isRequired
  };

  render() {
    let activewallets = this.props.activewallets;
    return (
      <div className="animated fadeInUp">
      <Card
        className="card--graph"
        title="Total Active Wallets">
        <p className="card__data-main">
          <CountUp
            decimals={ 0 }
            duration={ 1 }
            end={ activewallets }
            start={ 0 } />
        </p>
        <GraphLine
          color="#1991eb"
          className="card__graph"
          data={ this.props.yAxis.reverse() }
          height="100px"
          labels={ this.props.xAxis.reverse() } />
      </Card>
      </div>
    );
  };
}
