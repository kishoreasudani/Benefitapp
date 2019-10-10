/***
 * Fade Animation Classes
 */
import React, {Component} from 'react';
import {Animated} from 'react-native';

class FadeIn extends Component {
  state = {
    fadeAnim: new Animated.Value(0),
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: this.props.duration,
    }).start();
  }

  render() {
    let {fadeAnim} = this.state;
    return (
      <Animated.View style={{...this.props.style, opacity: fadeAnim,}}>
        {this.props.children}
      </Animated.View>
    );
  }
}

class FadeOut extends Component {
  state = {
    fadeAnim: new Animated.Value(1),
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 0,
      duration: this.props.duration,
    }).start();
  }

  render() {
    let {fadeAnim} = this.state;
    return (
      <Animated.View style={{...this.props.style, opacity: fadeAnim,}}>
        {this.props.children}
      </Animated.View>
    );
  }
}

export {FadeIn, FadeOut}