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
    WebView, Linking,
    ScrollView,
    Modal
} from 'react-native';
import { Body, Header, Left, Right } from "native-base";
import { connect } from "react-redux";
import { ActionCreators } from "../actions/index";
import { Images } from "../assets/Images/index";
import * as Utils from "../lib/utils";
import * as URL from "../config/urls";
import { GlobalStyle } from "../assets/styles/GlobalStyle";
import LinearGradient from 'react-native-linear-gradient';
import FAIcon from "react-native-vector-icons/FontAwesome";
import Loader from "../components/Loader";
import LoaderInline from "../components/LoaderInline";
import { Container, Content, Icon, Accordion } from "native-base";
import moment from "moment";

class ViewRewardScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loading: true,
            loadingWeb: true,
            UserBuyDataGet: [],
            UserBuyDataPost: [],
            DaysDiff: null,
            loadingWeb: true,
        }
        this.referenceId = this.props.navigation.getParam("referenceId");
        this.getVoucherId = this.getVoucherId.bind(this);
        this.BuyUser = this.BuyUser.bind(this);
        this.hideSpinner = this.hideSpinner.bind(this);
    }

    componentDidMount() {
        this._isMount = true;
        this.getVoucherId();
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    componentWillReceiveProps(props) {
        console.log('chhitarkumawat')
        const _this = this;
        this.state.UserBuyDataGet = [];
        const referenceId = props.navigation.getParam("referenceId");
        this.setState({
            loading: true,
        }, () => {
            if (referenceId !== this.referenceId) {
                this.referenceId = referenceId;
                _this.getVoucherId();
            } else {
                _this._isMount = true;
                _this.setState({ loading: false });
            }
        });
    }

    getVoucherId() {
        const _this = this;
        this.setState({
            loading: true
        })
        Utils.makeApiRequest(this.referenceId, URL.API_URL.voucherID.endPoint, {},
            { authorization: this.props.userData.token }, "GET", false, false)
            .then(async response => {
                if (response) {
                    var date1 = new Date();
                    var date2 = new Date(
                        moment(response.body.end_date)
                    );
                    var baseMoment1 = moment(date2);
                    var baseMoment2 = moment(date1);
                    var result2 = baseMoment2.diff(baseMoment1, "days");
                    var dayDiff = Math.abs(result2)
                    this.setState({
                        UserBuyDataGet: response.body,
                        DaysDiff: dayDiff,
                        loading: false
                    })

                } else {
                    this.setState({
                        UserBuyDataGet: [],
                        loading: false
                    })
                }
            })
    }

    BuyUser() {
        const _this = this;
        // this.setState({
        //     loading: true
        // })
        let data = {
            reference_id: this.referenceId,
            user_id: this.props.userData.id
        }

        Utils.makeApiRequest(URL.API_URL.UserOrderBuy.url, URL.API_URL.UserOrderBuy.endPoint,
            data, { authorization: this.props.userData.token })
            .then(async response => {
                if (response) {
                    console.log('UserBuyDataPost', response)
                    // _this.getVoucherId();
                    _this.setState({
                        UserBuyDataPost: response.body,
                        //   loading: false,
                    })

                    // Utils.displayAlert("CONGRATULATIONS !", "Your Rewards Will Be Saved In My Rewards", "View Rewards", () => {
                    //     this.props.navigation.navigate('MyRewards');
                    // }, true, "", true, true, Images.L3);
                    this.props.navigation.navigate('MyRewards');
                    Utils.displayAlert("CONGRATULATIONS !", "Your Rewards will be saved in My Rewards.");
                } else {
                    // _this.getVoucherId();
                    _this.setState({
                        UserBuyDataPost: [],
                        // loading: false
                    })
                }
            })
    }
    hideSpinner() {
        this.setState({ loadingWeb: false });
    }
    onMessage(e) {
        // retrieve event data
        var data = e.nativeEvent.data;
        // maybe parse stringified JSON
        try {
            data = JSON.parse(data)
        } catch (e) { }
        // check if this message concerns us
        if ('object' == typeof data && data.external_url_open) {
            // proceed with URL open request
            return Alert.alert(
                'External URL',
                'Do you want to open this URL in your browser?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'OK', onPress: () => Linking.openURL(data.external_url_open) },
                ],
                { cancelable: false }
            );
        }
    }
    render() {
        if (this.state.loading) {
            return <Loader loading={ this.state.loading } />;
        }
        var HTML = "";
        if (this.state.UserBuyDataGet.terms_and_conditions == undefined) {
            HTML = "<p style='color:white'></p>"
        }
        else {
            HTML = "<p style='color:white'>" + this.state.UserBuyDataGet.terms_and_conditions + "</p>"
        }

        return (
            <View style={ [GlobalStyle.container] }>
                <Header
                    style={ localStyle.aboutHeader }
                    androidStatusBarColor="#161616"
                    iosBarStyle="light-content"
                >
                    <Left style={ { flex: 1 } }>
                        <TouchableOpacity onPress={ () => this.props.navigation.goBack() } >
                            <FAIcon
                                name="arrow-left"
                                style={ {
                                    color: "white",
                                    fontSize: Utils.moderateScale(15),
                                } }
                            />
                        </TouchableOpacity>
                    </Left>
                    <Body style={ GlobalStyle.headerBody }>
                        <Text style={ GlobalStyle.headerTitle }>T & C</Text>
                    </Body>
                    <Right style={ { flex: 1 } }>
                    </Right>
                </Header>
                <View style={ { flex: 1, backgroundColor: "#161616", } }>
                    <View style={ [localStyle.card, { flexDirection: 'row', justifyContent: 'flex-start' }] }>
                        <View style={ { width: "90%", } }>
                            <View style={ {
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                flex: 0,
                                flexDirection: 'row',
                                justifyContent: 'flex-start'

                            } }>
                                <Image
                                    source={ {
                                        uri: URL.ImageURLProduction + "data/vouchers/" +
                                            this.state.UserBuyDataGet.image
                                    } }
                                    style={ {
                                        width: Utils.moderateVerticalScale(50),
                                        height: Utils.moderateVerticalScale(50),
                                        borderRadius: 40 / 2,
                                        marginLeft: Utils.moderateVerticalScale(20)
                                    } }
                                />
                                <View style={ {
                                    marginLeft: Utils.moderateVerticalScale(18)
                                    , flexDirection: 'column'
                                } }>
                                    {/* <Text style={ {
                                        color: '#fff',
                                        fontSize: Utils.moderateVerticalScale(18)
                                    } }>₹ { this.state.UserBuyDataGet.amount } Welcome Gift Card </Text> */}
                                    <Text style={ {
                                        color: '#fff',
                                        fontSize: Utils.moderateVerticalScale(15)
                                    } }> { this.state.UserBuyDataGet.name } </Text>

                                    <Text style={ {
                                        color: '#fff',
                                        fontSize: Utils.moderateVerticalScale(12)
                                    } }>Expires in { this.state.DaysDiff } days </Text>
                                </View>
                            </View>

                            <View style={ localStyle.line } />
                            <View style={ {
                                flex: 1,
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                width: "100%"
                            } }>
                                <WebView
                                    style={ { backgroundColor: "#272727" } }
                                    scalesPageToFit={ true }
                                    source={ {
                                        html: HTML
                                    } }
                                    originWhitelist={ ['*'] }
                                    onLoad={ () => this.hideSpinner() }
                                    javaScriptEnabled={ true }
                                    domStorageEnabled={ true }
                                />
                            </View>
                            { this.state.loadingWeb && <LoaderInline loading={ this.state.loadingWeb } /> }
                            <View>
                                <TouchableOpacity onPress={ () => this.BuyUser() }  >
                                    <LinearGradient
                                        start={ { x: 0, y: 0 } }
                                        end={ { x: 1, y: 0 } }
                                        colors={ ['#70bf51', '#54c18d', '#3cc4f5'] }
                                        style={ localStyle.buttonContainer1 }>
                                        <Text style={ { fontFamily: 'Khand-Regular', } }>BUY NOW</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
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
    aboutHeader: {
        width: Utils.width,
        backgroundColor: "#161616",
        height: Utils.moderateVerticalScale(100),
        paddingTop: Utils.moderateVerticalScale(30),
        elevation: 0
    },
    line: {
        height: Utils.moderateVerticalScale(0.5),
        width: '100%',
        backgroundColor: "#525252",
        marginVertical: Utils.moderateVerticalScale(25),
        marginLeft: Utils.moderateVerticalScale(20),
    },
    imageAbout: {
        width: Utils.moderateVerticalScale(50),
        height: Utils.moderateVerticalScale(50),
    },
    imageView: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    FAIconStyle: {
        color: "white", fontSize: Utils.moderateScale(15)
    },
    innerContainer: {
        flex: 1,
        backgroundColor: "#161616",
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        //paddingVertical: Utils.moderateVerticalScale(10)
    },

    card: {
        margin: Utils.moderateScale(15),
        paddingVertical: Utils.moderateVerticalScale(10),
        backgroundColor: '#272727',
        borderRadius: Utils.moderateScale(10),
        flex: 1,
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
        width: "100%",
        marginLeft: Utils.moderateVerticalScale(15),
        height: Utils.moderateVerticalScale(40),
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
)(ViewRewardScreen);    