//import libraries
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Alert,
    Image,
    Platform,
    Text, FlatList,
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


// create a component
class NotificationsScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            NotificationData: []
        }
        this.renderNotificationData = this.renderNotificationData.bind(this);
    }

    componentDidMount() {
        this._isMount = true;
        this.AboutUs();
    }

    componentWillUnmount() {
        this._isMount = false;
    }
    AboutUs() {
        const _this = this;
        let data = {
            id: this.props.userData.id
        }
        Utils.makeApiRequest(this.props.userData.id, URL.API_URL.getNotification.endPoint, {}, { authorization: this.props.userData.token }, "GET", false, false)
            .then(async response => {
                if (response) {
                    console.log(response.body)
                    this.setState({
                        NotificationData: response.body,
                        loading: false
                    })

                } else {
                    this.setState({
                        NotificationData: [],
                        loading: false
                    })
                }
            })
    }

    renderNotificationData({ item, index }) {
        return (
            <Text
                style={{
                    flex: 2,
                    fontSize: Utils.moderateScale(18),
                    fontWeight: "300",
                    color: "#f3f3f3",
                    textAlign: "center",
                    marginBottom: Utils.moderateScale(0)
                }}
            >
                {item.message}
            </Text>
        );
    }
    render() {
        return (
            <View style={[GlobalStyle.container, localStyle.container]}>
                <Header
                    style={GlobalStyle.header}
                    androidStatusBarColor="#333"
                    iosBarStyle="light-content"
                >
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image source={Images.backArrow} style={{
                                marginRight: Utils.moderateScale(15, 0.5),
                                width: Utils.moderateScale(18),
                                height: Utils.moderateScale(14)
                            }} resizeMode="contain" resizeMethod="resize" />
                        </TouchableOpacity>
                    </Left>
                    <Body style={GlobalStyle.headerBody}>
                        <Text style={GlobalStyle.headerTitle}>Notification</Text>
                    </Body>
                    <Right>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Notifications")}>
                            <FAIcon
                                name="bell"
                                style={{
                                    color: "white",
                                    fontSize: Utils.moderateScale(15),
                                }}
                            />
                        </TouchableOpacity>
                    </Right>
                </Header>
                <View style={localStyle.innerContainer}>
                    <View style={[localStyle.card,
                    { flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <FlatList
                            style={{
                                flex: 1,
                                marginBottom: Utils.scale(5)
                            }}
                            data={this.state.NotificationData}
                            showsVerticalScrollIndicator={false}
                            horizontal={false}
                            keyExtractor={(item, index) => item.id.toString()}
                            renderItem={this.renderNotificationData}
                        />
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

    card: {
        margin: Utils.moderateScale(15),
        paddingVertical: Utils.moderateVerticalScale(10),
        backgroundColor: '#272727',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
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
        marginLeft: 10,
        alignSelf: 'stretch',
        padding: 3,
        margin: 2

    },
    formGroup: {
        flex: 1,
        flexDirection: "row"
    },
    textContainer: {
        alignItems: 'center',
        color: '#555555',
        marginTop: 2,
        marginLeft: 10,
        alignSelf: 'stretch',
        padding: 3,
        margin: 2
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
        width: Utils.moderateVerticalScale(300),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Utils.moderateVerticalScale(50),
        marginLeft: 35
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
)(NotificationsScreen);    