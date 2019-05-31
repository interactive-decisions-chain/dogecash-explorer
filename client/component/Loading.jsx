import React from 'react'
import Lottie from 'react-lottie';
import * as animationData from './animation.json'

export default class LottieControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isStopped: false, isPaused: false};
  }

  render() {

    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'true'
      }
    };
    return <div>
      <Lottie options={defaultOptions}
              isStopped={this.state.isStopped}
              height={'25%'}
              width={'25%'}
              style={{alignItems: 'center', display: 'flex',marginTop: '15%'}}
              isPaused={this.state.isPaused}/>

    </div>
  }
}