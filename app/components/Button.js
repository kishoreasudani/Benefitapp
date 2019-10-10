/**
 * Button classes
 */
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from "../assets/styles/colors";
import * as Utils from '../lib/utils';
import * as FadeAnimation from './FadeAnimation';
import { Images } from "../assets/Images/index";
import { View } from 'native-base';

class WhiteButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={ this.props.onPress } disabled={ this.props.disabled || false }
        style={ [localStyle.button, localStyle.whiteButton, this.props.buttonStyle] }
      >
        <FadeAnimation.FadeIn duration={ this.props.fadeDuration || 1000 }>
          <Text style={ [localStyle.buttonText, localStyle.whiteButtonText, this.props.buttonTextStyle] }>
            { this.props.buttonText }
          </Text>
        </FadeAnimation.FadeIn>
      </TouchableOpacity>
    )
  }
}

class PrimaryButton extends Component {
  render() {
    return (
      <TouchableOpacity onPress={ this.props.onPress } disabled={ this.props.disabled || false }
        style={ [localStyle.button, localStyle.primaryButton, this.props.buttonStyle] }>
        <FadeAnimation.FadeIn duration={ this.props.fadeDuration || 1000 }>
          <Text style={ [localStyle.buttonText, localStyle.primaryButtonText, this.props.buttonTextStyle] }>
            { this.props.buttonText }
          </Text>
        </FadeAnimation.FadeIn>
      </TouchableOpacity>
    )
  }
}

class ShowNotification extends Component {
  render() {
    return (
      <TouchableOpacity style={ { flexDirection: 'row' } }
        onPress={ this.props.onPress }>
        { global.notiCount > 0 ? <View style={ {
          backgroundColor: 'red', alignSelf: 'center',
          width: Utils.moderateVerticalScale(10), height: Utils.moderateVerticalScale(10),
          borderRadius: 3, marginBottom: Utils.moderateVerticalScale(10)

        } }>
        </View> : null }
        <Image source={ Images.notifications } resizeMode='contain' resizeMethod='resize'
          style={ {
            alignSelf: 'center', width: Utils.moderateVerticalScale(15),
            height: Utils.moderateVerticalScale(15), marginRight: Utils.moderateScale(5)
          } } />
      </TouchableOpacity>
    )
  }
}

class WithIconButton extends Component {
  render() {
    return (
      <TouchableOpacity onPress={ this.props.onPress } disabled={ this.props.disabled || false }
        style={ [localStyle.button, localStyle.primaryButton, this.props.buttonStyle] }>
        <FadeAnimation.FadeIn duration={ this.props.fadeDuration || 1000 }
          style={ { flexDirection: 'row', paddingHorizontal: Utils.moderateScale(10) } }>
          <Image source={ this.props.icon } style={ [{
            height: this.props.iconSize || Utils.moderateVerticalScale(15),
            width: this.props.iconSize || Utils.moderateVerticalScale(15),
            marginVertical: Utils.moderateVerticalScale(10)
          }, this.props.iconStyle] } resizeMode="contain" resizeMethod="resize" />
          <Text
            style={ [localStyle.buttonText, localStyle.primaryButtonText, { marginHorizontal: 0 }, this.props.buttonTextStyle] }>
            { this.props.buttonText }
          </Text>
        </FadeAnimation.FadeIn>
      </TouchableOpacity>
    )
  }
}

const localStyle = StyleSheet.create({
  button: {
    borderRadius: Utils.moderateScale(4),
    height: Utils.moderateVerticalScale(40, 0.5),
    width: "85%",
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  buttonText: {
    fontFamily: 'Khand-Regular',
    letterSpacing: 0,
    fontSize: Utils.moderateScale(14),
    marginVertical: Utils.moderateVerticalScale(10),
    marginHorizontal: Utils.moderateScale(20),
    paddingHorizontal: Utils.moderateScale(15),
  },
  whiteButtonText: {
    color: Colors.PrimaryText,
  },
  whiteButton: {
    backgroundColor: Colors.White,
    borderColor: Colors.BorderColor,
    borderWidth: Utils.moderateScale(1),
  },
  primaryButtonText: {
    color: Colors.PrimaryText,
  },
  primaryButton: {
    backgroundColor: Colors.Primary,
  },

});

export {
  WhiteButton,
  PrimaryButton,
  WithIconButton,
  ShowNotification
}