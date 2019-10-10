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
import { Images } from "../assets/Images/index";
import * as Utils from "../lib/utils";
import * as URL from "../config/urls";
import { Body, Header, Left, Right } from "native-base";
import { GlobalStyle } from "../assets/styles/GlobalStyle";
import { ScrollView } from 'react-native-gesture-handler';
import Snackbar from 'react-native-snackbar';
import FAIcon from "react-native-vector-icons/FontAwesome";
// create a component
class UpdatePasswordScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            txtPassword: '',
            txtConfirmPassword: '',
            id: ''
        }
        this.inputs = {};
        this._handlePress = this._handlePress.bind(this);
        this.id = this.props.navigation.getParam("id");
        this.UpdatePassword = this.UpdatePassword.bind(this);
    }

    componentDidMount() {
        this._isMount = true;
    }

    componentWillUnmount() {
        this._isMount = false;
    }
    componentWillReceiveProps(props) {
        const id = props.navigation.getParam("id");
    }
    async UpdatePassword() {
        this.state.id = this.id;
        const _this = this;
        let data = {
            "id": this.state.id,
            "password": this.state.txtPassword,
        };

        Utils.makeApiRequest(URL.API_URL.resetPassword.url, URL.API_URL.resetPassword.endPoint, data, {}, "PUT")
            .then(async response => {
                if (response) {
                    console.log(response)
                    Utils.displayAlert("Update Password ", response.message);
                    _this.props.navigation.navigate('Login');
                } else {
                    this.setState({
                        loading: false
                    })
                }
            })
    }

    _handlePress() {
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
                this.UpdatePassword();
            })
        }
    }

    render() {
        return (

            <ImageBackground source={ Images.background } style={ { flex: 1, width: '100%', height: '100%' } }>
                <StatusBar backgroundColor="transparent" barStyle="light-content" />
                <Header
                    style={ GlobalStyle.header }
                    androidStatusBarColor="#161616"
                    iosBarStyle="light-content"
                >
                    <Left style={ { flex: 1 } }>
                        <TouchableOpacity onPress={ () => this.props.navigation.goBack() }>
                            <FAIcon name="arrow-left" style={ { color: "white", fontSize: Utils.moderateScale(15) } } />
                        </TouchableOpacity>
                    </Left>
                    <Body style={ GlobalStyle.headerBody }>
                        <Text style={ GlobalStyle.headerTitle }>RESET PASSWORD</Text>
                    </Body>
                </Header>

                <View style={ styles.ImageView }>
                    <Image source={ Images.logo } style={ styles.ImageLogo } />
                    {/* <Text style={{ color: '#fff' }}>RESET PASSWORD</Text> */ }
                </View>
                <ScrollView style={ { marginTop: Utils.moderateVerticalScale(170) } }>
                    <View style={ styles.container }>
                        <View>
                            <Text style={ styles.TextStyle2 }>PASSWORD</Text>
                            <TextInput
                                value={ this.state.txtPassword }
                                onChangeText={ txtPassword =>
                                    this.setState({ txtPassword: txtPassword })
                                }
                                returnKeyType="next"
                                style={ styles.input }
                                placeholder="Password"
                                placeholderTextColor="#555555"
                                autoCapitalize="none"
                                secureTextEntry={ true }
                                ref={ input => (this.inputs["txtPassword"] = input) }
                                underlineColorAndroid="transparent"
                            />
                        </View>
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
                    <View style={ styles.ViewArrow }>
                        <TouchableOpacity onPress={ () => this._handlePress() }
                            style={ styles.TouchView }>
                            <Image
                                source={ Images.nextArrow }
                                style={ styles.ViewImage }
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
    ImageView: {
        paddingLeft: Utils.moderateVerticalScale(25),
        paddingRight: Utils.moderateVerticalScale(35),
        paddingTop: Utils.moderateVerticalScale(10),
        flex: 1,
        backgroundColor: 'transparent'
    },
    ImageLogo: {
        width: Utils.moderateVerticalScale(90),
        height: Utils.moderateVerticalScale(90),
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        marginLeft: Utils.moderateVerticalScale(125),
        marginTop: Utils.moderateVerticalScale(20)
    },
    ViewArrow: {
        flex: 1, backgroundColor: 'transparent',
        marginVertical: Utils.moderateVerticalScale(10),
        paddingVertical: Utils.moderateVerticalScale(20),
        justifyContent: 'center', alignItems: 'center',
        alignContent: 'center'
    },
    TouchView: {
        marginTop: Utils.moderateVerticalScale(10),
        alignContent: 'center',
        justifyContent: 'center', alignItems: 'center'
    },
    ViewImage: {
        width: Utils.moderateScale(55),
        height: Utils.moderateScale(55),
        alignItems: "center"
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
        marginTop: Utils.moderateVerticalScale(5),
        marginLeft: Utils.moderateVerticalScale(18),
        color: '#fff',
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
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UpdatePasswordScreen);   