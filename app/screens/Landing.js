import React, { Component } from "react";
//import react in our code.
import {
  StyleSheet,
  View,
  Alert,
  Image,
  Text,
  ImageBackground,
  TouchableOpacity,
  StatusBar, Platform
} from "react-native";
import { connect } from "react-redux";
import { ActionCreators } from "../actions/index";
import { GlobalStyle } from "../assets/styles/GlobalStyle";
import * as Utils from "../lib/utils";
import { Images } from "../assets/Images/index";
import LinearGradient from 'react-native-linear-gradient';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
import * as URL from "../config/urls";

// const FBSDK = require('react-native-fbsdk');
// const {
//   AccessToken,
//   LoginManager,
// } = FBSDK;

class LandingScreen extends Component {
  state = {
    isFocused: false
  }
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      deviceId: '',
      deviceIP: '',
    };

    this.googleLogin = this.googleLogin.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);
    this.saveRegisterData = this.saveRegisterData.bind(this);
  }

  getDeviceId = () => {
    const uniqueId = DeviceInfo.getUniqueID();
    this.setState({ deviceId: uniqueId, });
  };

  async componentDidMount() {
    this._configureGoogleSignIn();
    this.getDeviceId();
    const enabled = await firebase.messaging().hasPermission();
    if (!enabled) {
      try {
        await firebase.messaging().requestPermission();
      } catch (error) {
        return false;
      }
    }
  }

  _configureGoogleSignIn() {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
      webClientId: '310761243324-ib051m7a68omjcejtq280f3hclaobn6n.apps.googleusercontent.com',
      offlineAccess: true
    });
  }

  async googleLogin() {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }

    let that = this;
    try {

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      var result = { id: userInfo.user.id, name: userInfo.user.name, email: userInfo.user.email, picture: { data: { url: userInfo.user.photo } } };
      that.saveRegisterData(result, 'google_id');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  async saveRegisterData(result = null, type = 'fb_id') {
    const _this = this;
    DeviceInfo.getIPAddress().then(ip => {
      _this.IP = ip;
    });
    _this.setState({ deviceIP: _this.IP });

    let fcmToken = null;
    try {
      for (let i = 0; i < 5; i++) {
        fcmToken = await firebase.messaging().getToken();
      }
    } catch (error) {
      Utils.printLog('FCM Token error', error);
    }
    const deviceId = DeviceInfo.getUniqueID();

    var arr = result.name.split(" ");
    var fname = arr[0]
    var lname = arr[1]

    console.log('result', result)

    let data = {
      "email": result.email,
      "first_name": fname,
      "last_name": lname,
      "password": "",
      "mobile": "",
      "ip_address": _this.IP,
      "device_type": Platform.OS == 'ios' ? 'ios' : 'android',
      "device_id": deviceId,
      "device_token": fcmToken,
      "fb_token": "",
      "g_token": result.id
    };
    console.log(data)

    Utils.makeApiRequest(URL.API_URL.register.url, URL.API_URL.register.endPoint, data)
      .then(async response => {
        console.log('response', response)
        if (response) {
          resultData = response.body;
          _this.props.setLoggedInUserData(resultData);
          global.userData = resultData;
          await Utils.saveStateAsyncStorage({ userData: resultData });
          _this.setState({ loading: false }, () => {
            _this.props.navigation.navigate('Home');
          });
        } else {
          this.setState({
            loading: false
          })
        }
      })
  }

  async saveRegisterDataFacebook(result = null, type = 'fb_id') {
    const _this = this;
    DeviceInfo.getIPAddress().then(ip => {
      _this.IP = ip;
    });
    _this.setState({ deviceIP: _this.IP });

    let fcmToken = null;
    try {
      for (let i = 0; i < 5; i++) {
        fcmToken = await firebase.messaging().getToken();
      }
    } catch (error) {
      Utils.printLog('FCM Token error', error);
    }
    const deviceId = DeviceInfo.getUniqueID();

    console.log("result", result)

    let data = {
      "email": result.email,
      "first_name": result.first_name,
      "last_name": result.last_name,
      "password": "",
      "mobile": "",
      "ip_address": _this.IP,
      "device_type": Platform.OS == 'ios' ? 'ios' : 'android',
      "device_id": deviceId,
      "device_token": fcmToken,
      "fb_token": result.id,
      "g_token": ""
    };
    console.log(data)

    Utils.makeApiRequest(URL.API_URL.register.url, URL.API_URL.register.endPoint, data)
      .then(async response => {
        console.log('response', response)
        if (response) {
          resultData = response.body;
          _this.props.setLoggedInUserData(resultData);
          global.userData = resultData;
          await Utils.saveStateAsyncStorage({ userData: resultData });
          _this.setState({ loading: false }, () => {
            _this.props.navigation.navigate('Home');
          });
        } else {
          this.setState({
            loading: false
          })
        }
      })
  }
  async facebookLogin() {

    let that = this;
    // LoginManager.logInWithPermissions(['public_profile', 'email']).then(
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        console.log('result', result)
        if (!result.isCancelled) {
          const {
            GraphRequest,
            GraphRequestManager,
          } = FBSDK;
          const accessData = AccessToken.getCurrentAccessToken();

          const infoRequest = new GraphRequest(
            '/me',
            {
              accessToken: accessData.accessToken,
              parameters: {
                fields: {
                  string: 'id,email,name,first_name,middle_name,last_name,picture'
                }
              }
            },
            function (error, result) {
              if (error) {
                console.log(error);
              } else {
                that.saveRegisterDataFacebook(result, 'fb_id');
              }
            },
          );
          new GraphRequestManager().addRequest(infoRequest).start();
        }
      },
      function (error) {
        console.log('Facebook Login failed with error: ' + error);
      }
    );
  }

  render() {
    return (
      <ImageBackground source={Images.background} style={GlobalStyle.imageBackground}>

        <View style={localStyle.logoContainer}>
          <Image source={Images.logo} style={localStyle.logo} resizeMethod="resize" resizeMode="cover" />
        </View>

        <View style={localStyle.innerContainer}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#70bf52', '#4fc19d', '#28c4f5']}
            style={localStyle.buttonContainer}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")} style={localStyle.buttonContainer}>
              <Text style={{}}>LOGIN</Text>
            </TouchableOpacity>
          </LinearGradient>

          <View style={localStyle.circle} >
            <Text style={{ fontSize: Utils.moderateVerticalScale(12), color: '#fff' }}>OR</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", }} >
            {/* <TouchableOpacity onPress={this.facebookLogin}
              style={localStyle.socialButton} activeOpacity={0.5}>
              <Image source={Images.facebookSocialIcon}
                style={localStyle.imageIconStyle}
              />
              <Text style={localStyle.textStyle}>LOGIN</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={this.googleLogin}
              style={localStyle.socialButton} activeOpacity={0.5}>
              <Image source={Images.googleSocialIcon}
                style={localStyle.imageIconStyle}
              />
              <Text style={localStyle.textStyle}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={localStyle.footerContainer}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Signup")} style={{ width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Text style={{ color: '#fff' }}>New user? <Text style={{}}>SIGNUP</Text></Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}
const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    setLoggedInUserData: data => dispatch(ActionCreators.setLoggedInUserData(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingScreen);

const localStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: Utils.moderateVerticalScale(90),
    width: Utils.moderateVerticalScale(90)
  },
  innerContainer: {
    flex: 2,
    alignItems: 'center',
    width: Utils.width,
    paddingHorizontal: Utils.moderateScale(25),
  },
  buttonContainer: {
    marginVertical: Utils.moderateVerticalScale(10),
    width: '80%',
    height: Utils.moderateVerticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Utils.moderateVerticalScale(25),
  },
  circle: {
    width: Utils.moderateVerticalScale(35),
    height: Utils.moderateVerticalScale(35),
    marginVertical: Utils.moderateVerticalScale(20),
    borderRadius: Utils.moderateScale(18),
    backgroundColor: '#555555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555555',
    height: Utils.moderateVerticalScale(50),
    width: '40%',
    borderRadius: Utils.moderateVerticalScale(50),
    margin: Utils.moderateScale(5)
  },
  imageIconStyle: {
    padding: Utils.moderateScale(10),
    margin: Utils.moderateScale(5),
    height: Utils.moderateVerticalScale(40),
    width: Utils.moderateVerticalScale(40),
    resizeMode: 'stretch'
  },
  textStyle: {
    alignItems: 'center',
    color: '#fff',
    marginBottom: Utils.moderateVerticalScale(4),
    marginLeft: Utils.moderateScale(10)
  },
  footerContainer: {
    height: Utils.moderateVerticalScale(60),
    width: Utils.width,
    borderTopColor: '#25211E',
    borderTopWidth: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25211e5e'
  },
});  