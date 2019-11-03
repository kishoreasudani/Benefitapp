//import libraries
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Alert,
    Image,
    Text,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    TextInput
} from 'react-native';
import { connect } from "react-redux";
import { Body, Header, Left, Right } from "native-base";
import { ActionCreators } from "../actions/index";
import * as Utils from "../lib/utils";
import * as URL from "../config/urls";
import OTPTextView from 'react-native-otp-textinput';
import { ScrollView } from 'react-native-gesture-handler';
import Snackbar from 'react-native-snackbar';
import { GlobalStyle } from "../assets/styles/GlobalStyle";
import { Images } from "../assets/Images/index";
import FAIcon from "react-native-vector-icons/FontAwesome";
// create a component
class OtpScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            otp: '',
            MobileNo: ''
        }

        this.inputs = {};
        this.MobileNo = this.props.navigation.getParam("mobileNo");
        this._handlePress = this._handlePress.bind(this);
        this.VerifyOtp = this.VerifyOtp.bind(this);
        this.SendRegisterOtp = this.SendRegisterOtp.bind(this);
    }

    componentDidMount() {
        this._isMount = true;
        this.SendRegisterOtp();
    }
    async SendRegisterOtp() {
        const _this = this;
        let data = {
            "mobile": this.MobileNo,
            otp_type: "register"
        };
        Utils.makeApiRequest(URL.API_URL.sendOtp.url, URL.API_URL.sendOtp.endPoint, data)
            .then(async response => {
                if (response) {
                    this.setState({
                        loading: false
                    })
                    Utils.displayAlert("OTP Send Your Mobile No!", response.message);
                    // _this.props.navigation.navigate('Otp',
                    //     {
                    //         mobileNo: this.MobileNo
                    //     });
                } else {
                    this.setState({
                        loading: false
                    })
                }
            })
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    componentWillReceiveProps(props) {
        const MobileNo = props.navigation.getParam("mobileNo");
    }


    async VerifyOtp() {
        this.state.MobileNo = this.MobileNo;
        const _this = this;
        let data = {
            "mobile": this.state.MobileNo,
            "otp": this.state.otp,
            otp_type: "register"
        };

        Utils.makeApiRequest(URL.API_URL.verifyOtp.url, URL.API_URL.verifyOtp.endPoint, data)
            .then(async response => {
                if (response) {
                    this.setState({
                        loading: false
                    })
                    Utils.displayAlert("Verify Otp ", response.message);
                    _this.props.navigation.navigate('Login')
                } else {
                    this.setState({
                        loading: false
                    })
                }
            })
    }

    _handlePress() {
        check = true;
        msg = '';
        if (this.state.otp == '') {
            check = false;
            msg = 'Please fill otp';
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
                this.VerifyOtp();
            })
        }
    }
    render() {
        return (
            <View style={[GlobalStyle.container, styles.container]}>
                <Header
                    style={GlobalStyle.header}
                    androidStatusBarColor="#161616"
                    iosBarStyle="light-content"
                >
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                            <FAIcon
                                name="arrow-left"
                                style={{
                                    color: "white",
                                    fontSize: Utils.moderateScale(15),
                                }}
                            />
                        </TouchableOpacity>
                    </Left>
                    <Body style={GlobalStyle.headerBody}>
                        <Text style={GlobalStyle.headerTitle}>Verify OTP</Text>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <ImageBackground source={require("../assets/Images/img/background.png")}
                    style={{ flex: 1, width: '100%', height: '100%' }}>

                    <View style={{
                        paddingLeft: Utils.moderateVerticalScale(25),
                        paddingRight: Utils.moderateVerticalScale(35),
                        paddingTop: Utils.moderateVerticalScale(50),
                        flex: 1,
                        backgroundColor: 'transparent'
                    }}>
                        <Image
                            source={require("../assets/Images/img/landing-logo.png")}
                            style={{
                                width: Utils.moderateVerticalScale(90),
                                height: Utils.moderateVerticalScale(90),
                                alignItems: "center",
                                marginLeft: Utils.moderateVerticalScale(115),
                                marginTop: Utils.moderateVerticalScale(20)
                            }}
                        />


                    </View>
                    <ScrollView style={{ marginTop: Utils.moderateVerticalScale(150) }}>
                        <View style={{ marginLeft: Utils.moderateVerticalScale(50), width: "60%" }}>
                            <OTPTextView
                                containerStyle={styles.textInputContainer}
                                handleTextChange={text => this.setState({ otp: text })}
                                textInputStyle={styles.otpTextInput}
                                inputCount={6}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={{
                            flex: 1, backgroundColor: 'transparent',
                            marginVertical: Utils.moderateVerticalScale(10),
                            paddingVertical: Utils.moderateVerticalScale(20),
                            justifyContent: 'center', alignItems: 'center',
                            alignContent: 'center'
                        }}>
                            <TouchableOpacity onPress={() => this._handlePress()}>
                                <Text style={{
                                    fontFamily: "Khand-Regular",
                                    color: '#fff',
                                    fontSize: Utils.moderateVerticalScale(15)
                                }}>RESEND OTP</Text>
                            </TouchableOpacity>

                            {/* <Text style={{ , color: '#fff', fontSize: Utils.moderateVerticalScale(12) }}>02 <Text style={{ fontWeight: 'normal', color: '#fff' }}>/02</Text></Text> */}
                            <TouchableOpacity onPress={() => this._handlePress()} style={{ marginTop: Utils.moderateVerticalScale(10), alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require("../assets/Images/img/arrow-button.png")}
                                    style={{
                                        width: Utils.moderateScale(55),
                                        height: Utils.moderateScale(55),
                                        alignItems: "center"
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </ImageBackground>
            </View>
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
        backgroundColor: '#161616',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        // flex: 1,
        // marginLeft: Utils.moderateVerticalScale(30),
    },
    TextStyle1: {
        alignItems: 'center',
        color: '#fff',
        marginLeft: Utils.moderateVerticalScale(100),
        marginTop: Utils.moderateVerticalScale(20)
    },
    TextStyle2: {
        alignItems: 'center',
        color: '#555555',
        marginLeft: Utils.moderateVerticalScale(25),
        marginTop: Utils.moderateVerticalScale(40)

    },
    TextStyle3: {
        alignItems: 'center',
        color: '#fff',
        marginLeft: Utils.moderateVerticalScale(90),
        marginTop: Utils.moderateVerticalScale(10)

    },
    input: {
        marginTop: Utils.moderateVerticalScale(2),
        marginLeft: Utils.moderateVerticalScale(16),
        color: "#fff",
        fontFamily: "Khand-Regular",
        padding: Utils.moderateVerticalScale(10),
        borderBottomColor: '#555555',
        margin: Utils.moderateVerticalScale(5),
        marginRight: Utils.moderateVerticalScale(50),
        borderBottomColor: '#555555',
        borderBottomWidth: 2
    },
});


const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OtpScreen);   