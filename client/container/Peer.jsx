
import Actions from '../core/Actions';
import Component from '../core/Component';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import HorizontalRule from '../component/HorizontalRule';
import Table from '../component/Table';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
class Peer extends Component {
  static propTypes = {
    getPeers: PropTypes.func.isRequired  
  };

  constructor(props) {
    super(props);
    this.state = {
      cols: [
        { key: 'ip', title: 'Address' },
        { key: 'ver', title: 'Protocol' },
        { key: 'subver', title: 'Sub-version' },
        { key: 'country', title: 'Country' },
      ],
      loading: true,
      peers: [],isOpen: false,addnodes:""
    };
    this.baz = this.baz.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  };

  componentDidMount() {
    this.props
      .getPeers()
      .then(peers => this.setState({ peers, loading: false }))
      .catch(error => this.setState({ error, loading: false }));
 };
  handleToggle = () => this.setState({ isOpen: true });
  baz() {
    this.setState({ isOpen: true });
  }
getAddnodeData(docs) {
    var returnaddnodes = "";
    const returndata = docs;
    for (var i = 0; i < returndata.length; i++) {
      returnaddnodes = returnaddnodes + "addnode=" + returndata[i].ip + "\n"
  }
  return returnaddnodes;
} 
openModal() {
  this.setState({isOpen: true});
}

afterOpenModal() {
  // references are now sync'd and can be accessed.
  this.subtitle.style.color = '#f00';
}

closeModal() {
  this.setState({isOpen: false});
}
addMore = () => {
  this.setState({ isOpen: !this.state.isOpen })
}
buttonClicked() {
  console.log('Button was clicked!')
  this.addMore();
}

  render() {
   var isopen = false;
    if (!!this.state.error) {
      return this.renderError(this.state.error);
    } else if (this.state.loading) {
      return this.renderLoading();
    }

    return (
      <div>
        <button onClick={this.openModal}>Add Work Log</button>
      <Dialog
        fullScreen={false}
        open={this.state.isOpen}
        onClose={this.handleToggle}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
{this.getAddnodeData(this.state.peers)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleToggle} color="primary">
            Disagree
          </Button>
          <Button onClick={this.handleToggle} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
        <HorizontalRule title="Connections" />
        <Table
          cols={ this.state.cols }
          data={ this.state.peers.map(peer => ({
            ...peer,
            ip: (
              <div>
                <img
                  className="flag"
                  src={ `/img/flag/${ peer.countryCode ? peer.countryCode.toLowerCase() : 'xx' }.gif` }
                  title={ peer.country } /> { peer.ip }
              </div>
            )
          })) } />
          
      </div>
    );
  };
}

const mapDispatch = dispatch => ({
  getPeers: () => Actions.getPeers(),

});

export default connect(null, mapDispatch)(Peer);
