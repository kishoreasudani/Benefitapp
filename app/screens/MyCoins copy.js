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
    TextInput, FlatList
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
import { Container, Content, Icon, Accordion } from "native-base";
import * as Buttons from "../components/Button";
import Loader from "../components/Loader";
// create a component
const dataArray = [
    { title: "This Week", content: {} },

];
class MyCoinsScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            username: '',
            password: '',
            MyCoinData: [],
            MyCoinData1: [],
            status: true,
            weekHeight: 60,
        }
        this.renderSubCategory = this.renderSubCategory.bind(this);
        this.myCoin = this.myCoin.bind(this);
    }

    componentDidMount() {
        this._isMount = true;
        setInterval(() => {
            this.myCoin();
        }, 2000);
    }

    componentWillUnmount() {
        this._isMount = false;

    }
    componentWillReceiveProps(props) {
    }

    myCoin() {
        //console.log('token', this.props.userData.token)
        // this.state = {
        //     loading: true,
        // }
        let data = {
            page_no: 0,
            page_size: 0,
            user_id: this.props.userData.id
        }
        Utils.makeApiRequest(URL.API_URL.getCoinsList.url, URL.API_URL.getCoinsList.endPoint, data, { authorization: this.props.userData.token })
            .then(async response => {
                if (response) {

                    this.setState({
                        MyCoinData1: response.body.last7days,
                        MyCoinData: response.body,
                        loading: false
                    })
                } else {
                    this.setState({
                        MyCoinData: [],
                        MyCoinData1: [],
                        loading: false
                    })
                }
            })
    }
    renderSubCategory({ item, index }) {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{
                    color: "#4E4E4F",
                    // marginTop: Utils.moderateVerticalScale(0),
                    //marginLeft: Utils.moderateVerticalScale(15)
                }}>
                    {item.DateOnly}
                </Text><Text style={{
                    color: "#4E4E4F",
                    marginRight: Utils.moderateVerticalScale(10)
                }}>
                    {item.totalCoins}</Text>
            </View>
        );
    }
    ShowHideTextComponentView = () => {
        if (this.state.status == true) {
            this.setState({
                status: false,
                // weekHeight: Utils.moderateVerticalScale(180)
            })
        }
        else {
            this.setState({
                status: true,
                // weekHeight: Utils.moderateVerticalScale(60)
            })
        }
    }
    render() {
        if (this.state.loading) {
            return <Loader loading={this.state.loading} />;
        }
        return (
            <View style={[GlobalStyle.container, localStyle.container]}>
                <Header
                    style={GlobalStyle.header}
                    androidStatusBarColor="#161616"
                >
                    <Left style={{ flex: 0 }}>
                        <Text style={GlobalStyle.headerTitle}>MY COINS</Text>
                        {/* <TouchableOpacity onPress={ () => this.props.navigation.navigate('Home') }>
                            <Image source={ Images.backArrow } style={ {
                                marginRight: Utils.moderateScale(15, 0.5),
                                width: Utils.moderateScale(18),
                                height: Utils.moderateScale(14)
                            } } resizeMode="contain" resizeMethod="resize" />
                        </TouchableOpacity> */}
                    </Left>
                    <Body style={GlobalStyle.headerBody}>
                        {/* <Text style={ GlobalStyle.headerTitle }>MY COINS</Text> */}
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
                        <Buttons.ShowNotification onPress={() => {
                            this.props.navigation.navigate("Notifications")
                        }} />
                    </Right>
                </Header>
                <ScrollView>
                    <View style={localStyle.innerContainer}>
                        <View style={[GlobalStyle.card, localStyle.card,
                        { flexDirection: 'row', justifyContent: 'space-between', }]}>
                            <Text style={{
                                color: '#fff', fontWeight: '400',
                                fontSize: Utils.moderateVerticalScale(15),
                                marginLeft: Utils.moderateVerticalScale(15)
                            }}>  Today </Text>
                            <Text style={{
                                color: '#fff',
                                fontSize: Utils.moderateVerticalScale(18),
                                marginRight: Utils.moderateVerticalScale(15)
                            }}>
                                {this.state.MyCoinData.todayCoin != null && this.state.MyCoinData.todayCoin != "" ? (
                                    this.state.MyCoinData.todayCoin
                                ) : (0)}
                            </Text>
                        </View>

                        <View style={[localStyle.cardCoins,
                        {
                            paddingTop: Utils.moderateVerticalScale(15),
                            paddingBottom: Utils.moderateVerticalScale(15),
                            paddingLeft: Utils.moderateVerticalScale(15),
                            paddingRight: Utils.moderateVerticalScale(15),
                            // height: this.state.weekHeight
                        }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                <TouchableOpacity onPress={this.ShowHideTextComponentView} >
                                    <Text style={{
                                        color: '#fff',
                                        alignContent: "flex-start",
                                        fontSize: Utils.moderateVerticalScale(15),
                                        marginRight: Utils.moderateVerticalScale(200)
                                    }}> This Week  {" "}
                                        {
                                            this.state.status ?
                                                <Icon style={{
                                                    fontSize: Utils.moderateVerticalScale(12),
                                                    color: "#4E4E4F",
                                                }}
                                                    name="ios-arrow-down" />
                                                : <Icon style={{
                                                    fontSize: Utils.moderateVerticalScale(12),
                                                    color: "#4E4E4F",
                                                }}
                                                    name="ios-arrow-up" />
                                        }

                                    </Text>
                                </TouchableOpacity>
                                <Text style={{
                                    color: '#fff',
                                    alignContent: "flex-end",
                                    fontSize: Utils.moderateVerticalScale(18),
                                }}>  {this.state.MyCoinData.currentMonth} </Text>
                            </View>
                            {
                                this.state.status ?
                                    null
                                    :
                                    <View style={[localStyle.cardInner]} >

                                        <FlatList
                                            data={this.state.MyCoinData1}
                                            showsVerticalScrollIndicator={false}
                                            horizontal={false}
                                            //keyExtractor={ (item, index) => item.id.toString() }
                                            renderItem={this.renderSubCategory}
                                        />
                                    </View>
                            }
                        </View>

                        <View style={[GlobalStyle.card, localStyle.card, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text style={{
                                color: '#fff', fontWeight: '400', fontSize: Utils.moderateVerticalScale(15),
                                marginLeft: Utils.moderateVerticalScale(15)
                            }}>  This Month </Text>
                            <Text style={{
                                color: '#fff', fontSize: Utils.moderateVerticalScale(18),
                                marginRight: Utils.moderateVerticalScale(15)
                            }}>
                                {this.state.MyCoinData.currentMonth}
                            </Text>
                        </View>

                        <View style={[GlobalStyle.card, localStyle.card, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text style={{
                                color: '#fff', fontWeight: '400', fontSize: Utils.moderateVerticalScale(15),
                                marginLeft: Utils.moderateVerticalScale(15)
                            }}>  Total Spent </Text>
                            <Text style={{
                                color: '#fff', fontSize: Utils.moderateVerticalScale(18),
                                marginRight: Utils.moderateVerticalScale(15)
                            }}>
                                {this.state.MyCoinData.totalUsed}
                            </Text>
                        </View>

                        <View style={[GlobalStyle.card, localStyle.card,
                        { flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Image
                                source={Images.banefit}
                                style={{
                                    width: Utils.moderateVerticalScale(30),
                                    height: Utils.moderateVerticalScale(30),
                                    borderRadius: Utils.moderateVerticalScale(5),
                                    marginLeft: Utils.moderateVerticalScale(20),
                                }}
                            />
                            <Text style={{
                                color: '#fff',
                                fontWeight: '400',
                                fontSize: Utils.moderateVerticalScale(15),
                                marginRight: Utils.moderateVerticalScale(140),
                            }}>Total Coins </Text>
                            <Text style={{
                                color: '#fff',
                                fontSize: Utils.moderateVerticalScale(18),
                                marginRight: Utils.moderateVerticalScale(15)
                            }}>{this.state.MyCoinData.totalCoin} </Text>
                        </View>
                    </View>

                    {/* <View style={ { height: Utils.moderateVerticalScale(0.5), width: '100%', backgroundColor: "#525252", marginVertical: Utils.moderateVerticalScale(25) } } /> */}
                    <View style={localStyle.innerContainer}>
                        <View style={[localStyle.card4,
                        { flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#70bf51', '#54c18d', '#3cc4f5']}
                                style={localStyle.buttonContainer2}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("MyRewards")} style={{ width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <Text style={{ fontFamily: 'Khand-Regular' }}>MY REWARDS</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>
                    <View style={{ height: 32 }}></View>
                    {/* <LinearGradient
                        start={ { x: 0, y: 0 } }
                        end={ { x: 1, y: 0 } }
                        colors={ ['#70bf51', '#54c18d', '#3cc4f5'] }
                        style={ localStyle.buttonContainer1 }>
                        <TouchableOpacity onPress={ () => this.props.navigation.navigate("AllRewards") } style={ { width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center', height: '100%' } }>
                            <Text style={ { fontFamily: 'Khand-Regular' } }>ALL REWARDS</Text>
                        </TouchableOpacity>
                    </LinearGradient> */}
                </ScrollView>
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
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        width: '98%',
        paddingVertical: Utils.moderateVerticalScale(10)
    },
    card: {
        borderRadius: Utils.moderateScale(Platform.OS == "android" ? 10 : 8),
        marginLeft: Utils.moderateScale(15),
        height: Utils.moderateVerticalScale(60),
        backgroundColor: '#272727',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    cardCoins: {
        borderRadius: Utils.moderateScale(Platform.OS == "android" ? 10 : 8),
        marginLeft: Utils.moderateScale(15),
        //height: Utils.moderateVerticalScale(60),
        backgroundColor: '#272727',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    card4: {
        borderRadius: Utils.moderateScale(Platform.OS == "android" ? 10 : 8),
        marginLeft: Utils.moderateScale(15),
        height: Utils.moderateVerticalScale(60),
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    cardInner: {
        borderRadius: Utils.moderateScale(Platform.OS == "android" ? 10 : 8),
        marginLeft: Utils.moderateScale(15),
        backgroundColor: '#272727',
        flex: 1,
        // paddingTop: Utils.moderateVerticalScale(17),
        // marginTop: Utils.moderateVerticalScale(-2),
        marginBottom: Utils.moderateVerticalScale(3),
        //height: Utils.moderateVerticalScale(180),
        width: "95%",
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
    buttonContainer2: {
        height: Utils.moderateVerticalScale(50),
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Utils.moderateVerticalScale(35),
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
    console.log(state.appData.userData);
    return { userData: state.appData.userData };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyCoinsScreen);    