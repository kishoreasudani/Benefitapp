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

// create a component
class SignupCreatePasswordScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    componentDidMount() {
        this._isMount = true;
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    handlePassword = (text) => {
        this.setState({ password: text })
    }

    handleConfirmPassword = (text) => {
        this.setState({ confirm_password: text })
    }

    signup_create_password = (password, confirm_pass) => {
        alert('password: ' + password + ' confirm_password: ' + confirm_password)
    }

    render() {
        return (
            <ImageBackground source={ require("../assets/Images/img/background.png") } style={ { flex: 1, width: '100%', height: '100%' } }>
                <StatusBar backgroundColor="transparent" barStyle="light-content" />
                <View style={ {
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    paddingVertical: Utils.moderateVerticalScale(30),
                    flex: 1,
                } }>
                    <Image
                        source={ require("../assets/Images/img/landing-logo.png") }
                        style={ {
                            width: Utils.moderateVerticalScale(90),
                            height: Utils.moderateVerticalScale(90),
                            alignItems: "center",
                            marginVertical: Utils.moderateVerticalScale(20)
                        } }
                    />
                    <Text style={ { color: '#fff' } }>SIGNUP</Text>
                    <Text style={ { color: '#555555', fontSize: 15 } }>CREATE PASSWORD</Text>
                </View>

                <View style={ styles.container }>
                    <View>
                        <Text style={ styles.TextStyle2 }>PASSWORD</Text>
                        <TextInput style={ styles.input }
                            underlineColorAndroid="transparent"
                            placeholder="Password"
                            placeholderTextColor="#555555"
                            autoCapitalize="none"
                            onChangeText={ this.handlePassword } />
                    </View>


                    <Text style={ styles.TextStyle2 }>CONFIRM PASSWORD</Text>
                    <TextInput style={ styles.input }
                        underlineColorAndroid="transparent"
                        placeholder="Confirm Password"
                        placeholderTextColor="#555555"
                        autoCapitalize="none"
                        onChangeText={ this.handleConfirmPassword } />
                </View>



                <View style={ { flex: 1, backgroundColor: 'transparent', marginVertical: Utils.moderateVerticalScale(10), paddingVertical: Utils.moderateVerticalScale(20), justifyContent: 'center', alignItems: 'center', alignContent: 'center' } }>
                    <Text style={ { color: '#fff', fontSize: Utils.moderateVerticalScale(12) } }>02 <Text style={ { fontWeight: 'normal', fontSize: 12, color: '#fff' } }>/02</Text></Text>
                    <Image
                        source={ require("../assets/Images/img/arrow-button.png") }
                        style={ {
                            width: Utils.moderateScale(55),
                            height: Utils.moderateScale(55),
                            alignItems: "center"
                        } }
                    />
                </View>
            </ImageBackground>
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
        marginLeft: 25,

        alignSelf: 'stretch',
        padding: 10,
        borderBottomColor: '#555555',
        margin: 5,
        marginRight: 50,
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
)(SignupCreatePasswordScreen);   