//import libraries
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Alert,
    Image,
    Platform,
    Text,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Icon,
    AsyncStorage
} from 'react-native';
import { Body, Header, Left, Right } from "native-base";
import { connect } from "react-redux";
import { ActionCreators } from "../actions/index";
import { Images } from "../assets/Images/index";
import * as Utils from "../lib/utils";
import * as URL from "../config/urls";
import { GlobalStyle } from "../assets/styles/GlobalStyle";
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Snackbar from 'react-native-snackbar';
import Loader from '../components/Loader';
import FAIcon from "react-native-vector-icons/FontAwesome";

// create a component
class ChangePasswordScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            password: '',
            confirm_password: '',
            txtOldPassword: '',
            txtNewPassword: '',
            txtConfirmPassword: '',
        }
        this.inputs = {};
        this._handlePress = this._handlePress.bind(this);
        this.id = this.props.navigation.getParam("id");
        this.ChangePassword = this.ChangePassword.bind(this);
    }

    componentDidMount() {
        this._isMount = true;
    }

    componentWillUnmount() {
        this._isMount = false;
    }
    async ChangePassword() {
        const _this = this;
        let data = {
            "id": this.props.userData.id,
            "old_password": this.state.txtOldPassword,
            "new_password": this.state.txtNewPassword,
        };
        //console.log("token", this.props.userData.token)
        Utils.makeApiRequest(URL.API_URL.changePassword.url, URL.API_URL.changePassword.endPoint,
            data, { authorization: this.props.userData.token }, "PUT")
            .then(async response => {
                if (response) {
                    Utils.displayAlert("Update Password ", response.message);
                    _this.setState({ loading: false }, () => {
                        AsyncStorage.clear();
                        _this.props.navigation.navigate('Login');
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
        if (this.state.txtOldPassword == '') {
            check = false;
            msg = 'Please enter old password';
        } else if (this.state.txtNewPassword == '') {
            check = false;
            msg = 'Please enter new password';
        } else if (this.state.txtConfirmPassword == '') {
            check = false;
            msg = 'Please enter Confirm password';
        } else if (this.state.txtNewPassword != this.state.txtConfirmPassword) {
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
                this.ChangePassword();
            })
        }

    }


    render() {
        if (this.state.loading) {
            return <Loader loading={ this.state.loading } />
        }
        return (
            <View style={ [GlobalStyle.container, localStyle.container] }>
                <Header
                    style={ GlobalStyle.header }
                    androidStatusBarColor="#161616"
                    iosBarStyle="light-content"
                >
                    <Left style={ { flex: 1 } }>
                        <TouchableOpacity onPress={ () => this.props.navigation.navigate('Profile') }>
                            <Image source={ Images.backArrow } style={ {
                                marginRight: Utils.moderateScale(15, 0.5),
                                width: Utils.moderateScale(18),
                                height: Utils.moderateScale(14)
                            } } resizeMode="contain" resizeMethod="resize" />
                        </TouchableOpacity>
                    </Left>
                    <Body style={ GlobalStyle.headerBody }>
                        <Text style={ GlobalStyle.headerTitle }>CHANGE PASSWORD</Text>
                    </Body>
                    <Right style={ { flex: 1 } }>
                    </Right>
                </Header>
                <ImageBackground source={ require("../assets/Images/img/background.png") }
                    style={ { flex: 1, width: '100%', height: '100%' } }>
                    <ScrollView style={ { marginTop: Utils.moderateVerticalScale(10) } }>
                        <View style={ styles.container }>
                            <View>
                                <Text style={ styles.TextStyle2 }>OLD PASSWORD</Text>
                                <TextInput
                                    value={ this.state.txtOldPassword }
                                    onChangeText={ txtOldPassword =>
                                        this.setState({ txtOldPassword: txtOldPassword })
                                    }
                                    returnKeyType="next"
                                    style={ styles.input }
                                    placeholder="Old Password"
                                    placeholderTextColor="#555555"
                                    autoCapitalize="none"
                                    secureTextEntry={ true }
                                    ref={ input => (this.inputs["txtOldPassword"] = input) }
                                    underlineColorAndroid="transparent"
                                />
                            </View>

                            <View>
                                <Text style={ styles.TextStyle2 }>NEW PASSWORD</Text>
                                <TextInput
                                    value={ this.state.txtNewPassword }
                                    onChangeText={ txtNewPassword =>
                                        this.setState({ txtNewPassword: txtNewPassword })
                                    }
                                    returnKeyType="next"
                                    style={ styles.input }
                                    placeholder="New Password"
                                    placeholderTextColor="#555555"
                                    autoCapitalize="none"
                                    secureTextEntry={ true }
                                    ref={ input => (this.inputs["txtNewPassword"] = input) }
                                    underlineColorAndroid="transparent"
                                />
                            </View>

                            <View style={ { flex: 0 } }>
                                <Text style={ styles.TextStyle2 }>CONFIRM PASSWORD</Text>
                                <TextInput
                                    value={ this.state.txtConfirmPassword }
                                    onChangeText={ txtConfirmPassword =>
                                        this.setState({ txtConfirmPassword: txtConfirmPassword })
                                    }
                                    returnKeyType="next"
                                    style={ styles.input }
                                    secureTextEntry={ true }
                                    placeholder="Confirm Password"
                                    placeholderTextColor="#555555"
                                    autoCapitalize="none"
                                    ref={ input => (this.inputs["txtConfirmPassword"] = input) }
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>

                        <View style={ { flex: 1 } }>
                        </View>
                        <LinearGradient
                            start={ { x: 0, y: 0 } }
                            end={ { x: 1, y: 0 } }
                            colors={ ['#70bf51', '#54c18d', '#3cc4f5'] }
                            style={ styles.buttonContainer1 }>
                            <TouchableOpacity onPress={ () => this._handlePress() } style={ { width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center', height: '100%' } }>
                                <Text style={ { fontFamily: 'Khand-Regular', } }>CHANGE PASSWORD</Text>
                            </TouchableOpacity>
                        </LinearGradient>
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
        paddingTop: 20,
        alignItems: "center",
        marginTop: 50,
        justifyContent: "center"
    },
    container: {
        marginLeft: Utils.moderateVerticalScale(30),
    },
    TextStyle2: {
        alignItems: 'center',
        color: '#555555',
        marginLeft: 25,
        marginTop: 40

    },
    TextStyle3: {
        alignItems: 'center',
        color: '#fff',
        marginLeft: 90,
        marginTop: 10

    },
    input: {
        marginTop: 5,
        marginLeft: 20,
        color: "#fff",
        fontFamily: "Khand-Regular",
        padding: 10,
        borderBottomColor: '#555555',
        margin: 5,
        marginRight: 50,
        borderBottomColor: '#555555',
        borderBottomWidth: 2
    },
    buttonContainer1: {
        width: "80%",
        marginVertical: Utils.moderateVerticalScale(70),
        marginLeft: Utils.moderateVerticalScale(40),
        height: Utils.moderateVerticalScale(60),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Utils.moderateVerticalScale(50),
    }
});

const localStyle = StyleSheet.create({
    container: {
        backgroundColor: '#161616',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',

    },
    card: {
        margin: Utils.moderateScale(15),
        backgroundColor: '#272727',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    MainContainer: {
        flex: 1,
        paddingTop: 20,
        alignItems: "center",
        marginTop: 50,
        justifyContent: "center"
    },
    input: {
        marginTop: 5,
        color: "#fff",
        marginLeft: 10,
        alignSelf: 'stretch',
        padding: 3,
        margin: 2

    },
    formGroup: {
        flex: 1,
        marginLeft: Utils.moderateVerticalScale(30),
        flexDirection: "row"
    },
    textContainer: {
        alignItems: 'center',
        color: '#555555',
        alignSelf: 'stretch',
        paddingTop: 13,
    },
    formLabel: {
        alignItems: 'center',
        color: '#555555',
        marginTop: 2,
        marginLeft: 10,
        alignSelf: 'stretch',
        padding: 3,
        margin: 2

    },
    buttonContainer1: {
        marginVertical: Utils.moderateVerticalScale(30),
        height: Utils.moderateVerticalScale(60),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Utils.moderateVerticalScale(50),
    },
    circle: {
        width: Utils.moderateVerticalScale(35),
        height: Utils.moderateVerticalScale(35),
        marginVertical: Utils.moderateVerticalScale(20),
        borderRadius: Utils.moderateScale(18),
        backgroundColor: '#555555',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

const mapStateToProps = state => {
    console.log(state.appData.userData)
    return { userData: state.appData.userData };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePasswordScreen);   