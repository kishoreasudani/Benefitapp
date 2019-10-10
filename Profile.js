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
    Icon
} from 'react-native';
import { Body, Header, Left, Right } from "native-base";
import { connect } from "react-redux";
import { ActionCreators } from "../actions/index";
import { Images } from "../assets/Images/index";
import * as Utils from "../lib/utils";
import { GlobalStyle } from "../assets/styles/GlobalStyle";
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';


// create a component
class ProfileScreen extends Component {
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
    render() {
        return (
            <View style={ [GlobalStyle.container, localStyle.container] }>
                <Header
                    style={ GlobalStyle.header }
                    androidStatusBarColor="#333"
                    iosBarStyle="light-content"
                >
                    <Left style={ { flex: 1 } }>
                        <TouchableOpacity onPress={ () => this.props.navigation.goBack() }>
                            <Image source={ Images.backArrow } style={ {
                                marginRight: Utils.moderateScale(15, 0.5),
                                width: Utils.moderateScale(18),
                                height: Utils.moderateScale(14)
                            } } resizeMode="contain" resizeMethod="resize" />
                        </TouchableOpacity>
                    </Left>
                    <Body style={ GlobalStyle.headerBody }>
                        <Text style={ GlobalStyle.headerTitle }>PROFILE</Text>
                    </Body>
                    <Right style={ { flex: 1 } }>
                        <TouchableOpacity onPress={ () => this.props.navigation.navigate("ChangePassword") }>
                            <Image source={ Images.backArrow } style={ {
                                marginRight: Utils.moderateScale(15, 0.5),
                                width: Utils.moderateScale(18),
                                height: Utils.moderateScale(14)
                            } } resizeMode="contain" resizeMethod="resize" />
                        </TouchableOpacity>
                    </Right>
                </Header>

                <View style={ localStyle.innerContainer }>
                    <View style={ [GlobalStyle.card, localStyle.card] }>
                        <ScrollView style={ { color: "#272727", width: '100%', padding: 0, margin: 0 } }>
                            <View style={ { justifyContent: 'center', alignContent: 'center', alignItems: 'center', padding: 0, margin: 0 } }>
                                <LinearGradient start={ { x: 0, y: 0 } } end={ { x: 1, y: 0 } }
                                    colors={ ['#70bf51', '#54c18d', '#3cc4f5'] }
                                    style={ {
                                        width: '100%', height: Utils.moderateVerticalScale(90),
                                        padding: 0, margin: 0,
                                        borderTopLeftRadius: Utils.moderateScale(Platform.OS == "android" ? 15 : 8),
                                        borderTopRightRadius: Utils.moderateScale(Platform.OS == "android" ? 15 : 8),
                                        marginTop: 0
                                    } } />

                                <Image
                                    source={ require("../assets/Images/img/user-icon.png") }
                                    style={ {
                                        width: Utils.moderateVerticalScale(80),
                                        height: Utils.moderateVerticalScale(80),
                                        borderRadius: Utils.moderateVerticalScale(80 / 2),
                                        alignItems: "center",
                                        zIndex: 10,
                                        marginTop: Utils.moderateVerticalScale(-40)
                                    } }
                                />
                                <Text style={ { fontSize: Utils.moderateVerticalScale(18), color: "#fff", marginVertical: Utils.moderateVerticalScale(5) } }>
                                    { this.props.userData.first_name }
                                    { this.props.userData.last_name }
                                </Text>
                                <View style={ { height: Utils.moderateVerticalScale(0.5), width: '100%', backgroundColor: "#525252", marginVertical: Utils.moderateVerticalScale(10) } } />
                            </View>
                            <View style={ localStyle.formGroup } >
                                <View style={ { paddingLeft: 5, paddingRight: 35, paddingTop: 30 } }>
                                    <Image
                                        source={ require("../assets/Images/img/mobile-number.png") }
                                        style={ {
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40 / 2,
                                            alignItems: "center"
                                        } }
                                    />
                                </View>
                                <View style={ localStyle.textContainer }>
                                    <Text style={ localStyle.formLabel }>MOBILE NUMBER</Text>
                                    <Text style={ localStyle.input }>
                                        +91  { this.props.userData.mobile }
                                    </Text>
                                    {/* <TextInput style={localStyle.input}
                                        placeholder="Mobile Number"
                                        placeholderTextColor="#555555"
                                        autoCapitalize="none"
                                        onChangeText={this.handleMobileNumber} /> */}
                                </View>
                            </View>

                            <View style={ localStyle.formGroup } >
                                <View style={ { paddingLeft: 10, paddingRight: 35, paddingTop: 30 } }>
                                    <Image
                                        source={ require("../assets/Images/img/email.png") }
                                        style={ {
                                            width: 35,
                                            height: 35,
                                            borderRadius: 40 / 2,
                                            alignItems: "center"

                                        } }
                                    />
                                </View>
                                <View style={ localStyle.textContainer }>
                                    <Text style={ localStyle.formLabel }>EMAIL ID</Text>
                                    <Text style={ localStyle.input }>
                                        { this.props.userData.email }
                                    </Text>
                                    {/* <TextInput style={localStyle.input}
                                        placeholder="Email Id"
                                        placeholderTextColor="#555555"
                                        autoCapitalize="none"
                                        onChangeText={this.handleEmailId} /> */}
                                </View>
                            </View>
                            <View style={ localStyle.formGroup } >
                                <View style={ { paddingLeft: 10, paddingRight: 35, paddingTop: 30 } }>
                                    <Image
                                        source={ require("../assets/Images/img/date-of-birth.png") }
                                        style={ {
                                            width: 35,
                                            height: 35,
                                            borderRadius: 40 / 2,
                                            alignItems: "center"
                                        } }
                                    />
                                </View>
                                <View style={ localStyle.textContainer }>
                                    <Text style={ localStyle.formLabel }>DATE OF BIRTH</Text>
                                    <Text style={ localStyle.input }>
                                        02/07/1990
                                    </Text>
                                    {/* <TextInput style={localStyle.input}
                                        placeholder="Date Of Birth"
                                        placeholderTextColor="#555555"
                                        autoCapitalize="none"
                                        onChangeText={this.handleDateOfBirth} /> */}
                                </View>
                            </View>
                            <View style={ { height: Utils.moderateVerticalScale(0.5), width: '100%', backgroundColor: "#525252", marginVertical: Utils.moderateVerticalScale(25) } } />
                            <LinearGradient
                                start={ { x: 0, y: 0 } }
                                end={ { x: 1, y: 0 } }
                                colors={ ['#70bf51', '#54c18d', '#3cc4f5'] }
                                style={ localStyle.buttonContainer1 }>
                                <TouchableOpacity onPress={ () => this.props.navigation.navigate("MyCoins") } style={ { width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center', height: '100%' } }>
                                    <Text style={ { fontFamily: 'Khand-Regular' } }>MY REWARDS</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </ScrollView>
                    </View>
                </View>

            </View>
        );
    }
}

// define your localStyle
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
)(ProfileScreen);    