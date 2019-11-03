//import libraries
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Alert,
    Image, AsyncStorage,
    Text, Platform,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    TextInput
} from 'react-native';
import { connect } from "react-redux";
import { ActionCreators } from "../actions/index";
import * as Utils from "../lib/utils";
import DeviceInfo from "react-native-device-info";
import * as URL from "../config/urls";
import Loader from '../components/Loader';
import firebase from 'react-native-firebase';
import Snackbar from 'react-native-snackbar';
import { ScrollView } from 'react-native-gesture-handler';
import { Images } from "../assets/Images/index";

// create a component
class LoginScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            showLoginType: true,
            errors: {
                username: '',
                password: ''
            },
            loading: false,
            txtEmailId: '',
            txtPassword: '',
            deviceId: '',
            deviceIP: '',
            deviceToken: '',
            FirstTimeInstallDate: ""
        };
        this.inputs = {};
        this.IP = null;
        this._handlePress = this._handlePress.bind(this);
        this.getDeviceId = this.getDeviceId.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    getDeviceId = () => {
        const _this = this;
        DeviceInfo.getIPAddress().then(ip => {
            _this.IP = ip;
        });
        this.setState({ deviceIP: this.IP });
    };

    componentDidMount() {
        this._isMount = true;
        this.getDeviceId();
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    focusField(key) {
        this.inputs[key].focus();
        this.focusArea = key;
    }

    clearField(key) {
        this.inputs[key].clear();
        this.focusArea = '';
    }

    async loginUser() {
        const _this = this;
        let fcmToken = null;
        try {
            for (let i = 0; i < 5; i++) {
                fcmToken = await firebase.messaging().getToken();
            }
        } catch (error) {
            Utils.printLog('FCM Token error', error);
        }
        const deviceId = DeviceInfo.getUniqueID();

        let data = {
            "email": this.state.txtEmailId,
            "password": this.state.txtPassword,
            "ip_address": _this.IP,
            "device_type": Platform.OS == 'ios' ? 'ios' : 'android',
            "device_id": deviceId,
            "device_token": fcmToken,
            "token": "1111"
        };

        Utils.makeApiRequest(URL.API_URL.login.url, URL.API_URL.login.endPoint, data)
            .then(async response => {
                if (response) {
                    resultData = response.body;
                    // _this.props.setLoggedInUserData(resultData);
                    // global.userData = resultData;
                    // await Utils.saveStateAsyncStorage({ userData: resultData });
                    // _this.setState({ loading: false }, () => {
                    //     _this.props.navigation.navigate('Home');
                    // });
                    if (resultData.verified == 'Yes') {
                        _this.props.setLoggedInUserData(resultData);
                        global.userData = resultData;
                        await Utils.saveStateAsyncStorage({ userData: resultData });
                    }
                    _this.setState({ loading: false }, () => {
                        if (resultData.verified == 'Yes') {
                            _this.props.navigation.navigate('Home');
                        }
                        else {
                            _this.props.navigation.navigate('Otp',
                                {
                                    mobileNo: resultData.mobile
                                });
                        }

                    });
                } else {
                    this.setState({
                        loading: false
                    })
                }
            })
    }

    _handlePress() {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/;
        check = true;
        msg = '';
        if (this.state.txtEmailId == '') {
            check = false;
            msg = 'Please enter user name';
        }
        else if (this.state.txtPassword == '') {
            check = false;
            msg = 'Please enter password';
        }
        else if (reg.test(this.state.txtEmailId) === false) {
            check = false;
            msg = 'Please enter correct email';
        }
        if (check == false) {
            Snackbar.show({
                title: msg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "Red",
            });
        } else {
            this.setState({
                loading: true
            }, () => {
                this.loginUser();
            })
        }

    }
    render() {
        if (this.state.loading) {
            return <Loader loading={this.state.loading} />
        }
        return (
            <ImageBackground source={Images.background}
                style={{ flex: 1, width: '100%', height: '100%' }}>
                <StatusBar backgroundColor="transparent" barStyle="light-content" />
                <View style={styles.headerview}>
                    <Image source={Images.logo} style={styles.image} />
                    <Text style={styles.TextStyle1}>LOGIN</Text>
                </View>
                <ScrollView style={{ marginTop: Utils.moderateVerticalScale(170) }}>
                    <View style={styles.container}>
                        <View>
                            <Text style={styles.TextStyle2}>USERNAME</Text>
                            <TextInput
                                value={this.state.txtEmailId}
                                onChangeText={txtEmailId =>
                                    this.setState({ txtEmailId: txtEmailId })
                                }
                                returnKeyType="next"
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor="#555555"
                                autoCapitalize="none"
                                ref={input => (this.inputs["txtEmailId"] = input)}

                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <Text style={styles.TextStyle2}>PASSWORD</Text>
                        <TextInput
                            value={this.state.txtPassword}
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#555555"
                            autoCapitalize="none"
                            onChangeText={txtPassword =>
                                this.setState({ txtPassword: txtPassword })
                            }
                            returnKeyType="next"
                            secureTextEntry={true}
                            style={styles.input}
                            ref={input => (this.inputs["txtPassword"] = input)}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View style={styles.imageview}>
                        <TouchableOpacity onPress={() => this._handlePress()} >
                            <Image source={Images.nextArrow} style={styles.ImageArrow} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("ForgotPassword")}
                            style={{
                                width: '100%', alignContent: 'center', justifyContent: 'center',
                                alignItems: 'center', height: '100%'
                            }}>
                            <Text style={styles.TextStyle3}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={styles.signup}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Signup")}
                        style={{
                            width: '100%', alignContent: 'center', justifyContent: 'center',
                            alignItems: 'center', height: '100%'
                        }}>
                        <Text style={{ color: '#fff' }}>New user? <Text style={{}}>SIGNUP</Text></Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        paddingTop: Utils.moderateVerticalScale(20),
        alignItems: "center",
        marginTop: Utils.moderateVerticalScale(50),
        justifyContent: "center"
    },
    container: {
        marginLeft: Utils.moderateVerticalScale(30),
    },
    image: {
        width: Utils.moderateVerticalScale(90),
        height: Utils.moderateVerticalScale(90),
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        marginLeft: Utils.moderateVerticalScale(125),
        marginTop: Utils.moderateVerticalScale(20)
    },
    ImageArrow: {
        width: Utils.moderateVerticalScale(55),
        height: Utils.moderateVerticalScale(55),
        alignItems: "center",
        marginLeft: Utils.moderateVerticalScale(130),
        marginTop: Utils.moderateVerticalScale(5)
    },
    imageview: {
        paddingLeft: Utils.moderateVerticalScale(25),
        paddingRight: Utils.moderateVerticalScale(35),
        paddingTop: Utils.moderateVerticalScale(50),
        flex: 1,
        backgroundColor: 'transparent'
    },
    headerview: {
        paddingLeft: Utils.moderateVerticalScale(25),
        paddingRight: Utils.moderateVerticalScale(35),
        paddingTop: Utils.moderateVerticalScale(50),
        flex: 1,
        backgroundColor: 'transparent'
    },
    TextStyle1: {
        alignItems: 'center',
        color: '#fff',
        marginLeft: Utils.moderateVerticalScale(140),
        marginTop: Utils.moderateVerticalScale(20)
    },
    TextStyle2: {
        alignItems: 'center',
        color: '#555555',
        marginLeft: Utils.moderateVerticalScale(25),
        marginTop: Utils.moderateVerticalScale(40)

    },
    signup: {
        height: Utils.moderateVerticalScale(60),
        width: Utils.width,
        borderTopColor: '#25211E',
        borderTopWidth: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#25211e5e'
    },
    TextStyle3: {
        alignItems: 'center',
        color: '#fff',
        marginLeft: Utils.moderateVerticalScale(50),
        marginRight: Utils.moderateVerticalScale(55),
        marginBottom: Utils.moderateVerticalScale(70)

    },
    input: {
        marginTop: Utils.moderateVerticalScale(5),
        marginLeft: Utils.moderateVerticalScale(16),
        color: "#fff",
        alignSelf: 'stretch',
        fontFamily: "Khand-Regular",
        padding: Utils.moderateVerticalScale(10),
        borderBottomColor: '#555555',
        margin: Utils.moderateVerticalScale(5),
        marginRight: Utils.moderateVerticalScale(50),
        borderBottomColor: '#555555',
        borderBottomWidth: Utils.moderateVerticalScale(2)
    },
});

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
)(LoginScreen);