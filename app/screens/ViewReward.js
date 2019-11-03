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

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            //  loading: true,
            //loadingWeb: true,
            UserBuyDataGet: [],
            UserBuyDataPost: [],
            DaysDiff: null,
        }
        this.referenceId = this.props.navigation.getParam("referenceId");
        this.imageName = props.navigation.getParam("image");
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
        const _this = this;
        this.state.UserBuyDataGet = [];
        const referenceId = props.navigation.getParam("referenceId");
        const imageName = props.navigation.getParam("image");
        this.setState({
            loading: true,
            //loadingWeb: true,
        }, () => {
            if (referenceId !== this.referenceId) {
                this.referenceId = referenceId;
                this.imageName = imageName;
                _this.getVoucherId();
            } else {
                _this._isMount = true;
                _this.setState({
                    loading: false,
                    //loadingWeb: false,
                });
            }
        });
    }

    getVoucherId() {
        const _this = this;
        _this.setState({
            //  loading: true,
            //   loadingWeb: true,
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
                    _this.setState({
                        UserBuyDataGet: response.body,
                        DaysDiff: dayDiff,
                        loading: false,
                        loadingWeb: false,
                    })
                    console.log(URL.ImageURLProduction + "data/vouchers/" + this.imageName)
                } else {
                    _this.setState({
                        UserBuyDataGet: [],
                        loading: false,
                        loadingWeb: false,
                    })
                }
            })
    }

    htmlRender(rawData) {
        let data = '<html> <head><meta name="viewport" content="width=device-width, initial-scale=1"> </head> <body>';
        data += rawData;
        data += '</body></html>'
        return data;
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

                    Utils.displayAlertRewards("",
                        " CONGRATULATIONS ! \n Your Rewards will be saved in My Rewards.", "View Rewards", () => {
                            this.props.navigation.navigate('MyRewards');
                        }, false, "", true, true, Images.RewardsPopUp);

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

    render() {
        if (this.state.loading) {
            return <Loader loading={this.state.loading} />;
        }
        var HTML = "";
        if (this.state.UserBuyDataGet.terms_and_conditions == undefined) {
            HTML = "<p style='color:white'>Terms Conditions</p>"
        }
        else {
            HTML = "<p style='color:white'>" + this.state.UserBuyDataGet.terms_and_conditions + "</p>"
        }

        return (
            <View style={[GlobalStyle.container]}>
                <Header
                    style={localStyle.aboutHeader}
                    androidStatusBarColor="#161616"
                    iosBarStyle="light-content"
                >
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} >
                            <FAIcon
                                name="arrow-left"
                                style={{
                                    color: "white",
                                    fontSize: Utils.moderateScale(15),
                                }}
                            />
                        </TouchableOpacity>
                    </Left>
                    <Body style={GlobalStyle.headerBody}>
                        <Text style={GlobalStyle.headerTitle}>T & C</Text>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <View style={{ flex: 1, backgroundColor: "#161616", }}>
                    <View style={[localStyle.card, { flexDirection: 'row', justifyContent: 'flex-start' }]}>
                        <View style={{ width: "100%", }}>
                            <View style={{
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                flex: 0,
                                flexDirection: 'row',
                                justifyContent: 'flex-start'

                            }}>
                                <Image
                                    source={{
                                        uri: URL.ImageURLProduction + "data/vouchers/" + this.imageName
                                    }}
                                    style={{
                                        width: Utils.moderateVerticalScale(50),
                                        height: Utils.moderateVerticalScale(50),
                                        borderRadius: Utils.moderateVerticalScale(50 / 2),
                                        marginLeft: Utils.moderateVerticalScale(20)
                                    }}
                                />
                                <View style={{
                                    marginLeft: Utils.moderateVerticalScale(18)
                                    , flexDirection: 'column'
                                }}>
                                    {/* <Text style={ {
                                        color: '#fff',
                                        fontSize: Utils.moderateVerticalScale(18)
                                    } }>₹ { this.state.UserBuyDataGet.amount } Welcome Gift Card </Text> */}
                                    <Text style={{
                                        color: '#fff',
                                        fontSize: Utils.moderateVerticalScale(15)
                                    }}> {this.state.UserBuyDataGet.name} </Text>

                                    <Text style={{
                                        color: '#fff',
                                        fontSize: Utils.moderateVerticalScale(12)
                                    }}>Expires in {this.state.DaysDiff} days </Text>
                                </View>
                            </View>

                            <View style={localStyle.line} />
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                width: "100%",
                                backgroundColor: '#161616'
                            }}>

                                <WebView
                                    style={{ flex: 1, backgroundColor: 'transparent', }}
                                    // style={{ backgroundColor: "#272727" }}
                                    scalesPageToFit={true}
                                    // source={{
                                    //     html: HTML
                                    // }}
                                    source={{ html: this.htmlRender(HTML) }}
                                    originWhitelist={['*']}
                                    onLoad={() => this.hideSpinner()}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                />
                            </View>
                            {this.state.loadingWeb && <LoaderInline loading={this.state.loadingWeb} />}
                            <View>
                                <TouchableOpacity onPress={() => this.BuyUser()}  >
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={['#70bf51', '#54c18d', '#3cc4f5']}
                                        style={localStyle.buttonContainer1}>
                                        <Text style={{ fontFamily: 'Khand-Regular', }}>BUY NOW</Text>
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
        borderBottomColor: "#161616",
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