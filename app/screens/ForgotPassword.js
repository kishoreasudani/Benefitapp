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
import { ActionCreators } from "../actions/index";
import * as Utils from "../lib/utils";
import * as URL from "../config/urls";
import Loader from '../components/Loader';
import { ScrollView } from 'react-native-gesture-handler';
import Snackbar from 'react-native-snackbar';
// create a component
class ForgotPasswordScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor (props) {
        super(props);
        this.state = {
            txtMobileNo: '',
            username: '',
            password: ''
        }
        this.inputs = {};
        this._handlePress = this._handlePress.bind(this);
        this.ForgetPassword = this.ForgetPassword.bind(this);
    }

    componentDidMount() {
        this._isMount = true;
    }

    componentWillUnmount() {
        this._isMount = false;
    }
    async ForgetPassword() {
        const _this = this;
        let data = {
            "mobile": this.state.txtMobileNo,
        };
        Utils.makeApiRequest(URL.API_URL.sendOtp.url, URL.API_URL.sendOtp.endPoint, data)
            .then(async response => {
                if (response) {
                    this.setState({
                        loading: false
                    })
                    Utils.displayAlert("OTP Send Your Mobile No!", response.message);
                    _this.props.navigation.navigate('Otp',
                        {
                            mobileNo: this.state.txtMobileNo
                        });
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
        if (this.state.txtMobileNo == '') {
            check = false;
            msg = 'Please enter Mobile No';
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
                this.ForgetPassword();
            })
        }
    }
    render() {
        if (this.state.loading) {
            return <Loader loading={ this.state.loading } />
        }
        return (
            <ImageBackground source={ require("../assets/Images/img/background.png") } style={ { flex: 1, width: '100%', height: '100%' } }>
                <StatusBar backgroundColor="transparent" barStyle="light-content" />
                <View style={ {
                    paddingLeft: Utils.moderateVerticalScale(25),
                    paddingRight: Utils.moderateVerticalScale(35),
                    paddingTop: Utils.moderateVerticalScale(50),
                    flex: 1,
                    backgroundColor: 'transparent'
                } }>
                    <Image
                        source={ require("../assets/Images/img/landing-logo.png") }
                        style={ {
                            width: Utils.moderateVerticalScale(90),
                            height: Utils.moderateVerticalScale(90),
                            alignItems: "center",
                            marginLeft: Utils.moderateVerticalScale(115),
                            marginTop: Utils.moderateVerticalScale(20)
                        } }
                    />
                    <Text style={ styles.TextStyle1 }>FORGOT PASSWORD</Text>

                </View>
                <ScrollView style={ { marginTop: Utils.moderateVerticalScale(170) } }>
                    <View style={ styles.container }>
                        <Text style={ styles.TextStyle2 }>REGISTERED MOBILE NUMBER</Text>
                        <TextInput
                            value={ this.state.txtMobileNo }
                            onChangeText={ txtMobileNo =>
                                this.setState({ txtMobileNo: txtMobileNo })
                            }
                            returnKeyType="next"
                            style={ styles.input }
                            placeholder="Mobile"
                            maxLength={ 10 }
                            keyboardType="numeric"
                            placeholderTextColor="#555555"
                            autoCapitalize="none"

                            ref={ input => (this.inputs["txtMobileNo"] = input) }

                            underlineColorAndroid="transparent"
                        />

                    </View>
                </ScrollView>
                <View style={ { flex: 1, backgroundColor: 'transparent', marginVertical: Utils.moderateVerticalScale(10), paddingVertical: Utils.moderateVerticalScale(20), justifyContent: 'center', alignItems: 'center', alignContent: 'center' } }>
                    {/* <Text style={{ , color: '#fff', fontSize: Utils.moderateVerticalScale(12) }}>02 <Text style={{ fontWeight: 'normal', color: '#fff' }}>/02</Text></Text> */ }
                    <TouchableOpacity onPress={ () => this._handlePress() } style={ { marginTop: Utils.moderateVerticalScale(10), alignContent: 'center', justifyContent: 'center', alignItems: 'center' } }>
                        <Image
                            source={ require("../assets/Images/img/arrow-button.png") }
                            style={ {
                                width: Utils.moderateScale(55),
                                height: Utils.moderateScale(55),
                                alignItems: "center"
                            } }
                        />
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
        flex: 1,
        marginLeft: Utils.moderateVerticalScale(30),
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
)(ForgotPasswordScreen);   