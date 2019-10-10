import React, { Component } from "react";
import { Image, Modal, StyleSheet, Text, View } from "react-native";
import * as Utils from "../lib/utils";
import { Images } from "../assets/Images/index";
import { Body, Header, Left, Right } from "native-base";
import { GlobalStyle } from "../assets/styles/GlobalStyle";

export default class Loader extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      this.props.loading && (
        <Header
          style={ GlobalStyle.headerModal }
          androidStatusBarColor="#161616"
        >
          <Modal
            transparent={ true }
            animationType={ "fade" }
            visible={ this.props.loading }
            onRequestClose={ () => {
            } }
          >
            <View style={ style.modalBackground }>
              <View
                style={ [
                  style.activityIndicatorWrapper,
                  this.props.message &&
                  this.props.message.length > 0 &&
                  style.activityIndicatorWrapperWidthHeight
                ] }
              >
                { this.props.message && this.props.message.length > 0 ? (
                  <Text style={ style.message }>{ this.props.message }</Text>
                ) : null }
                <Image
                  source={ Images.L3 }
                  //source={ require('../assets/Images/img/L3.gif') }
                  style={ {
                    height: Utils.moderateVerticalScale(100),
                    width: Utils.moderateVerticalScale(100)
                  } }
                />
              </View>
            </View>
          </Modal>
        </Header>
      )
    );
  }
}

const style = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#000000"
  },
  activityIndicatorWrapper: {
    // backgroundColor: "#FFFFFF",
    backgroundColor: "#000000",
    height: Utils.moderateScale(100),
    width: Utils.moderateScale(100),
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around"
  },
  activityIndicatorWrapperWidthHeight: {
    height: Utils.moderateScale(110),
    width: Utils.moderateScale(225),
    backgroundColor: "#000000"
  },
  message: {
    fontFamily: "Khand-Regular",
    fontSize: Utils.moderateScale(14)
  }
});
