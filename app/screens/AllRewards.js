//import libraries
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Alert,
    Image,
    Platform,
    Text, RefreshControl,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    FlatList,
    TextInput,
    ScrollView,
    Modal
} from 'react-native';
import { SafeAreaView } from "react-navigation";
import { Body, Header, Left, Right } from "native-base";
import { connect } from "react-redux";
import { ActionCreators } from "../actions/index";
import { Images } from "../assets/Images/index";
import * as Utils from "../lib/utils";
import * as URL from "../config/urls";
import { GlobalStyle } from "../assets/styles/GlobalStyle";
import LinearGradient from 'react-native-linear-gradient';
import FAIcon from "react-native-vector-icons/FontAwesome";
import { Container, Content, Icon, Accordion } from "native-base";
import * as Buttons from "../components/Button";
import Loader from "../components/Loader";
import ListEmptyComponent from "../components/ListEmptyComponent";

//import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
// create a component
const dataArray = [
    { title: "Details", content: {} },

];
class AllRewardsScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            MyAllRewardData: [],
            voucherData: [],
            page: 1,
            reset: false,
            search: "",
            refreshing: false,
            loadingMore: false,
        }
        this.voucher = this.voucher.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.renderRewards = this.renderRewards.bind(this);
    }
    componentDidMount() {
        this._isMount = true;
        this.voucher();
        //this.GetAllRewards();
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    componentWillReceiveProps(props) {
        const _this = this;
        setInterval(() => {
            _this.voucher();
        }, 2000);
    }
    voucher() {
        this.state = {
            loading: true,
            loadingMore: false,
            refreshing: false
        }
        const _this = this;
        let data = {
            search_text: "",
            page_no: 0,
            page_size: 0,
            user_id: this.props.userData.id
        }
        Utils.makeApiRequest(URL.API_URL.getVoucherList.url, URL.API_URL.getVoucherList.endPoint, data, { authorization: this.props.userData.token })
            .then(async response => {
                if (response) {
                    const resultData = response.body ? response.body : [];
                    resultData.map(itemDate => {
                        var now_utc = new Date();
                        let date = new Date(itemDate.end_date);
                        let current_utc = new Date(
                            date.getUTCFullYear(),
                            date.getUTCMonth(),
                            date.getUTCDate(),
                            date.getUTCHours(),
                            date.getUTCMinutes(),
                            date.getUTCSeconds()
                        );
                        (diff1 = (current_utc.getTime() - now_utc.getTime()) / 1000),
                            (days = Math.floor(diff1 / 86400));
                        itemDate["day_diff1"] =
                            (days < 0 ? 0 : days) + (days <= 1 ? " day" : " days");
                    });

                    this.setState({
                        voucherData: resultData,
                        loading: false,
                        loadingMore: false,
                        refreshing: false

                    })
                    console.log('voucherData', this.state.voucherData)
                } else {
                    this.setState({
                        voucherData: [],
                        loading: false,
                        loadingMore: false,
                        refreshing: false
                    })
                }
            })
    }
    handleRefresh() {
        this.setState(
            { refreshing: true, page: 1 },
            () => {
                setTimeout(() => this.voucher(), 500);
            }
        );
    }

    handleLoadMore() {
        const _this = this;
        if (
            !this.state.loading &&
            !this.state.refreshing &&
            !this.state.loadingMore &&
            !this.state.noDataLeft
        ) {
            this.setState({ loadingMore: true }, () => {
                _this.voucher();
            });
        }
    }

    // GetAllRewards() {
    //     const _this = this;
    //     let data = {
    //         search_text: "",
    //         page_no: 0,
    //         page_size: 0,
    //         user_id: this.props.userData.id
    //     }
    //     Utils.makeApiRequest(URL.API_URL.getUserOrderList.url, URL.API_URL.getUserOrderList.endPoint, data, { authorization: this.props.userData.token })
    //         .then(async response => {
    //             if (response) {
    //                 this.setState({
    //                     MyAllRewardData: response.body,
    //                     loading: false
    //                 })
    //             } else {
    //                 this.setState({
    //                     MyAllRewardData: [],
    //                     loading: false
    //                 })
    //             }
    //         })
    // }

    renderRewards({ item, index }) {

        const _this = this;
        return (
            <View style={localStyle.innerContainer}>
                <ImageBackground source={{ uri: URL.ImageURLProduction + "data/vouchers/" + item.bg_image }}
                    style={localStyle.card}
                    imageStyle={{ borderRadius: Utils.moderateVerticalScale(15) }}>
                    <View
                        style={{
                            backgroundColor: "rgba(0,0,0,0.7)",
                            width: "100%",
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                            borderRadius: Utils.moderateVerticalScale(15),
                            paddingVertical: Utils.moderateVerticalScale(20),
                            //marginBottom: Utils.moderateVerticalScale(15)
                        }}
                    >
                        <Image source={{ uri: URL.ImageURLProduction + "data/vouchers/" + item.image }}
                            style={{
                                width: Utils.moderateVerticalScale(100),
                                height: Utils.moderateVerticalScale(100),
                                // borderRadius: Utils.moderateVerticalScale(5),
                                // resizeMode: "cover",
                                // alignItems: "center",
                                borderRadius: Utils.moderateVerticalScale(100 / 2),
                                borderColor: "#fff",
                                borderWidth: 1,
                                alignItems: "center",
                                resizeMode: "cover",
                                zIndex: 10,
                            }}
                        />
                        <Text style={{
                            marginTop: Utils.moderateVerticalScale(30), color: '#fff',
                            fontWeight: '200', fontSize: Utils.moderateVerticalScale(18)
                        }}> {item.name}   </Text>
                        <Text style={{
                            padding: 5, color: '#fff',
                            fontSize: Utils.moderateVerticalScale(13)
                        }}>Expires in {item.day_diff1}  </Text>
                        <Text style={{
                            paddingHorizontal: 17,
                            color: '#fff',
                            marginTop: 10,
                            marginLeft: 10,
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                            fontWeight: '200',
                            fontSize: Utils.moderateVerticalScale(15)
                        }}>
                            {item.descriptions} </Text>
                        <Image source={Images.benefitCoin}
                            style={{
                                width: Utils.moderateVerticalScale(40),
                                height: Utils.moderateVerticalScale(40),
                                borderRadius: Utils.moderateVerticalScale(5),
                                alignItems: "center",
                                resizeMode: "cover",
                                zIndex: 10,
                                marginTop: Utils.moderateVerticalScale(20)
                            }}
                        />
                        <Text style={{ padding: 5, color: '#fff', fontWeight: '400', fontSize: Utils.moderateVerticalScale(13) }}>
                            <Text style={{ fontWeight: '200', fontSize: Utils.moderateVerticalScale(15) }} >
                                Need {item.coins_required} </Text>coins to buy this reward</Text>

                        <View style={{ width: "50%" }}>
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate("ViewReward", {
                                    referenceId: item.id,
                                    image: item.image
                                });
                            }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#70bf51', '#54c18d', '#3cc4f5']}
                                    style={localStyle.buttonContainer1}>

                                    <Text style={{
                                        color: "#fff",
                                        fontSize: 15
                                    }}>
                                        Get This
                                        </Text>

                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>


            </View>
        );
    }

    render() {
        if (this.state.loading) {
            return <Loader loading={this.state.loading} />;
        }
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };
        return (
            <View style={[GlobalStyle.container, localStyle.container]}>
                <Header
                    style={GlobalStyle.header}
                    androidStatusBarColor="#161616"
                    iosBarStyle="light-content"
                >
                    <Left style={{ flex: 0 }}>
                        <Text style={GlobalStyle.headerTitle}>All Rewards</Text>
                        {/* <TouchableOpacity onPress={ () => this.props.navigation.goBack() }>
                            <Image source={ Images.backArrow } style={ {
                                marginRight: Utils.moderateScale(15, 0.5),
                                width: Utils.moderateScale(18),
                                height: Utils.moderateScale(14),

                            } } resizeMode="contain" resizeMethod="resize" />
                        </TouchableOpacity> */}
                    </Left>
                    <Body style={GlobalStyle.headerBody}>

                    </Body>
                    <Right style={{ flex: 1 }}>
                        {/* <TouchableOpacity onPress={ () => this.props.navigation.navigate("Notifications") }>
                            <FAIcon
                                name="bell"
                                style={ {
                                    color: "white",
                                    fontSize: Utils.moderateScale(15),
                                } }
                            />
                        </TouchableOpacity> */}
                        <Buttons.ShowNotification onPress={() => {
                            this.props.navigation.navigate("Notifications")
                        }} />
                    </Right>
                </Header>

                <FlatList
                    style={{
                        flex: 1,
                        marginTop: Utils.moderateVerticalScale(10),
                        marginBottom: Utils.scale(5)
                    }}
                    data={this.state.voucherData}
                    numColumns={1}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    // keyExtractor={ (item, index) => item.id.toString() }
                    renderItem={this.renderRewards}
                    ListEmptyComponent={
                        <ListEmptyComponent message="No Reward available." />
                    }
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0.2}
                    refreshControl={
                        <RefreshControl
                            colors={["red", "blue", "orange"]}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                        />
                    }
                />

                {/* <ScrollView
                    horizontal={ false }
                    style={ localStyle.innerContainer }>
                    <ImageBackground source={ Images.nykaaBg } style={ localStyle.card } imageStyle={ { borderRadius: Utils.moderateVerticalScale(8) } }>
                        <Image source={ Images.nykaaLogo }
                            style={ {
                                width: Utils.moderateVerticalScale(100),
                                height: Utils.moderateVerticalScale(100),
                                borderRadius: Utils.moderateVerticalScale(100 / 2),
                                alignItems: "center",
                                zIndex: 10,
                            } }
                        />
                        <Text style={ { marginTop: Utils.moderateVerticalScale(30), color: '#fff', fontWeight: '500', fontSize: Utils.moderateVerticalScale(18) } }>₹1500 Welcome gift card </Text>
                        <Text style={ { padding: 5, color: '#fff', fontWeight: '500', fontSize: Utils.moderateVerticalScale(13) } }>Expires in 15 days</Text>
                        <Text style={ { paddingHorizontal: 17, color: '#fff', fontWeight: '400', fontSize: Utils.moderateVerticalScale(12) } }>
                        </Text>
                        <Image source={ Images.benefitCoin }
                            style={ {
                                width: Utils.moderateVerticalScale(60),
                                height: Utils.moderateVerticalScale(60),
                                borderRadius: Utils.moderateVerticalScale(60 / 2),
                                alignItems: "center",
                                zIndex: 10,
                                marginTop: Utils.moderateVerticalScale(40)
                            } }
                        />
                        <Text style={ { padding: 5, color: '#fff', fontWeight: '400', fontSize: Utils.moderateVerticalScale(13) } }>Need <Text style={ { fontWeight: '200', fontSize: Utils.moderateVerticalScale(15) } } >3500</Text> coins to buy this reward</Text>

                        <TouchableOpacity
                            onPress={ () => this.props.navigation.navigate("ViewReward") }>
                            <Text style={ {
                                color: "#fff",
                                fontSize: 15
                            } }>
                                View Rewards
                        </Text>
                        </TouchableOpacity>
                    </ImageBackground>
                    <ImageBackground source={ Images.yatraBg } style={ localStyle.card } imageStyle={ { borderRadius: Utils.moderateVerticalScale(8) } }>
                        <Image source={ Images.yatraLogo }
                            style={ {
                                width: Utils.moderateVerticalScale(100),
                                height: Utils.moderateVerticalScale(100),
                                borderRadius: Utils.moderateVerticalScale(100 / 2),
                                alignItems: "center",
                                zIndex: 10,
                            } }
                        />
                        <Text style={ { marginTop: Utils.moderateVerticalScale(30), color: '#fff', fontWeight: '500', fontSize: Utils.moderateVerticalScale(18) } }>₹1500 Welcome gift card </Text>
                        <Text style={ { padding: 5, color: '#fff', fontWeight: '500', fontSize: Utils.moderateVerticalScale(13) } }>Expires in 15 days</Text>
                        <Text style={ { paddingHorizontal: 17, color: '#fff', fontWeight: '400', fontSize: Utils.moderateVerticalScale(12) } }>
                        </Text>
                        <Image source={ Images.benefitCoin }
                            style={ {
                                width: Utils.moderateVerticalScale(60),
                                height: Utils.moderateVerticalScale(60),
                                borderRadius: Utils.moderateVerticalScale(60 / 2),
                                alignItems: "center",
                                zIndex: 10,
                                marginTop: Utils.moderateVerticalScale(40)
                            } }
                        />
                        <Text style={ { padding: 5, color: '#fff', fontWeight: '400', fontSize: Utils.moderateVerticalScale(13) } }>Need <Text style={ { fontWeight: '200', fontSize: Utils.moderateVerticalScale(15) } } >3500</Text> coins to buy this reward</Text>
                    </ImageBackground>
                </ScrollView>
            </saf> */}
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
        flex: 0,
        borderRadius: Utils.moderateVerticalScale(15),
        paddingHorizontal: Utils.moderateScale(10),
        alignContent: 'center',
        width: '100%',
        paddingVertical: Utils.moderateVerticalScale(10)
    },
    card: {
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: Utils.moderateScale(15),
        // paddingVertical: Utils.moderateVerticalScale(20),
        //marginBottom: Utils.moderateVerticalScale(15)
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
        //marginVertical: Utils.moderateVerticalScale(30),
        height: Utils.moderateVerticalScale(30),
        //width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Utils.moderateVerticalScale(50),
        marginHorizontal: Utils.moderateScale(25),
        backgroundColor: '#fff',
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
    console.log(state.appData.userData);
    return { userData: state.appData.userData };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AllRewardsScreen);