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
    TextInput,
    Icon, Modal,
    FlatList
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
import ListEmptyComponent from "../components/ListEmptyComponent";
import Loader from "../components/Loader";
import FAIcon from "react-native-vector-icons/FontAwesome";
// create a component
class MyRewardsScreen extends Component {
    // imagePressed () {
    //     Alert.alert('You won flat 10% off')

    // }
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            voucherData: [],
            page: 1,
            reset: false,
            search: "",
            refreshing: false,
            loadingMore: false,
            DaysDiff: null,
            modalVisible: false,
            ModalVisibleStatus: false,
        }
        this.renderRewards = this.renderRewards.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.globalData = {}
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    componentDidMount() {
        this._isMount = true;
        this.voucher();
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    ShowModalFunction(visible) {
        this.setState({ ModalVisibleStatus: visible });
    }

    voucher() {
        const _this = this;
        this.state = {
            loading: true,
            loadingMore: false,
            refreshing: false
        }
        let data = {
            search_text: "",
            page_no: 0,
            page_size: 0,
            user_id: this.props.userData.id
        }
        Utils.makeApiRequest(URL.API_URL.getUserOrderList.url, URL.API_URL.getUserOrderList.endPoint,
            data, { authorization: this.props.userData.token })
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
                        itemDate["day_diff"] =
                            (days < 0 ? 0 : days) + (days <= 1 ? " day" : " days");
                    });

                    this.setState({
                        voucherData: response.body,
                        loading: false,
                        loadingMore: false,
                        refreshing: false
                    })

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

    renderRewards({ item, index }) {
        const _this = this;
        return (
            <View

                style={ {
                    width: "47%",
                    marginLeft: Utils.moderateScale(5),
                    marginRight: Utils.moderateScale(4),
                    marginBottom: Utils.moderateVerticalScale(5),
                    borderRadius: Utils.moderateScale(8)
                } }
            >
                <View style={ { width: "50%", height: Utils.moderateVerticalScale(170) } }>
                    <View style={ localStyle.innerContainer }>
                        <View style={ [GlobalStyle.card, localStyle.card3] }>

                            <TouchableOpacity onPress={ () => {
                                this.globalData = item;
                                this.ShowModalFunction(true)
                            } }>

                                <ImageBackground source={ Images.confetti } style={ {
                                    width: Utils.moderateScale(70),
                                    height: Utils.moderateVerticalScale(70),
                                    borderRadius: 65 / 2,
                                    alignItems: "center",
                                    marginTop: Utils.moderateScale(10),
                                    marginLeft: Utils.moderateScale(35)
                                    // paddingHorizontal: 45
                                } }>
                                </ImageBackground>

                                <Image
                                    source={ {
                                        uri: URL.ImageURLProduction + "data/vouchers/" + item.image
                                    } }
                                    style={ {
                                        width: Utils.moderateScale(50),
                                        height: Utils.moderateVerticalScale(50),
                                        borderRadius: 50 / 2,
                                        alignItems: "center",
                                        marginTop: -55,
                                        marginLeft: Utils.moderateScale(50)
                                    } }
                                />

                                <View
                                    style={ {
                                        flex: 1,
                                        flexDirection: "row",
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: "stretch",
                                    } }
                                >
                                    <View
                                        style={ {
                                            height: Utils.moderateVerticalScale(120),
                                            marginBottom: Utils.moderateVerticalScale(25),
                                            marginLeft: Utils.moderateScale(20),
                                            fontSize: 18,
                                            padding: Utils.moderateScale(7),
                                        } }
                                    >
                                        <Text style={ {
                                            fontSize: 11, color: "#fff",
                                            justifyContent: 'center', alignContent: 'center'
                                        } }>Coupon Code  { item.code }</Text>
                                        {/* { item.amount == null && item.amount == "" && item.amount == undefined
                                            ? (null)
                                            : (<Text style={ {
                                                fontSize: 15, color: "#fff", fontWeight: 'bold',
                                                marginLeft: Utils.moderateScale(15),
                                            } }>₹ { item.amount }</Text>)
                                        } */}
                                        <Text style={ {
                                            fontSize: 13, color: "#fff",
                                        } }>{ item.name }</Text>
                                        <Text style={ {
                                            fontSize: 11, color: "#555555",
                                        } }>
                                            Expire in { item.day_diff }
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        );
    }

    render() {
        if (this.state.loading) {
            return <Loader loading={ this.state.loading } />;
        }
        return (
            <View style={ [GlobalStyle.container, localStyle.container] }>
                <Header
                    style={ GlobalStyle.header }
                    androidStatusBarColor="#161616"
                    iosBarStyle="light-content"
                >
                    <Left style={ { flex: 1 } }>
                        <TouchableOpacity onPress={ () => this.props.navigation.navigate('MyCoins') }>
                            <Image source={ Images.backArrow } style={ {
                                marginRight: Utils.moderateScale(15, 0.5),
                                width: Utils.moderateScale(18),
                                height: Utils.moderateScale(14)
                            } } resizeMode="contain" resizeMethod="resize" />
                        </TouchableOpacity>
                    </Left>
                    <Body style={ GlobalStyle.headerBody }>
                        <Text style={ GlobalStyle.headerTitle }>MY REWARDS</Text>
                    </Body>
                    <Right>
                        <TouchableOpacity onPress={ () => this.props.navigation.navigate("Notifications") }>
                            <FAIcon
                                name="bell"
                                style={ {
                                    color: "white",
                                    fontSize: Utils.moderateScale(15),
                                } }
                            />
                        </TouchableOpacity>
                    </Right>
                </Header>

                <FlatList
                    style={ {
                        flex: 1,
                        marginBottom: Utils.scale(5)
                    } }
                    data={ this.state.voucherData }
                    numColumns={ 2 }
                    showsVerticalScrollIndicator={ false }
                    horizontal={ false }
                    keyExtractor={ (item, index) => item.id.toString() }
                    renderItem={ this.renderRewards }
                    ListEmptyComponent={
                        <ListEmptyComponent message="No Reward available." />
                    }
                    onEndReached={ this.handleLoadMore }
                    onEndReachedThreshold={ 0.2 }
                    refreshControl={
                        <RefreshControl
                            colors={ ["red", "blue", "orange"] }
                            refreshing={ this.state.refreshing }
                            onRefresh={ this.handleRefresh }
                        />
                    }
                />

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
                            <TouchableOpacity onPress={ () => { this.ShowModalFunction(false) } }>
                                <Text style={ localStyle.close }>
                                    X
                                </Text>
                            </TouchableOpacity>

                            <View style={ { width: "100%", height: Utils.moderateVerticalScale(170) } }>
                                <View style={ localStyle.innerContainerModal }>
                                    <View style={ [localStyle.card4, localStyle.cardModal] }>
                                        <View style={ { marginLeft: Utils.moderateVerticalScale(20) } } >
                                            <View style={ {
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            } }>
                                                <ImageBackground source={ Images.confetti } style={ {
                                                    width: Utils.moderateScale(80),
                                                    height: Utils.moderateVerticalScale(80),
                                                    borderRadius: 80 / 2,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginBottom: Utils.moderateScale(-15),
                                                    marginRight: Utils.moderateScale(40),
                                                } }>
                                                </ImageBackground>
                                            </View>
                                            <Image
                                                source={ {
                                                    uri: URL.ImageURLProduction + "data/vouchers/" + this.globalData.image
                                                } }
                                                style={ {
                                                    width: Utils.moderateScale(60),
                                                    height: Utils.moderateVerticalScale(60),
                                                    borderRadius: 45 / 2,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginTop: Utils.moderateScale(-50),
                                                    marginLeft: Utils.moderateScale(80)
                                                } }
                                            />

                                            <View
                                                style={ {
                                                    flex: 1,
                                                    flexDirection: "row",
                                                    justifyContent: 'center',
                                                    alignContent: 'center'
                                                } }
                                            >
                                                <View
                                                    style={ {
                                                        height: Utils.moderateVerticalScale(120),
                                                        marginBottom: Utils.moderateVerticalScale(25),
                                                        alignContent: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: 18,
                                                        padding: Utils.moderateScale(15)
                                                    } }
                                                >
                                                    <Text style={ {
                                                        fontSize: 15, color: "#000",
                                                        justifyContent: 'space-around'
                                                    } }>Coupon Code { " " }
                                                        <Text style={ { fontWeight: "bold" } }>
                                                            { this.globalData.code }</Text>
                                                    </Text>

                                                    {/* { this.globalData.amount == null && this.globalData.amount == "" && this.globalData.amount == undefined
                                                        ? (null)

                                                        : (<Text style={ {
                                                            fontSize: 17,
                                                            color: "green",
                                                            fontWeight: "600",
                                                            marginTop: Utils.moderateScale(-2),
                                                            marginLeft: Utils.moderateScale(18),
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        } }>
                                                            ₹ { this.globalData.amount }
                                                        </Text>
                                                        )
                                                    } */}
                                                    <Text style={ {
                                                        fontSize: 15,
                                                        color: "green",
                                                        marginTop: Utils.moderateScale(-2),
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    } }>
                                                        { this.globalData.name }
                                                    </Text>

                                                    <Text style={ {
                                                        fontSize: 15, color: "#555555",
                                                        marginTop: Utils.moderateScale(0),
                                                        marginLeft: Utils.moderateScale(0),
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    } }>
                                                        Expire in { this.globalData.day_diff }
                                                    </Text>

                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={ {
                                height: Utils.moderateVerticalScale(0.5),
                                width: '80%', backgroundColor: "#525252",
                                marginLeft: Utils.moderateVerticalScale(25),
                                marginTop: Utils.moderateScale(10),
                            } } />
                            <View
                                style={ {
                                    flex: 1,
                                    flexDirection: "row",
                                    justifyContent: 'center',
                                    alignContent: 'center'
                                } }
                            >
                                <View
                                    style={ {
                                        height: Utils.moderateVerticalScale(120),
                                        marginBottom: Utils.moderateVerticalScale(25),
                                        marginLeft: Utils.moderateScale(10),
                                        fontSize: 18,
                                        padding: Utils.moderateScale(7)
                                    } }
                                >
                                    <TouchableOpacity onPress={ () => {
                                        this.props.navigation.navigate("ViewReward", {
                                            referenceId: this.globalData.id
                                        });
                                        this.ShowModalFunction(false);
                                    } }>
                                        <Text style={ {
                                            fontSize: 13
                                        } }>
                                            You spent { this.globalData.coins_required } coins to receive this award
                                           </Text>

                                        <Text style={ {
                                            fontSize: 13,
                                            fontWeight: "bold",
                                            paddingHorizontal: 85
                                        } }>
                                            Details
                                           </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        width: Utils.moderateScale(170),
        height: Utils.moderateVerticalScale(170),
        padding: 0.5

    },
    ModalInsideView: {
        backgroundColor: "white",
        width: '80%',
        height: '45%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#000",

    },
    innerContainerModal: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        height: '75%',
    },
    close: {
        alignItems: 'center',
        color: '#000',
        marginLeft: Utils.moderateVerticalScale(270),
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
        // paddingVertical: Utils.moderateVerticalScale(5),
        //paddingHorizontal: Utils.moderateVerticalScale(3),
        // margin: Utils.moderateScale(2),
        backgroundColor: '#272727',
        fontSize: Utils.moderateScale(14),
        justifyContent: "center",
        alignItems: "center",
    },
    card4: {
        paddingVertical: Utils.moderateVerticalScale(5),
        paddingHorizontal: Utils.moderateVerticalScale(3),
        margin: Utils.moderateScale(2),
        fontSize: Utils.moderateScale(14),
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        margin: Utils.moderateScale(5),
        backgroundColor: '#272727',
        flex: 1,
        width: '120%',
        justifyContent: 'center',
        alignContent: 'center'
    },
    MainContainer: {
        flex: 1,
        paddingTop: Utils.moderateVerticalScale(120),
        alignItems: "center",
        marginTop: Utils.moderateVerticalScale(50),
        justifyContent: "center"
    },
    input: {
        marginTop: Utils.moderateVerticalScale(5),
        marginLeft: Utils.moderateScale(10),
        alignSelf: 'stretch',
        padding: Utils.moderateScale(3),
        margin: Utils.moderateScale(2)

    },
    formGroup: {
        flex: 1,
        flexDirection: "row"
    },
    textContainer: {
        alignItems: 'center',
        color: '#555555',
        marginTop: Utils.moderateVerticalScale(2),
        marginLeft: Utils.moderateScale(10),
        alignSelf: 'stretch',
        padding: Utils.moderateScale(3),
        margin: Utils.moderateScale(2)
    },
    formLabel: {
        alignItems: 'center',
        color: '#555555',
        marginTop: Utils.moderateVerticalScale(2),
        marginLeft: Utils.moderateScale(10),
        alignSelf: 'stretch',
        padding: Utils.moderateScale(3),
        margin: Utils.moderateScale(2)

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
)(MyRewardsScreen);    