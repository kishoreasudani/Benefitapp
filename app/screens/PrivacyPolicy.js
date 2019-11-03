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
    TextInput, WebView,
    Icon
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
import FAIcon from "react-native-vector-icons/FontAwesome";
import Loader from "../components/Loader";
import LoaderInline from "../components/LoaderInline";
// create a component
class PrivacyPolicyScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            PrivacyPolicyData: [],
            loading: true,
            loadingWeb: true,
        }
        this.hideSpinner = this.hideSpinner.bind(this);
    }

    componentDidMount() {
        this._isMount = true;
        this.PrivacyPolicy();
    }

    componentWillUnmount() {
        this._isMount = false;
    }
    PrivacyPolicy() {
        const _this = this;
        this.setState({
            loading: true,
            loadingWeb: true,
        })
        Utils.makeApiRequest(URL.API_URL.getPrivacyPolicy.url, URL.API_URL.getPrivacyPolicy.endPoint, {}, { authorization: this.props.userData.token }, "GET", false, false)
            .then(async response => {
                if (response) {
                    console.log(response.body)
                    setTimeout(() =>
                        this.setState({
                            PrivacyPolicyData: response.body,
                            loading: false,
                            loadingWeb: false,
                        }), 2000);

                } else {
                    this.setState({
                        PrivacyPolicyData: [],
                        loading: false,
                        loadingWeb: false,
                    })
                }
            })
    }

    hideSpinner() {
        this.setState({ loadingWeb: false });
    }
    htmlRender(rawData) {
        let data = '<html> <head><meta name="viewport" content="width=device-width, initial-scale=1"> </head> <body>';
        data += rawData;
        data += '</body></html>'
        return data;
    }

    render() {
        if (this.state.loading) {
            return <Loader loading={this.state.loading} />;
        }
        return (
            <View style={[GlobalStyle.container]}>
                <Header
                    style={localStyle.PolicyHeader}
                    androidStatusBarColor="#161616"
                    iosBarStyle="light-content"
                >
                    <Left style={{ flex: 1 }}>

                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                            {/* <FAIcon
                                name="arrow-left"
                                style={{
                                    color: "white",
                                    fontSize: Utils.moderateScale(15),
                                }}
                            /> */}
                            <Image source={Images.backArrow} style={{
                                marginRight: Utils.moderateScale(15, 0.5),
                                width: Utils.moderateScale(18),
                                height: Utils.moderateScale(14)
                            }} resizeMode="contain" resizeMethod="resize" />
                        </TouchableOpacity>
                    </Left>
                    <Body style={GlobalStyle.headerBody}>
                        <Text style={GlobalStyle.headerTitle}> PRIVACY POLICY</Text>
                    </Body>
                    <Right style={{ flex: 1 }}>

                    </Right>
                </Header>
                <View style={{ flex: 1, backgroundColor: "#161616", }}>
                    <View style={[localStyle.card, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <View style={localStyle.PolicyView}>
                            <Text style={{ color: '#555555', fontSize: Utils.moderateVerticalScale(15) }}>PRIVACY POLICY</Text>
                            <View style={localStyle.PrivacyView} />
                            <View style={{ flex: 1, width: "100%", backgroundColor: '#161616' }}>
                                <WebView
                                    style={{ flex: 1, backgroundColor: 'transparent', }}
                                    scalesPageToFit={true}
                                    // source={{
                                    //     html: '<p style="color: white">' + this.state.PrivacyPolicyData.description + '</p>'
                                    // }}
                                    source={{ html: this.htmlRender(this.state.PrivacyPolicyData.description) }}
                                    onLoad={() => this.hideSpinner()}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                />
                            </View>
                            {this.state.loadingWeb && <LoaderInline loading={this.state.loadingWeb} />}
                        </View>
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
        width: '100%',
        paddingVertical: Utils.moderateVerticalScale(10)
    },
    PolicyHeader: {
        width: Utils.width,
        backgroundColor: "#161616",
        borderBottomColor: "#161616",
        height: Utils.moderateVerticalScale(100),
        paddingTop: Utils.moderateVerticalScale(30),
        elevation: 0
    },
    PolicyView: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    PrivacyView: {
        height: Utils.moderateVerticalScale(0.5),
        width: '80%',
        backgroundColor: "#525252",
        marginVertical: Utils.moderateVerticalScale(25)
    },
    card: {
        margin: Utils.moderateScale(15),
        paddingVertical: Utils.moderateVerticalScale(10),
        backgroundColor: '#272727',
        flex: 1,
        borderRadius: Utils.moderateVerticalScale(10),
        justifyContent: 'center',
        alignContent: 'center'

    },
    MainContainer: {
        flex: 1,
        paddingTop: Utils.moderateVerticalScale(20),
        alignItems: "center",
        marginTop: Utils.moderateVerticalScale(50),
        justifyContent: "center"
    },
    input: {
        marginTop: Utils.moderateVerticalScale(5),
        marginLeft: Utils.moderateVerticalScale(10),
        alignSelf: 'stretch',
        padding: Utils.moderateVerticalScale(3),
        margin: Utils.moderateVerticalScale(2)

    },
    formGroup: {
        flex: 1,
        flexDirection: "row"
    },
    textContainer: {
        alignItems: 'center',
        color: '#555555',
        marginTop: Utils.moderateVerticalScale(2),
        marginLeft: Utils.moderateVerticalScale(10),
        alignSelf: 'stretch',
        padding: Utils.moderateVerticalScale(3),
        margin: Utils.moderateVerticalScale(2)
    },
    formLabel: {
        alignItems: 'center',
        color: '#555555',
        marginTop: Utils.moderateVerticalScale(2),
        marginLeft: Utils.moderateVerticalScale(10),
        alignSelf: 'stretch',
        padding: Utils.moderateVerticalScale(3),
        margin: Utils.moderateVerticalScale(2)

    },
    buttonContainer1: {
        marginVertical: Utils.moderateVerticalScale(30),
        height: Utils.moderateVerticalScale(60),
        width: Utils.moderateVerticalScale(300),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Utils.moderateVerticalScale(50),
        marginLeft: Utils.moderateVerticalScale(35)
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
)(PrivacyPolicyScreen);     