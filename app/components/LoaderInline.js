import React, { Component } from "react";
import { Image, StyleSheet, View } from "react-native";
import * as Utils from "../lib/utils";
import { Images } from "../assets/Images/index";

export default class LoaderInline extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      this.props.loading && (
        <View style={ [style.loading, this.props.style] }>
          <Image source={ Images.L3 }
            //source={ require('../assets/Images/img/L3.gif') }
            style={ {
              height: Utils.moderateVerticalScale(80),
              width: Utils.moderateVerticalScale(80)
            } }

          />
        </View>
      )
    );
  }
}

const style = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
