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

// create a component
const dataArray = [
    { title: "This Week", content: {} },

];
class MyCoinsScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            MyCoinData: [],
            status: true,
        }
    }

    componentDidMount() {
        this._isMount = true;
        this.myCoin();
    }

    componentWillUnmount() {
        this._isMount = false;
    }
    myCoin() {
        const _this = this;
        let data = {
            page_no: 0,
            page_size: 0,
            user_id: this.props.userData.id
        }
        Utils.makeApiRequest(URL.API_URL.getCoinsList.url, URL.API_URL.getCoinsList.endPoint, data, { authorization: this.props.userData.token })
            .then(async response => {
                if (response) {

                    this.setState({
                        MyCoinData: response.body,
                        loading: false
                    })
                } else {
                    this.setState({
                        MyCoinData: [],
                        loading: false
                    })
                }
            })
    }
    ShowHideTextComponentView = () => {
        if (this.state.status == true) {
            this.setState({
                status: false,
            })
        }
        else {
            this.setState({
                status: true
            })
        }
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
                        <TouchableOpacity onPress={ () => this.props.navigation.navigate('Home') }>
                            <Image source={ Images.backArrow } style={ {
                                marginRight: Utils.moderateScale(15, 0.5),
                                width: Utils.moderateScale(18),
                                height: Utils.moderateScale(14)
                            } } resizeMode="contain" resizeMethod="resize" />
                        </TouchableOpacity>
                    </Left>
                    <Body style={ GlobalStyle.headerBody }>
                        <Text style={ GlobalStyle.headerTitle }>MY COINS</Text>
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
                <ScrollView>
                    <View style={ localStyle.innerContainer }>
                        <View style={ [GlobalStyle.card, localStyle.card,
                        { flexDirection: 'row', justifyContent: 'space-between' }] }>
                            <Text style={ {
                                color: '#fff', fontWeight: '400',
                                fontSize: Utils.moderateVerticalScale(15)
                            } }>Today </Text>
                            <Text style={ {
                                color: '#fff',
                                fontSize: Utils.moderateVerticalScale(18)
                            } }>
                                { this.state.MyCoinData.todayCoin != null && this.state.MyCoinData.todayCoin != "" ? (
                                    this.state.MyCoinData.todayCoin
                                ) : (0) }
                            </Text>
                        </View>
                    </View>

                    <View style={ [GlobalStyle.card, localStyle.card,
                    { flexDirection: 'row', justifyContent: 'space-between' }] }>
                        <TouchableOpacity onPress={ this.ShowHideTextComponentView } >
                            <Text style={ {
                                color: '#fff', fontWeight: '400',
                                fontSize: Utils.moderateVerticalScale(15)
                            } }>This Week { " " }{ " " }{ " " }{ " " }
                                {
                                    this.state.status ?
                                        <Icon style={ { fontSize: 12, color: "#4E4E4F", } }
                                            name="ios-arrow-up" />
                                        : <Icon style={ { fontSize: 12, color: "#4E4E4F", } }
                                            name="ios-arrow-down" />
                                }

                            </Text>
                        </TouchableOpacity>
                        <Text style={ {
                            color: '#fff',
                            fontSize: Utils.moderateVerticalScale(18)
                        } }>  { this.state.MyCoinData.currentMonth } </Text>
                    </View>
                    {
                        this.state.status ?
                            null
                            :
                            <View style={ [localStyle.cardInner] } >

                                <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                                    <Text style={ { color: "#4E4E4F" } }>
                                        { this.state.MyCoinData.last7days[0].DateOnly }
                                    </Text><Text style={ { color: "#4E4E4F" } }>
                                        { this.state.MyCoinData.last7days[0].totalCoins }</Text></View>
                                <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                                    <Text style={ { color: "#4E4E4F" } }>
                                        { this.state.MyCoinData.last7days[1].DateOnly }
                                    </Text><Text style={ { color: "#4E4E4F" } }>
                                        { this.state.MyCoinData.last7days[1].totalCoins }</Text></View>
                                <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                                    <Text style={ { color: "#4E4E4F" } }>
                                        { this.state.MyCoinData.last7days[2].DateOnly }
                                    </Text><Text style={ { color: "#4E4E4F" } }>
                                        { this.state.MyCoinData.last7days[2].totalCoins }</Text></View>
                                <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                                    <Text style={ { color: "#4E4E4F" } }>
                                        { this.state.MyCoinData.last7days[3].DateOnly }
                                    </Text><Text style={ { color: "#4E4E4F" } }>
                                        { this.state.MyCoinData.last7days[3].totalCoins }</Text></View>
                                <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                                    <Text style={ { color: "#4E4E4F" } }>
                                        { this.state.MyCoinData.last7days[4].DateOnly }
                                    </Text><Text style={ { color: "#4E4E4F" } }>
                                        { this.state.MyCoinData.last7days[4].totalCoins } </Text></View>
                                <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                                    <Text style={ { color: "#4E4E4F" } }>

                                    </Text><Text style={ { color: "#4E4E4F" } }>

                                    </Text></View>
                                <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                                    <Text style={ { color: "#4E4E4F" } }>
                                        {/* { this.state.MyCoinData.last7days[6].DateOnly } */ }
                                    </Text><Text style={ { color: "#4E4E4F" } }>
                                        {/* { this.state.MyCoinData.last7days[6].totalCoins } */ }
                                    </Text></View>
                            </View>
                    }


                    <View style={ localStyle.innerContainer }>
                        <View style={ [GlobalStyle.card, localStyle.card, { flexDirection: 'row', justifyContent: 'space-between' }] }>
                            <Text style={ { color: '#fff', fontWeight: '400', fontSize: Utils.moderateVerticalScale(15) } }>This Month </Text>
                            <Text style={ { color: '#fff', fontSize: Utils.moderateVerticalScale(18) } }>
                                { this.state.MyCoinData.currentMonth }
                            </Text>

                        </View>
                    </View>

                    <View style={ localStyle.innerContainer }>
                        <View style={ [GlobalStyle.card, localStyle.card,
                        { flexDirection: 'row', justifyContent: 'space-between' }] }>
                            <Image
                                source={ Images.banefit }
                                style={ {
                                    width: 40,
                                    height: 35,
                                    borderRadius: 40 / 2,
                                    marginLeft: 20
                                } }
                            />
                            <Text style={ {
                                color: '#fff', fontWeight: '400',
                                fontSize: Utils.moderateVerticalScale(15)
                            } }>Total Coins </Text>
                            <Text style={ {
                                color: '#fff',
                                fontSize: Utils.moderateVerticalScale(18)
                            } }>{ this.state.MyCoinData.totalCoin } </Text>
                        </View>
                    </View>

                    {/* <View style={ { height: Utils.moderateVerticalScale(0.5), width: '100%', backgroundColor: "#525252", marginVertical: Utils.moderateVerticalScale(25) } } /> */ }
                    <View style={ localStyle.innerContainer }>
                        <View style={ [localStyle.card4,
                        { flexDirection: 'row', justifyContent: 'space-between' }] }>
                            <LinearGradient
                                start={ { x: 0, y: 0 } }
                                end={ { x: 1, y: 0 } }
                                colors={ ['#70bf51', '#54c18d', '#3cc4f5'] }
                                style={ localStyle.buttonContainer2 }>
                                <TouchableOpacity onPress={ () => this.props.navigation.navigate("MyRewards") } style={ { width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center', height: '100%' } }>
                                    <Text style={ { fontFamily: 'Khand-Regular' } }>VIEW REWARDS</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>
                    <View style={ { height: 32 } }></View>
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
        borderRadius: Utils.moderateScale(Platform.OS == "android" ? 10 : 8),
        marginLeft: Utils.moderateScale(15),
        height: 60,
        backgroundColor: '#272727',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    card4: {
        borderRadius: Utils.moderateScale(Platform.OS == "android" ? 10 : 8),
        marginLeft: Utils.moderateScale(15),
        height: 60,
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    cardInner: {
        borderRadius: Utils.moderateScale(Platform.OS == "android" ? 10 : 8),
        marginLeft: Utils.moderateScale(15),
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