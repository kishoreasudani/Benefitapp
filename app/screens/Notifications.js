import React, { Component } from 'react';
import { StyleSheet, Image, Animated, TouchableOpacity, RefreshControl, Text, View } from 'react-native';
import { FlatList, RectButton } from 'react-native-gesture-handler';
import AppleStyleSwipeableRow from './AppleStyleSwipeableRow';
import GmailStyleSwipeableRow from './GmailStyleSwipeableRow';
import { GlobalStyle } from "../assets/styles/GlobalStyle";
import { Body, Header, Left, Right } from "native-base";
import { connect } from "react-redux";
import { ActionCreators } from "../actions/index";
import { Images } from "../assets/Images/index";
import * as Utils from "../lib/utils";
import * as URL from "../config/urls";
import FAIcon from "react-native-vector-icons/FontAwesome";
import Swipeout from "react-native-swipeout";
import Icon from 'react-native-vector-icons/MaterialIcons';
const AnimatedIcon = Animated.createAnimatedComponent(Icon);
import ListEmptyComponent from "../components/ListEmptyComponent";
import Loader from "../components/Loader";

// const Row = ({ item }) => (
//     <View style={ [localStyle.card1] }>
//         <RectButton style={ styles.rectButton }>
//             <Text style={ styles.fromText }>{ item.id }</Text>
//             <Text numberOfLines={ 2 } style={ styles.messageText }>
//                 { item.message }
//             </Text>
//             <Text style={ styles.dateText }>
//                 { item.day_diff }
//             </Text>
//         </RectButton>
//     </View>
// );

// const SwipeableRow = ({ item, index }) => {
//     return (
//         // <GmailStyleSwipeableRow onPress={ "First" } return={ (value) => { alert(value) } }>

//             <Row item={ item } />
//         </GmailStyleSwipeableRow>
//     );

// if (index % 2 === 0) {
//     return (
//         <GmailStyleSwipeableRow>
//             <Row item={item} />
//         </GmailStyleSwipeableRow>
//     );
// } else {
//     return (
//         <GmailStyleSwipeableRow>
//             <Row item={item} />
//         </GmailStyleSwipeableRow>
//     );
// }//
//};

class NotificationsScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            NotificationData: [],
            transitionDelay: '1s',
            loading: true,
            page: 1,
            reset: false,
            search: "",
            refreshing: false,
            loadingMore: false,
        }
        this.NotificationRead = this.NotificationRead.bind(this);
        this.renderItemNotification = this.renderItemNotification.bind(this);
        this.toggleDelay = this.toggleDelay.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    componentDidMount() {
        this._isMount = true;
        this.UserNotificationData();
        this.toggleDelay(true)
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    toggleDelay(state) {
        this.setState({ style: { transitionDelay: state ? '2s' : '1s' } });
    }

    UserNotificationData() {
        const _this = this;
        this.state = {
            loading: true,
        }
        Utils.makeApiRequest(this.props.userData.id, URL.API_URL.getNotification.endPoint, {},
            { authorization: this.props.userData.token }, "GET", false, false)
            .then(async response => {
                if (response) {
                    const resultData = response.body ? response.body : [];
                    resultData.map(itemDate => {
                        var now_utc = new Date();
                        let date = new Date(itemDate.created);
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
                    _this.toggleDelay(false)
                    console.log(response.body)
                    this.setState({
                        NotificationData: response.body,
                        loading: false,
                        loadingMore: false,
                        refreshing: false
                    })
                } else {
                    this.setState({
                        NotificationData: [],
                        loading: false,
                        loadingMore: false,
                        refreshing: false
                    })
                }
            })
    }

    NotificationRead(id) {
        const _this = this;
        let data = {
            id: id,
            status: 'active',
            read_status: 'read',
            user_id: this.props.userData.id
        }
        Utils.makeApiRequest('', URL.API_URL.notification.endPoint,
            data, { authorization: this.props.userData.token }, "PUT")
            .then(async response => {
                if (response) {
                    this.UserNotificationData();
                    this.setState({
                        loading: false
                    })

                } else {
                    this.setState({
                        loading: false
                    })
                }
            })
    }
    handleRefresh() {
        this.setState(
            { refreshing: true, page: 1 },
            () => {
                setTimeout(() => this.UserNotificationData(), 500);
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
                _this.UserNotificationData();
            });
        }
    }
    renderItemNotification({ item, index }) {
        const swipeBtns = [
            {
                component: (
                    <View
                        style={ {
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            backgroundColor: '#373737',
                        } }
                    >
                        <AnimatedIcon
                            name="delete-forever" size={ 30 } color="red" />
                    </View>
                ),
                onPress: () => { this.NotificationRead(item.id) },
            },
        ];
        return (
            <View style={ [localStyle.card1] }>
                <Swipeout right={ swipeBtns } autoClose backgroundColor="transparent"  >
                    <View style={ styles.rectButton }>
                        {/* <Text style={ styles.fromText }></Text> */ }
                        <View style={ { paddingTop: 25 } }>
                            <Text numberOfLines={ 2 } style={ styles.messageText }>
                                { item.message }
                            </Text>
                            <Text style={ styles.dateText }>
                                { item.day_diff }
                            </Text>
                        </View>
                    </View>
                </Swipeout>
            </View>
        )
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
                        <TouchableOpacity onPress={ () => this.props.navigation.goBack() }>
                            <Image source={ Images.backArrow } style={ {
                                marginRight: Utils.moderateScale(15, 0.5),
                                width: Utils.moderateScale(18),
                                height: Utils.moderateScale(14)
                            } } resizeMode="contain" resizeMethod="resize" />
                        </TouchableOpacity>
                    </Left>
                    <Body style={ GlobalStyle.headerBody }>
                        <Text style={ GlobalStyle.headerTitle }>Notification</Text>
                    </Body>
                    <Right>

                    </Right>
                </Header>
                <View style={ localStyle.innerContainer }>
                    <View style={ [
                        { flexDirection: 'row', justifyContent: 'space-between' }] }></View>
                    <View style={ [localStyle.card] }>
                        {/* <FlatList
                            data={ this.state.NotificationData }
                            ItemSeparatorComponent={ () => <View style={ styles.separator } /> }
                            renderItem={ ({ item, index }) => (
                                <SwipeableRow item={ item } index={ index }
                                    onPress={ () => {
                                        this.NotificationRead(item.id);
                                    } }
                                />
                            ) }
                            keyExtractor={ (item, index) => `message ${index}` }
                        /> */}
                        <FlatList
                            data={ this.state.NotificationData }
                            ItemSeparatorComponent={ () => <View style={ styles.separator } /> }
                            renderItem={ this.renderItemNotification }
                            keyExtractor={ (item, index) => `message ${index}` }
                            ListEmptyComponent={
                                <ListEmptyComponent message="No Notification available." />
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
        marginLeft: Utils.moderateScale(10),
        marginTop: Utils.moderateScale(10),
        marginRight: Utils.moderateScale(10),
        marginBottom: Utils.moderateScale(0),
        paddingVertical: Utils.moderateVerticalScale(10),
        backgroundColor: 'transparent',
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignContent: 'center'
    },
    card1: {
        paddingVertical: Utils.moderateVerticalScale(10),
        //backgroundColor: '#272727',
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
const styles = StyleSheet.create({
    rectButton: {
        flex: 1,
        height: 80,
        paddingVertical: 10,
        width: "98%",
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        borderRadius: 10,
        flexDirection: 'column',
        backgroundColor: '#373737',
        //backgroundColor: 'rgb(200, 199, 204)',
    },
    actionIcon: {

        // backgroundColor: '#dd2c00',
    },
    separator: {
        // backgroundColor: 'rgb(200, 199, 204)',
        // /height: StyleSheet.hairlineWidth,
    },
    fromText: {
        color: '#999',
        backgroundColor: 'transparent',
    },
    messageText: {
        color: '#999',
        backgroundColor: 'transparent',
    },
    dateText: {
        backgroundColor: 'transparent',
        position: 'absolute',
        right: 20,
        top: 30,
        color: '#999',

    },
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