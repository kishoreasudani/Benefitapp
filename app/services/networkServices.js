import React, {Component} from 'react';
import {View} from 'react-native';
import Snackbar from 'react-native-snackbar';
import NetInfo from "@react-native-community/netinfo";

export default class NetworkService extends Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      connection_Status: ""
    };
    this.internetStatus = false;
  }

  componentDidMount() {
    this._isMounted = true;
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );

    NetInfo.isConnected.fetch().done((isConnected) => {
      if (isConnected != true) {
        Snackbar.show({
          title: 'You must connect to Wi-fi or a Cellular Network to get online',
          duration: Snackbar.LENGTH_INDEFINITE,
          backgroundColor: 'red'
        });
      }
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
    this._isMounted = false;
  }

  _handleConnectivityChange = (isConnected) => {
    if (isConnected == true) {
      Snackbar.show({
        title: 'Your are connected now',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'green'
      });
    } else {
      Snackbar.show({
        title: 'You must connect to Wi-fi or a Cellular Network to get online',
        duration: Snackbar.LENGTH_INDEFINITE,
        backgroundColor: 'red'
      });
    }
  };

  render() {
    return (
      <View/>
    );
  }
}