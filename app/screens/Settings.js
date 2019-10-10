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
    Icon, Modal,
    Switch,
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
import FAIcon from "react-native-vector-icons/FontAwesome";
import * as Buttons from "../components/Button";
import Share from 'react-native-share';

const MultipleOptions = {
    title: 'Share via',
    message: 'some message',
    url: 'some share url',
    social: Share.Social.FACEBOOK,
    // social: Share.Social.WHATSAPP,
    //whatsAppNumber: "9199999999" 
    // country code + phone number(currently only works on Android)
};
// create a component
class SettingsScreen extends Component {

    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            modalVisible: false,
            switchValue: true,
            ModalVisibleStatus: false,
        }
        this.logout = this.logout.bind(this);
        this.GetProfile = this.GetProfile.bind(this);
        this.editSetting = this.editSetting.bind(this);
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    componentDidMount() {
        this._isMount = true;
        this.GetProfile();

    }
    toggleSwitch = value => {
        console.log('SwitchNotification', value)
        this.setState({ switchValue: value });
    };

    GetProfile() {
        this.setState({
            loading: true,
        });
        Utils.makeApiRequest(URL.API_URL.getUserProfile.url, URL.API_URL.getUserProfile.endPoint,
            { id: this.props.userData.id }, { authorization: this.props.userData.token })
            .then(result => {
                if (this._isMount) {
                    if (result === false || typeof result !== "object") {
                        this.setState({ loading: false }, () => {
                            Utils.displayAlert("Oops!", "Something went wrong. Please try again.");
                        });
                    } else if (result) {
                        const resultData = result.body.length > 0 ? result.body[0] : [];
                        if (resultData != null) {
                            if (resultData.push_notifications == "yes") {
                                this.setState({ switchValue: true, loading: false });
                            } else {
                                this.setState({ switchValue: false, loading: false });
                            }
                        }
                    } else {
                        this.setState({ loading: false }, () => {
                            Utils.displayAlert("Oops!", "No data is their for this user.");
                        });
                    }
                }
                else {
                    this.setState({
                        loading: false,
                        refreshing: false
                    })
                }
            });
    }

    editSetting() {
        const _this = this;
        try {
            console.log('this.state.switchValue', this.state.switchValue)
            let data = {};
            if (this.state.switchValue == false) {
                data = {
                    id: this.props.userData.id,
                    notificationStatus: "yes"
                };
            }
            else {
                data = {
                    id: this.props.userData.id,
                    notificationStatus: "no"
                };
            }

            this.setState({
                loading: true
            });

            Utils.makeApiRequest(URL.API_URL.updateNotificationStatus.url, URL.API_URL.updateNotificationStatus.endPoint,
                data, { authorization: this.props.userData.token }, "POST", false, true
            ).then(result => {
                if (result === false || typeof result !== "object") {
                    this.setState({ loading: false }, () => {
                        Utils.displayAlert("Oops!", "Something went wrong. Please try again.");
                    });
                } else if (result.message == 'success') {
                    _this.setState({ loading: false, }, () => {
                        //Utils.displayAlert("Notifications updated successfully");
                        // _this.GetProfile();
                    });
                } else {
                    this.setState({ loading: false }, () => {
                        Utils.displayAlert("Oops!", result.msg || "Invalid Request");
                    });
                }
            });
        } catch (e) {
            console.debug(e);
            this.setState({ loading: false });
        }
    }


    logout() {
        // Utils.displayAlert("Alert", "Are you sure to Logout?", "Yes", () => {
        //     AsyncStorage.clear();
        //     this.props.navigation.navigate('Login');
        // }, "No")
        // Utils.displayAlert("Alert", "Are you sure to Logout?", "Yes", () => {
        this.ShowModalFunction(false);
        AsyncStorage.clear();
        this.props.navigation.navigate('Login');
        //}, true, "No", true, true, Images.alert);
    }
    componentWillUnmount() {
        this._isMount = false;
    }

    ShowModalFunction(visible) {
        this.setState({ ModalVisibleStatus: visible });
    }
    render() {
        return (
            <View style={ [GlobalStyle.container, localStyle.container] }>
                <Header
                    style={ GlobalStyle.header }
                    androidStatusBarColor="#161616"
                    iosBarStyle="light-content"
                >
                    <Left style={ { flex: 0 } }>
                        <Text style={ GlobalStyle.headerTitle }>SETTINGS</Text>
                        {/* <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image source={Images.backArrow} style={{
                                marginRight: Utils.moderateScale(15, 0.5),
                                width: Utils.moderateScale(18),
                                height: Utils.moderateScale(14)
                            }} resizeMode="contain" resizeMethod="resize" />
                        </TouchableOpacity> */}
                    </Left>
                    <Body style={ GlobalStyle.headerBody }>
                        {/* <Text style={ GlobalStyle.headerTitle }>SETTINGS</Text> */ }
                    </Body>
                    <Right>
                        {/* <TouchableOpacity onPress={ () => this.props.navigation.navigate("Notifications") }>
                            <FAIcon
                                name="bell"
                                style={ {
                                    color: "white",
                                    fontSize: Utils.moderateScale(15),
                                } }
                            />
                        </TouchableOpacity> */}
                        <Buttons.ShowNotification onPress={ () => {
                            this.props.navigation.navigate("Notifications")
                        } } />
                    </Right>
                </Header>
                <ScrollView>
                    <View style={ localStyle.innerContainer }>
                        <View style={ [GlobalStyle.card, localStyle.card, {
                            height: Utils.moderateVerticalScale(65),
                            flexDirection: 'row', justifyContent: 'space-between'
                        }] }>
                            <Text style={ {
                                color: '#fff', fontWeight: '400',
                                marginLeft: Utils.moderateScale(15),
                                fontSize: Utils.moderateVerticalScale(15)
                            } }>Notifications </Text>
                            <Switch
                                trackColor={ { true: "#93CE4F", false: "grey" } }
                                // onValueChange={ this.toggleSwitch }
                                onValueChange={ switchValue =>
                                    this.setState({ switchValue: switchValue }, this.editSetting())
                                }
                                value={ this.state.switchValue }

                            //onValueChange={ isSwitchOn => this.setState({ isSwitchOn }) }
                            // value={ this.state.isSwitchOn }
                            />
                        </View>
                        <View style={ [GlobalStyle.card, localStyle.card, { justifyContent: 'space-between', }] }>
                            <View style={ {
                                flexDirection: 'row',
                                borderBottomWidth: 1,
                                paddingLeft: Utils.moderateScale(10),
                                paddingTop: '5%',
                                paddingRight: Utils.moderateScale(10),
                                paddingBottom: '5%',
                                borderBottomColor: '#3C3C3C', width: '90%',
                                justifyContent: 'flex-start',
                                marginHorizontal: Utils.moderateScale(10)
                            } }>
                                <Image source={ Images.inviteFriends }
                                    style={ {
                                        width: 30,
                                        height: 30,
                                        borderRadius: 40 / 2,
                                        // alignItems: "center"
                                    } }
                                />
                                <TouchableOpacity onPress={ () => Share.open(MultipleOptions) }>
                                    <Text style={ {
                                        color: '#fff',
                                        paddingTop: Utils.moderateScale(5),
                                        marginHorizontal: Utils.moderateScale(15)
                                    } }>Invite Friends</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={ {
                                flexDirection: 'row',
                                borderBottomWidth: 1,
                                paddingLeft: Utils.moderateScale(10),
                                paddingTop: '5%',
                                paddingRight: Utils.moderateScale(10),
                                paddingBottom: '5%',
                                borderBottomColor: '#3C3C3C', width: '90%',
                                justifyContent: 'flex-start',
                                marginHorizontal: Utils.moderateScale(10)
                            } }>
                                <Image source={ Images.about }
                                    style={ {
                                        width: 30,
                                        height: 30,
                                        borderRadius: 40 / 2,

                                        // alignItems: "center"
                                    } }
                                />
                                <TouchableOpacity onPress={ () => this.props.navigation.navigate("AboutUs") }>
                                    <Text style={ { color: '#fff', paddingTop: Utils.moderateScale(5), marginHorizontal: Utils.moderateScale(15) } }>About Us</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={ {
                                flexDirection: 'row',
                                borderBottomWidth: 1,
                                paddingLeft: Utils.moderateScale(10),
                                paddingTop: '5%',
                                paddingRight: Utils.moderateScale(10),
                                paddingBottom: '5%',
                                borderBottomColor: '#3C3C3C', width: '90%',
                                justifyContent: 'flex-start',
                                marginHorizontal: Utils.moderateScale(10)
                            } }>
                                <Image source={ Images.faq }
                                    style={ {
                                        width: 30,
                                        height: 30,
                                        borderRadius: 40 / 2,

                                        // alignItems: "center"
                                    } }
                                />
                                <TouchableOpacity onPress={ () => this.props.navigation.navigate("FAQs") }>
                                    <Text style={ { color: '#fff', paddingTop: Utils.moderateScale(5), marginHorizontal: Utils.moderateScale(15) } }>FAQs</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={ {
                                flexDirection: 'row',
                                borderBottomWidth: 1,
                                paddingLeft: Utils.moderateScale(10),
                                paddingTop: '5%',
                                paddingRight: Utils.moderateScale(10),
                                paddingBottom: '5%',
                                borderBottomColor: '#3C3C3C', width: '90%',
                                justifyContent: 'flex-start',
                                marginHorizontal: Utils.moderateScale(10)
                            } }>
                                <Image source={ Images.termsAndConditions }
                                    style={ {
                                        width: 30,
                                        height: 30,
                                        borderRadius: 40 / 2,
                                        // alignItems: "center"
                                    } }
                                />
                                <TouchableOpacity onPress={ () => this.props.navigation.navigate("TermsAndConditions") }>
                                    <Text style={ { color: '#fff', paddingTop: Utils.moderateScale(5), marginHorizontal: Utils.moderateScale(15) } }>Terms & Conditions</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={ {
                                flexDirection: 'row',
                                borderBottomWidth: 1,
                                paddingLeft: Utils.moderateScale(10),
                                paddingTop: '5%',
                                paddingRight: Utils.moderateScale(10),
                                paddingBottom: '5%',
                                borderBottomColor: '#3C3C3C', width: '90%',
                                justifyContent: 'flex-start',
                                marginHorizontal: Utils.moderateScale(10)
                            } }>
                                <Image source={ Images.privacyPolicy }
                                    style={ {
                                        width: Utils.moderateVerticalScale(30),
                                        height: Utils.moderateVerticalScale(30),
                                        borderRadius: 40 / 2,
                                        // alignItems: "center"
                                    } }
                                />
                                <TouchableOpacity onPress={ () => this.props.navigation.navigate("PrivacyPolicy") }>
                                    <Text style={ {
                                        color: '#fff', paddingTop: Utils.moderateScale(5),
                                        marginHorizontal: Utils.moderateScale(15)
                                    } }>Privacy Policy</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={ localStyle.innerContainer }>
                                <Text style={ { height: Utils.moderateVerticalScale(15) } }></Text>
                            </View>
                            <View style={ localStyle.innerContainer }>
                                <View style={ [localStyle.card4,
                                { flexDirection: 'row', justifyContent: 'space-between' }] }>
                                    <LinearGradient
                                        start={ { x: 0, y: 0 } }
                                        end={ { x: 1, y: 0 } }
                                        colors={ ['#70bf51', '#54c18d', '#3cc4f5'] }
                                        style={ localStyle.buttonContainer1 }>
                                        <TouchableOpacity
                                            onPress={ () => {
                                                this.ShowModalFunction(true)
                                            } }
                                            // onPress={ () => {
                                            //     this.logout();
                                            // } }
                                            style={ { width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center', height: '100%' } }>
                                            <Text style={ { fontFamily: 'Khand-Regular' } }>LOGOUT</Text>
                                        </TouchableOpacity>
                                        {/* onPress={ () => this.displayAlert() } */ }
                                    </LinearGradient>
                                </View>
                            </View>
                            <View style={ { flexDirection: 'row', padding: 10, justifyContent: 'flex-start', marginHorizontal: Utils.moderateScale(10) } }>
                                <Text style={ { color: '#4E4E4F', marginHorizontal: Utils.moderateScale(4) } }>Help@benefitapp.in</Text>
                                <Text style={ { color: '#4E4E4F', marginHorizontal: Utils.moderateScale(4) } }>|</Text>
                                <Text style={ { color: '#4E4E4F', marginHorizontal: Utils.moderateScale(4) } }>Sales@benefitapp.in</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    transparent={ true }
                    animationType={ "slide" }
                    visible={ this.state.ModalVisibleStatus }
                    onRequestClose={ () => { this.ShowModalFunction(!this.state.ModalVisibleStatus) } } >
                    <View style={ {
                        flex: 1, justifyContent: 'center',
                        alignItems: 'center', backgroundColor: '#25232354',
                    } }>
                        <View style={ localStyle.ModalInsideView }>
                            {/* <TouchableOpacity onPress={ () => { this.ShowModalFunction(false) } }>
                                <Text style={ localStyle.close }>
                                    X
                                </Text>
                            </TouchableOpacity> */}

                            <View style={ { width: "100%", height: Utils.moderateVerticalScale(200) } }>

                                <View style={ localStyle.innerContainer }>
                                    <LinearGradient
                                        start={ { x: 0, y: 0 } }
                                        end={ { x: 1, y: 0 } }
                                        colors={ ['#70bf51', '#54c18d', '#3cc4f5'] }
                                        style={ localStyle.buttonContainer2 }>
                                        <TouchableOpacity onPress={ () => {
                                            this.ShowModalFunction(true)
                                            // Utils.displayAlert("Alert", "Are you sure to Logout?", "Yes", () => {
                                            //     this.props.navigation.navigate('Login');
                                            // }, "No")

                                        } } style={ { width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center', height: '100%' } }>
                                        </TouchableOpacity>
                                        {/* onPress={ () => this.displayAlert() } */ }
                                    </LinearGradient>
                                    <Image source={ Images.alert }
                                        style={ {
                                            width: Utils.moderateVerticalScale(50),
                                            height: Utils.moderateVerticalScale(50),
                                            borderRadius: 40 / 2,
                                            alignItems: "center",
                                            justifyContent: 'center',
                                            alignContent: 'center',
                                            marginTop: Utils.moderateVerticalScale(-20),
                                            marginLeft: Utils.moderateScale(120)
                                        } }
                                    />
                                    <View
                                        style={ {
                                            flex: 1,
                                            flexDirection: "column",
                                            justifyContent: 'center',
                                            alignContent: 'center',

                                            marginLeft: Utils.moderateVerticalScale(130)
                                        } }
                                    >
                                        <Text style={ {
                                            fontSize: 15,
                                            color: "#000000", justifyContent: 'center',
                                            alignItems: 'center'
                                        } }>Alert</Text>

                                    </View>
                                    <View
                                        style={ {
                                            flex: 1,
                                            width: "100%",
                                            marginLeft: Utils.moderateVerticalScale(80)
                                        } }
                                    >
                                        <Text style={ {
                                            fontSize: 15,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        } }>  Are you sure to Logout?</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={ {
                                height: Utils.moderateVerticalScale(1.0),
                                backgroundColor: "#525252",
                            } } />
                            <View
                                style={ {
                                    flex: 1,
                                    flexDirection: "row",
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                } }
                            >
                                <TouchableOpacity onPress={ () => { this.ShowModalFunction(false) } }>
                                    <View
                                        style={ {
                                            paddingTop: Utils.moderateVerticalScale(30),
                                        } }
                                    >
                                        <Text style={ {

                                            fontSize: Utils.moderateVerticalScale(15),
                                            color: "#555555",
                                        } }>
                                            No
                                    </Text>
                                    </View>
                                </TouchableOpacity>
                                <View
                                    style={ {
                                        paddingLeft: Utils.moderateVerticalScale(70),
                                        borderRightWidth: 1,
                                        borderRightColor: "#555555",
                                    } }
                                >
                                </View>
                                <TouchableOpacity onPress={ () => { this.logout() } }>
                                    <View
                                        style={ {
                                            paddingLeft: Utils.moderateVerticalScale(60),
                                            paddingTop: Utils.moderateVerticalScale(30),

                                        } }
                                    >
                                        <Text style={ {
                                            fontSize: 15, color: "#555555",
                                        } }>
                                            Yes
                                    </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View >
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

    buttonContainer2: {
        marginTop: Utils.moderateVerticalScale(-10),
        height: Utils.moderateVerticalScale(60),
        borderRadius: Utils.moderateVerticalScale(2),
        borderTopLeftRadius: Utils.moderateVerticalScale(12),
        borderTopRightRadius: Utils.moderateVerticalScale(12),
    },
    ModalInsideView: {
        backgroundColor: "white",
        width: '80%',
        height: Utils.moderateVerticalScale(280),
        borderRadius: 20,

    },
    card4: {
        borderRadius: Utils.moderateScale(Platform.OS == "android" ? 10 : 8),
        marginLeft: Utils.moderateScale(15),
        width: "90%",
        height: 60,
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    innerContainerModal: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        width: "100%",
        height: "70%"
    },
    close: {
        alignItems: 'center',
        color: '#000',
        marginLeft: Utils.moderateVerticalScale(245),
        fontSize: 20,
        marginTop: Utils.moderateVerticalScale(5)

    },
    cardModal: {
        fontSize: Utils.moderateScale(14),
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        width: "100%",

    },
    card3: {
        paddingVertical: Utils.moderateVerticalScale(5),
        paddingHorizontal: Utils.moderateVerticalScale(3),
        margin: Utils.moderateScale(2),
        fontSize: Utils.moderateScale(14),
        justifyContent: "center",
        alignItems: "center",
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        paddingVertical: Utils.moderateVerticalScale(10)
    },

    card: {
        marginLeft: Utils.moderateScale(10),
        marginRight: Utils.moderateScale(10),
        marginBottom: Utils.moderateScale(0),
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
        marginVertical: Utils.moderateVerticalScale(25),
        height: Utils.moderateVerticalScale(50),
        width: "100%",
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
    return { userData: state.appData.userData };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsScreen);