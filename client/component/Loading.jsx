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
              height={'20%'}
              width={'20%'}
              style={{display: 'flex',  justifyContent:'center', alignItems:'center',marginTop:'10%'}}
              isPaused={this.state.isPaused}/>

    </div>
  }
}