import React, { Component } from "react";
import { Text, View } from "react-native";
import { GlobalStyle } from "../assets/styles/GlobalStyle";
import * as Utils from "../lib/utils";

export default class ListEmptyComponent extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <View
        style={ [
          GlobalStyle.card,
          GlobalStyle.cardWhite,
          {
            marginHorizontal: Utils.moderateScale(20),
            marginVertical: Utils.moderateVerticalScale(10),
          },
          this.props.style
        ] }
      >
        <Text style={ [GlobalStyle.textPrimary] }>
          { this.props.message || "No data to display." }
        </Text>
      </View>
    );
  }
}
