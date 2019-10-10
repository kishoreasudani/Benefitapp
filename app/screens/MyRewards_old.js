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
            DaysDiff: null,
            modalVisible: false,
            ModalVisibleStatus: false,
        }
        this.renderRewards = this.renderRewards.bind(this);
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
                        let date = new Date(itemDate.start_date);
                        let current_utc = new Date(
                            date.getUTCFullYear(),
                            date.getUTCMonth(),
                            date.getUTCDate(),
                            date.getUTCHours(),
                            date.getUTCMinutes(),
                            date.getUTCSeconds()
                        );
                        (diff1 = (now_utc.getTime() - current_utc.getTime()) / 1000),
                            (days = Math.floor(diff1 / 86400));
                        itemDate["day_diff"] =
                            (days < 0 ? 0 : days) + (days <= 1 ? " day ago" : " days ago");
                    });

                    this.setState({
                        voucherData: response.body,
                        loading: false
                    })

                } else {
                    this.setState({
                        voucherData: [],
                        loading: false
                    })
                }
            })
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
                                <View>
                                    <ImageBackground source={ Images.confetti } style={ {
                                        width: 65,
                                        height: 65,
                                        borderRadius: 65 / 2,
                                        alignItems: "center",
                                        marginTop: Utils.moderateScale(10),

                                    } }>
                                    </ImageBackground>
                                </View>
                                <Image
                                    source={ {
                                        uri: "http://13.233.145.33/data/vouchers/" + item.image
                                    } }
                                    style={ {
                                        width: 50,
                                        height: 50,
                                        borderRadius: 40 / 2,
                                        alignItems: "center",
                                        marginTop: -50,
                                        marginLeft: Utils.moderateScale(15, 0.5)
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
                                            height: 120,
                                            marginBottom: 25,
                                            marginLeft: 10,
                                            fontSize: 18,
                                            padding: 7
                                        } }
                                    >
                                        <Text style={ {
                                            fontSize: 17, color: "#fff",
                                            justifyContent: 'center', alignContent: 'center'
                                        } }>You won</Text>
                                        <Text style={ {
                                            fontSize: 17, color: "#fff",
                                            marginTop: Utils.moderateScale(-2)
                                        } }>₹ { item.amount }</Text>

                                        <Text style={ { fontSize: 11, color: "#555555", marginTop: Utils.moderateScale(-2) } }>
                                            { item.day_diff }
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
                                        <View style={ { marginLeft: Utils.moderateVerticalScale(50) } } >
                                            <View style={ {
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            } }>
                                                <ImageBackground source={ Images.confetti } style={ {
                                                    width: 80,
                                                    height: 80,
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
                                                    uri: "http://13.233.145.33/data/vouchers/" + this.globalData.image
                                                } }
                                                style={ {
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 40 / 2,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginTop: -50,
                                                    marginLeft: Utils.moderateScale(45, 0.5)
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
                                                        height: 120,
                                                        marginBottom: 25,
                                                        marginLeft: 10,
                                                        fontSize: 18,
                                                        padding: 15
                                                    } }
                                                >
                                                    <Text style={ {
                                                        fontSize: 15, color: "#000",
                                                        justifyContent: 'space-around'
                                                    } }>You won flat 10 % off</Text>
                                                    <Text style={ {
                                                        fontSize: 17, color: "green",
                                                        fontWeight: "600",
                                                        marginTop: Utils.moderateScale(-2)
                                                    } }>
                                                        ₹  { this.globalData.amount }</Text>

                                                    <Text style={ { fontSize: 15, color: "#555555", marginTop: Utils.moderateScale(-2) } }>
                                                        { this.globalData.day_diff }
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
                                marginLeft: Utils.moderateVerticalScale(25)
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
                                        height: 120,
                                        marginBottom: 25,
                                        marginLeft: 10,
                                        fontSize: 18,
                                        padding: 7
                                    } }
                                >
                                    <TouchableOpacity onPress={ () => {
                                        this.props.navigation.navigate("ViewReward", {
                                            referenceId: this.globalData.id
                                        });
                                        this.ShowModalFunction(false);
                                    } }>
                                        <Text style={ {
                                            fontSize: 15
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
        width: 170,
        height: 170,
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
        width: "100%",
        height: "70%"
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
        paddingVertical: Utils.moderateVerticalScale(5),
        paddingHorizontal: Utils.moderateVerticalScale(3),
        margin: Utils.moderateScale(2),
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
        width: "120%",
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