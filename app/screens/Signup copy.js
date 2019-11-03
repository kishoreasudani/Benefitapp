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
    TextInput, Platform

} from 'react-native';
import { connect } from "react-redux";
import { ActionCreators } from "../actions/index";
import * as Utils from "../lib/utils";
import { ScrollView } from 'react-native-gesture-handler';
import DeviceInfo from "react-native-device-info";
import * as URL from "../config/urls";
import Loader from '../components/Loader';
import firebase from 'react-native-firebase';
import Snackbar from 'react-native-snackbar';
import { Images } from "../assets/Images/index";
import { Body, Header, Left, Right } from "native-base";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { GlobalStyle } from "../assets/styles/GlobalStyle";
// create a component
class SignupScreen extends Component {
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
            status: true,
            loading: false,
            txtFirstName: '',
            txtLastName: '',
            txtEmailId: '',
            txtMobileNo: '',
            txtPassword: '',
            txtConfirmPassword: '',
            deviceId: '',
            deviceIP: '',
            deviceToken: '',
        };
        this.inputs = {};
        this.IP = null;
        this._handlePress = this._handlePress.bind(this);
        this.getDeviceId = this.getDeviceId.bind(this);
        this.saveRegisterData = this.saveRegisterData.bind(this);
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

    ShowHideTextComponentView = () => {
        check = true;
        msg = '';
        if (this.state.txtFirstName == '') {
            check = false;
            msg = 'Please enter first name';
        } else if (this.state.txtLastName == '') {
            check = false;
            msg = 'Please enter last name';
        } else if (this.state.txtMobileNo == '') {
            check = false;
            msg = 'Please enter mobile no';
        } else if (this.state.txtEmailId == '') {
            check = false;
            msg = 'Please enter email id';
        }
        if (check == false) {
            Snackbar.show({
                title: msg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "Red",
            });
        } else {

            this.setState({
                status: false,
            })


        }
    }

    async saveRegisterData() {
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
            "first_name": this.state.txtFirstName,
            "last_name": this.state.txtLastName,
            "password": this.state.txtPassword,
            "mobile": this.state.txtMobileNo,
            "ip_address": _this.IP,
            "device_type": Platform.OS == 'ios' ? 'ios' : 'android',
            "device_id": deviceId,
            "device_token": fcmToken,
            "fb_token": "",
            "g_token": ""
        };
        console.log(data)
        Utils.makeApiRequest(URL.API_URL.register.url, URL.API_URL.register.endPoint, data)
            .then(async response => {
                if (response) {
                    this.setState({
                        loading: false
                    })
                    Utils.displayAlert("Success!", response.message);
                    _this.props.navigation.navigate("Login");
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
        if (this.state.txtPassword == '') {
            check = false;
            msg = 'Please enter password';
        } else if (this.state.txtConfirmPassword == '') {
            check = false;
            msg = 'Please enter Confirm password';
        } else if (this.state.txtPassword != this.state.txtConfirmPassword) {
            check = false;
            msg = 'Both Passwords should be same';
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
                this.saveRegisterData();
            })
        }
    }

    render() {
        if (this.state.loading) {
            return <Loader loading={this.state.loading} />
        }
        return (
            <View style={[GlobalStyle.container, styles.container1]}>
                {
                    this.state.status ?
                        <View style={{ paddingTop: Utils.moderateVerticalScale(50) }}></View> :
                        <Header
                            style={GlobalStyle.header}
                            androidStatusBarColor="#161616"
                            iosBarStyle="light-content"
                        >
                            <Left style={{ flex: 1 }}>
                                {/* onPress={() => this.props.navigation.goBack()} */}
                                <TouchableOpacity onPress={() => this.ShowHideTextComponentView()} >
                                    <Image source={Images.backArrow} style={{
                                        marginRight: Utils.moderateScale(15, 0.5),
                                        width: Utils.moderateScale(15),
                                        height: Utils.moderateScale(14)
                                    }}
                                        resizeMode="contain"
                                        resizeMethod="resize" />
                                </TouchableOpacity>
                            </Left>
                            <Body style={GlobalStyle.headerBody}>
                                <Text style={GlobalStyle.headerTitle}>Back</Text>
                            </Body>
                        </Header>
                }
                <ImageBackground source={require("../assets/Images/img/background.png")}
                    style={{ flex: 1, width: '100%', height: '100%' }}>
                    <StatusBar backgroundColor="transparent" barStyle="light-content" />
                    <View style={{
                        paddingLeft: Utils.moderateVerticalScale(25),
                        paddingRight: Utils.moderateVerticalScale(35),
                        paddingTop: Utils.moderateVerticalScale(20),
                        flex: 1,
                        backgroundColor: 'transparent'
                    }}>
                        <Image
                            source={require("../assets/Images/img/landing-logo.png")}
                            style={{
                                width: Utils.moderateVerticalScale(90),
                                height: Utils.moderateVerticalScale(90),
                                alignItems: "center",
                                marginLeft: Utils.moderateVerticalScale(125),
                                marginTop: Utils.moderateVerticalScale(20)
                                // flex- wrap: nowrap 
                            }}
                        />
                        <Text style={styles.TextStyle1}>SIGNUP</Text>
                        {
                            this.state.status ?
                                null
                                : <Text style={styles.TextStyle4}>CREATE PASSWORD</Text>}
                    </View>
                    <ScrollView style={{ marginTop: Utils.moderateVerticalScale(170) }}>
                        {
                            this.state.status ?

                                <View style={styles.container}>
                                    <View>
                                        <Text style={styles.TextStyle2}>FIRST NAME</Text>
                                        <TextInput
                                            value={this.state.txtFirstName}
                                            onChangeText={txtFirstName =>
                                                this.setState({ txtFirstName: txtFirstName })
                                            }
                                            returnKeyType="next"
                                            style={styles.input}
                                            placeholder="First Name"
                                            placeholderTextColor="#555555"
                                            autoCapitalize="none"
                                            ref={input => (this.inputs["txtFirstName"] = input)}

                                            underlineColorAndroid="transparent"
                                        />

                                    </View>
                                    <View>
                                        <Text style={styles.TextStyle2}>LAST NAME</Text>
                                        <TextInput
                                            value={this.state.txtLastName}
                                            onChangeText={txtLastName =>
                                                this.setState({ txtLastName: txtLastName })
                                            }
                                            returnKeyType="next"
                                            style={styles.input}
                                            placeholder="Last Name"
                                            placeholderTextColor="#555555"
                                            autoCapitalize="none"
                                            ref={input => (this.inputs["txtLastName"] = input)}

                                            underlineColorAndroid="transparent"
                                        />

                                    </View>
                                    <View>
                                        <Text style={styles.TextStyle2}>EMAIL</Text>
                                        <TextInput
                                            value={this.state.txtEmailId}
                                            onChangeText={txtEmailId =>
                                                this.setState({ txtEmailId: txtEmailId })
                                            }
                                            returnKeyType="next"
                                            style={styles.input}
                                            placeholder="Email"
                                            placeholderTextColor="#555555"
                                            autoCapitalize="none"
                                            ref={input => (this.inputs["txtEmailId"] = input)}

                                            underlineColorAndroid="transparent"
                                        />

                                    </View>
                                    <View>
                                        <Text style={styles.TextStyle2}>MOBILE</Text>
                                        <TextInput
                                            value={this.state.txtMobileNo}
                                            onChangeText={txtMobileNo =>
                                                this.setState({ txtMobileNo: txtMobileNo })
                                            }
                                            returnKeyType="next"
                                            style={styles.input}
                                            placeholder="Mobile"
                                            maxLength={10}
                                            keyboardType="numeric"
                                            placeholderTextColor="#555555"
                                            autoCapitalize="none"
                                            ref={input => (this.inputs["txtMobileNo"] = input)}
                                            underlineColorAndroid="transparent"
                                        />

                                    </View>
                                </View>

                                : <View style={[styles.container]}>
                                    <View>
                                        <Text style={styles.TextStyle2}>PASSWORD</Text>
                                        <TextInput
                                            value={this.state.txtPassword}
                                            onChangeText={txtPassword =>
                                                this.setState({ txtPassword: txtPassword })
                                            }
                                            returnKeyType="next"
                                            style={styles.input}
                                            placeholder="Password"
                                            placeholderTextColor="#555555"
                                            autoCapitalize="none"
                                            secureTextEntry={true}
                                            ref={input => (this.inputs["txtPassword"] = input)}
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.TextStyle2}>CONFIRM PASSWORD</Text>
                                        <TextInput
                                            value={this.state.txtConfirmPassword}
                                            onChangeText={txtConfirmPassword =>
                                                this.setState({ txtConfirmPassword: txtConfirmPassword })
                                            }
                                            returnKeyType="next"
                                            style={styles.input}
                                            secureTextEntry={true}
                                            placeholder="Confirm Password"
                                            placeholderTextColor="#555555"
                                            autoCapitalize="none"
                                            ref={input => (this.inputs["txtConfirmPassword"] = input)}
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                </View>

                        }


                        <View style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            marginVertical: Utils.moderateVerticalScale(10),
                            paddingVertical: Utils.moderateVerticalScale(20),
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                            width: '100%',

                        }}>
                            {
                                this.state.status ?
                                    <Text style={{ color: '#fff', fontSize: Utils.moderateVerticalScale(12) }}>01 <Text style={{ fontWeight: 'normal', fontSize: Utils.moderateVerticalScale(12), color: '#fff' }}>/02</Text></Text>
                                    :
                                    <Text style={{ color: '#fff', fontSize: Utils.moderateVerticalScale(12) }}>02 <Text style={{ fontWeight: 'normal', fontSize: Utils.moderateVerticalScale(12), color: '#fff' }}>/02</Text></Text>
                            }

                            <View style={{
                                width: '100%',
                                alignContent: 'center',
                                justifyContent: 'center', alignItems: 'center',
                            }}>
                                {
                                    this.state.status ?
                                        <TouchableOpacity onPress={() => this.ShowHideTextComponentView()} >
                                            <Image
                                                source={require("../assets/Images/img/arrow-button.png")}
                                                style={{
                                                    width: Utils.moderateScale(55),
                                                    height: Utils.moderateScale(55),
                                                    alignItems: "center"
                                                }}
                                            />

                                        </TouchableOpacity>
                                        : null
                                }


                                {
                                    this.state.status ?
                                        null
                                        : <TouchableOpacity onPress={() => this._handlePress()} >
                                            <Image
                                                source={require("../assets/Images/img/arrow-button.png")}
                                                style={{
                                                    width: Utils.moderateScale(55),
                                                    height: Utils.moderateScale(55),
                                                    alignItems: "center"
                                                }}
                                            />

                                        </TouchableOpacity>
                                }
                            </View>

                        </View>
                    </ScrollView>
                    {
                        this.state.status ?
                            <View style={{
                                height: Utils.moderateVerticalScale(60),
                                width: Utils.width,
                                borderTopColor: '#25211E',
                                borderTopWidth: 1,
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#25211e5e'
                            }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")} style={{ width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <Text style={{ color: '#fff' }}>Already registered?
                        <Text style={{}}>LOGIN</Text></Text>
                                </TouchableOpacity>
                            </View> : null
                    }
                </ImageBackground>
            </View>
        );
    }
}

// define your styles  
const styles = StyleSheet.create({
    container: {
        marginLeft: Utils.moderateVerticalScale(30),
    },
    container1: {
        backgroundColor: '#161616',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },

    TextStyle1: {
        alignItems: 'center',
        color: '#fff',
        marginLeft: Utils.moderateVerticalScale(140),
        marginTop: Utils.moderateVerticalScale(15)

    },
    TextStyle4: {
        alignItems: 'center',
        color: '#fff',
        marginLeft: Utils.moderateVerticalScale(120),
        marginTop: Utils.moderateVerticalScale(10)

    },
    TextStyle2: {
        alignItems: 'center',
        color: '#555555',
        marginLeft: Utils.moderateVerticalScale(25),
        marginTop: Utils.moderateVerticalScale(40),
        //lineHeight: Utils.moderateVerticalScale(15)

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
        alignSelf: 'stretch',
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
)(SignupScreen);  