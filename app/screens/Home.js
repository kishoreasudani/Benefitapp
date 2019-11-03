//import libraries
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Alert,
    Image,
    Text,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    TextInput,
    ScrollView, AsyncStorage

} from 'react-native';
import { connect } from "react-redux";
import { ActionCreators } from "../actions/index";
import * as Utils from "../lib/utils";
import LinearGradient from 'react-native-linear-gradient';
import { Avatar, Badge, withBadge } from "react-native-elements";
import { GlobalStyle } from "../assets/styles/GlobalStyle";
import { Images } from "../assets/Images/index";
import { Body, Header, Left, Right } from "native-base";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { hidden } from 'ansi-colors';
import * as URL from "../config/urls";
import Loader from "../components/Loader";
import * as Buttons from "../components/Button";
import AppleHealthKit from 'rn-apple-healthkit';
const HAS_LAUNCHED = 'hasLaunched';
// create a component
let options = {
    startDate: (new Date()).toISOString(),  // required
    endDate: (new Date()).toISOString()          // optional; default now
};

// get the available permissions from AppleHealthKit.Constants object
const PERMS = AppleHealthKit.Constants.Permissions;

// setup healthkit read/write permissions using PERMS
const healthKitOptions = {
    permissions: {
        read: [
            PERMS.StepCount,
            PERMS.DistanceWalkingRunning,
            PERMS.ActiveEnergyBurned,
        ],
        write: [
            PERMS.StepCount,
            PERMS.DistanceWalkingRunning,
            PERMS.ActiveEnergyBurned
        ],
    }
};


class HomeScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            txtUserName: "",
            avatar: "",
            username: '',
            password: '',
            stepsCount: 0,
            countNotification: 0,
            GoalSteps: 0,
            CalorieCount: 0,
            SetDistance: 0,
            finalTime: "0m",
            loading: true,
            refreshing: false,
            avgCoin: "",
            avgsteps: "",
        }
        this.healthGet = this.healthGet.bind(this);
        this.GetSetting = this.GetSetting.bind(this);
        this.GetProfile = this.GetProfile.bind(this);
        this.countNotification = this.countNotification.bind(this);
        this.GetTodayList = this.GetTodayList.bind(this);
        this.earnCoin = this.earnCoin.bind(this);
        this.GetDailyCount = this.GetDailyCount.bind(this);
        this.DailyDistanceSamples = this.DailyDistanceSamples.bind(this);
        // this.DailyCalorie = this.DailyCalorie.bind(this);
    }

    setAppLaunched(steps) {
        AsyncStorage.setItem('HAS_LAUNCHED', 'true');
        let DateTime = new Date();
        //  Alert.alert('DateTime', DateTime)
        AsyncStorage.setItem('InstallTime', DateTime.toString());
        steps = steps.toString();
        console.log('setAppLaunchedsteps', steps);
        AsyncStorage.setItem('stepsAtInstallTime', steps);
    }

    componentDidMount() {
        this._isMount = true;

        this.healthGet();
        this.GetSetting();
        this.GetTodayList();
        this.countNotification();
        this.GetProfile();

        setInterval(() => {
            this.earnCoin();
            this.healthGet();
            this.GetSetting();
            this.GetTodayList();
            this.countNotification();
        }, 6000);
    }

    componentWillReceiveProps(props) {
        const _this = this;
        _this.setState({
            // loading: true,
            // refreshing: true
        });
        setTimeout(() => {
            _this.healthGet();
            _this.GetProfile();
            _this.setState({
                //  loading: false,
                //   refreshing: false
            });
        }, 2000);
    }
    async GetDailyCount() {
        var firstDate = null;
        var start_date = new Date();
        var end_date = new Date();
        var dd = String(new Date().getDate()).padStart(2, '0');
        var mm = String(new Date().getMonth() + 1).padStart(2, '0');
        var yyyy = new Date().getFullYear();
        var start_new_date = yyyy + "-" + mm + "-" + dd + "T00:00:11.971Z";
        var dde = String(end_date.getDate()).padStart(2, '0');
        var mme = String(end_date.getMonth() + 1).padStart(2, '0');
        var hh = String(end_date.getHours()).padStart(2, '0');
        var min = String(end_date.getMinutes()).padStart(2, '0');
        var ss = String(end_date.getSeconds()).padStart(2, '0');
        var end_new_date = yyyy + "-" + mme + "-" + dde + "T" + hh + ":" + min + ":" + ss + ".971Z";
        //var start_new_date = new Date(start_new_date).toISOString();
        let todayDate = yyyy + "-" + mm + "-" + dd;
        const newOptions = {
            startDate: start_new_date,
            endDate: end_new_date
        };
        let hasLaunched = await AsyncStorage.getItem('HAS_LAUNCHED');
        let installTime = await AsyncStorage.getItem('InstallTime');
        let installSteps = await AsyncStorage.getItem('stepsAtInstallTime');
        if (installTime != null) {
            var firstTime = new Date(installTime);
            var dd = String(firstTime.getDate()).padStart(2, '0');
            var mm = String(firstTime.getMonth() + 1).padStart(2, '0');
            var yyyy = firstTime.getFullYear();
            firstDate = yyyy + "-" + mm + "-" + dd;
        }

        AppleHealthKit.getDailyStepCountSamples(newOptions, (err, steps) => {
            if (err) {
                console.log('errerrerrerr-', err)
                return;
            }
            console.log('steppeppeppe-', steps)

            // if (steps.length > 0) {
            //     var floosteps = Math.abs(steps[0].value)
            //     this.setState({
            //         stepsCount: Math.floor(floosteps)
            //     });
            // }
            if (steps.length > 0) {
                if (steps[0].value != null) {
                    let New_Steps = steps[0].value;
                    if (hasLaunched == null || hasLaunched == '') {
                        console.log("res[2].steps[0].value;", steps[0].value);
                        this.setAppLaunched(New_Steps);
                    }

                    // console.log('installTime ', installTime)
                    // console.log('installSteps ', installSteps)
                    // console.log('hasLaunched ', hasLaunched)

                    let finalStepCount = 0;
                    if (firstDate != null) {
                        if (firstDate == todayDate) {
                            finalStepCount = New_Steps - parseInt(installSteps);
                        } else {
                            finalStepCount = New_Steps;
                        }
                    }
                    console.log('New_Steps', New_Steps)
                    var floosteps = Math.abs(finalStepCount)
                    // if (finalStepCount > 0) {
                    //     this.setState({
                    //         stepsCount: 0
                    //     });
                    // }
                    // else {
                    console.log('New_Steps', floosteps)
                    this.setState({
                        stepsCount: Math.floor(floosteps)
                    });
                    //}

                }
            }

            var finalTimes = "0 m";
            let totalTime = 0;
            let totalMinutes = 0;
            let totalHours = 0;
            totalTime = this.state.stepsCount * 0.9;
            if (totalTime > 0) {
                totalMinutes = Math.floor((totalTime / 60));
                totalHours = Math.floor(totalMinutes / 60);
                if (totalMinutes > 0 && totalMinutes < 60) {
                    finalTimes = totalMinutes + " m";
                }

                if (totalMinutes > 60) {
                    let remMin = 0;
                    remMin = totalMinutes - (totalHours * 60);
                    finalTimes = totalHours + " h " + remMin + " m";
                }
            }
            var dailyCalories = this.state.stepsCount * 0.09;
            this.setState({
                CalorieCount: Math.round(dailyCalories),
                finalTime: finalTimes
            });
            // console.log('steppeppeppe-', steps)
            // steps.value is the step count for day 'd'
        });
    }

    DailyDistanceSamples() {
        var start_date = new Date();
        var end_date = new Date();
        var dd = String(new Date().getDate()).padStart(2, '0');
        var mm = String(new Date().getMonth() + 1).padStart(2, '0');
        var yyyy = new Date().getFullYear();
        var start_new_date = yyyy + "-" + mm + "-" + dd + "T00:00:11.971Z";
        var dde = String(end_date.getDate()).padStart(2, '0');
        var mme = String(end_date.getMonth() + 1).padStart(2, '0');
        var hh = String(end_date.getHours()).padStart(2, '0');
        var min = String(end_date.getMinutes()).padStart(2, '0');
        var ss = String(end_date.getSeconds()).padStart(2, '0');
        var end_new_date = yyyy + "-" + mme + "-" + dde + "T" + hh + ":" + min + ":" + ss + ".971Z";
        //var start_new_date = yyyy + "-" + mm + "-" + dd + " 00:00:11";
        //var start_new_date = new Date(start_new_date).toISOString();
        const DisNewOptions = {
            startDate: start_new_date,
            endDate: end_new_date
        };
        AppleHealthKit.getDistanceWalkingRunning(DisNewOptions, (err, distance) => {
            if (err) {
                console.log('distance-', err)
                return;
            }
            console.log('distance-', distance)
            var distanceFlor = Math.abs(distance.value)
            //if (distance.length > 0) {
            this.setState({
                SetDistance: Math.floor(distanceFlor)
            });
            // }

            // console.log('steppeppeppe-', steps)
            // steps.value is the step count for day 'd'
        });
    }

    healthGet() {
        AppleHealthKit.isAvailable((err, available) => {
            if (available) {
                // ...
                // console.log('available') 
                AppleHealthKit.initHealthKit(healthKitOptions, (err, res) => {
                    if (err) {
                        console.log("error initializing healthkit: ", err);
                        return;
                    }
                    //  console.log('resssss-', res) 
                    this.GetDailyCount();
                    this.DailyDistanceSamples();

                    AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
                        if (err) {
                            return;
                        }
                        console.log('results', results)
                    });
                    // healthkit is initialized...
                    // now safe to read and write healthkit data...
                });

            } else {
                console.log('not available')
            }
        });
    }
    componentWillUnmount() {
        this._isMount = false;
    }

    earnCoin() {
        const _this = this;
        let data = {
            user_id: this.props.userData.id,
            steps: this.state.stepsCount
        }
        //console.log('authorization:', this.props.userData.token)
        if (this.state.stepsCount != 0) {
            Utils.makeApiRequest(URL.API_URL.earnCoin.url, URL.API_URL.earnCoin.endPoint, data,
                { authorization: this.props.userData.token }, "POST", false, true)
                .then(async response => {
                    if (response) {
                        console.log('earnCoin', response)
                        _this.setState({
                            loading: false
                        })
                    } else {
                        _this.setState({
                            loading: false
                        })
                    }
                })
        }
        else {
            _this.setState({
                loading: false
            })
        }
    }
    GetProfile() {
        this.setState({
            txtUserName: "",
            avatar: "",
            loading: true,
            refreshing: false
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
                            this.setState({
                                txtUserName: resultData.first_name + " " + resultData.last_name,
                                avatar: resultData.avatar,
                                loading: false,
                                refreshing: false
                            });
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


    GetSetting() {
        const _this = this;
        Utils.makeApiRequest(URL.API_URL.getSetting.url, URL.API_URL.getSetting.endPoint, {},
            { authorization: this.props.userData.token }, "GET", false, false)
            .then(async response => {
                if (response) {
                    this.setState({
                        GoalSteps: response.body[0].goal,
                        //  loading: false
                    })
                } else {
                    this.setState({
                        GoalSteps: response.body[0].goal,
                        // loading: false
                    })
                }
            })
    }

    GetTodayList() {
        const _this = this;
        var num = 0;
        var num1 = 0;
        Utils.makeApiRequest(URL.API_URL.getTodayList.url, URL.API_URL.getTodayList.endPoint,
            { user_id: this.props.userData.id },
            { authorization: this.props.userData.token })
            .then(async response => {

                if (response) {
                    console.log('GetTodayList', response)
                    num = parseFloat(response.body.avgCoin);
                    num1 = parseFloat(response.body.avgsteps);
                    num = num.toFixed(0);
                    num1 = num1.toFixed(0);
                    _this.setState({
                        avgCoin: num,
                        avgsteps: num1,
                        //  loading: false
                    })
                } else {
                    _this.setState({
                        avgCoin: num,
                        avgsteps: num1,
                        // loading: false
                    })
                }
            })
    }
    countNotification() {
        const _this = this;
        let data = { user_id: this.props.userData.id }
        Utils.makeApiRequest(URL.API_URL.countNotification.url, URL.API_URL.countNotification.endPoint, data,
            { authorization: this.props.userData.token }, "POST", false, true)
            .then(async response => {
                if (response) {
                    this.setState({
                        countNotification: response.recordCount.totalCount,
                        // loading: false
                    })
                } else {
                    this.setState({
                        countNotification: response.recordCount.totalCount,
                        //  loading: false
                    })
                }
                global.notiCount = this.state.countNotification
            })
    }
    render() {
        //require("../assets/Images/img/user-icon.png")
        const avatar = this.state.avatar != null && this.state.avatar != "" ?
            { uri: URL.ImageURLProduction + "data/user/" + this.props.userData.id + "/" + this.state.avatar } : require("../assets/Images/img/userinfo1.jpg")
        const LiquidLevel = 87 - ((this.state.stepsCount / this.state.GoalSteps) * 100);
        //console.log(LiquidLevel)
        return (
            <View style={[GlobalStyle.container, localStyle.container]}>
                <Header
                    style={GlobalStyle.header}
                    androidStatusBarColor="#161616"
                    iosBarStyle="light-content"
                >
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("Profile")}>

                            <Image
                                source={avatar}
                                style={{
                                    width: Utils.moderateVerticalScale(30),
                                    height: Utils.moderateVerticalScale(30),
                                    borderRadius: Utils.moderateVerticalScale(30 / 2),
                                    // borderColor: "#fff",
                                    //borderWidth: 1,
                                    alignItems: "center",
                                    resizeMode: "cover",
                                    zIndex: 0,
                                }}
                            />


                        </TouchableOpacity>
                    </Left>
                    <Body style={GlobalStyle.headerBody}>
                        <Text style={GlobalStyle.headerTitle}>
                            {(this.state.txtUserName)}
                        </Text>
                    </Body>
                    <Right style={{ flex: 1 }}>
                        <Buttons.ShowNotification onPress={() => {
                            this.props.navigation.navigate("Notifications")
                        }} />
                        {/* <TouchableOpacity onPress={ () => this.props.navigation.navigate("Notifications") }>
                            <Text style={ {
                                color: "white",
                                fontSize: Utils.moderateScale(18),
                            } }>
                                .
                            </Text>
                            <FAIcon
                                name="bell"
                                style={ {
                                    color: "white",
                                    fontSize: Utils.moderateScale(15),
                                } }
                            />
                        </TouchableOpacity> */}
                    </Right>
                </Header>

                <ScrollView style={localStyle.MainContainer} >
                    <View style={{
                        flexDirection: "row", marginTop: Utils.moderateScale(10),
                        justifyContent: 'center'
                    }} >
                        <TouchableOpacity>
                            <Text style={[GlobalStyle.text, GlobalStyle.textHeading, {
                                color: "#3CB371",
                                marginHorizontal: Utils.moderateScale(10)
                            }]}> Today </Text>
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <Text style={[GlobalStyle.text, GlobalStyle.textHeading, {
                                color: "#555555",
                                marginHorizontal: Utils.moderateScale(10)
                            }]}> Week </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("MonthGraph")}>
                            <Text style={[GlobalStyle.text, GlobalStyle.textHeading, { color: "#555555", marginHorizontal: Utils.moderateScale(10) }]}> Month </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        //overflow: "hidden",
                    }}>
                        <View style={{
                            width: Utils.moderateVerticalScale(200),
                            height: Utils.moderateVerticalScale(200),
                            borderRadius: Utils.moderateVerticalScale(200 / 2),
                            borderWidth: 0,
                            borderColor: "#fff",
                            backgroundColor: "#222",
                            marginVertical: "10%",
                            overflow: "hidden",
                        }}>
                            <Text style={{
                                fontSize: Utils.moderateVerticalScale(12),
                                textAlign: "center",
                                paddingTop: Utils.moderateVerticalScale(20),
                                color: "white",
                                position: "relative",
                                zIndex: 1
                            }}>
                                Goal:{"\n"}
                                {this.state.GoalSteps}
                                {" "} Steps
                        </Text>
                            <Text style={{
                                fontSize: Utils.moderateVerticalScale(42),
                                textAlign: "center",
                                paddingTop: Utils.moderateVerticalScale(20),
                                fontFamily: "Khand-Bold",
                                color: "white",
                                position: "relative",
                                zIndex: 1
                            }}>
                                {this.state.stepsCount}
                            </Text>
                            <Text style={{
                                fontSize: Utils.moderateVerticalScale(15),
                                textAlign: "center",
                                paddingTop: Utils.moderateVerticalScale(20),
                                color: "white",
                                position: "relative",
                                zIndex: 1
                            }}>
                                Steps
                        </Text>
                            <View style={{
                                position: "absolute",
                                top: LiquidLevel + "%",
                                width: "100%",
                                //width: Utils.moderateVerticalScale(200),
                                height: Utils.moderateVerticalScale(200),
                                zIndex: 0
                            }}>
                                <Image style={{ width: "100%" }} source={Images.WavePedometerV2} />
                            </View>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        height: "22%",
                    }}>

                        <View style={localStyle.innerContainer}>
                            <View style={[GlobalStyle.card, localStyle.card]}>

                                <Image source={Images.distance}
                                    style={{
                                        width: Utils.moderateVerticalScale(40),
                                        height: Utils.moderateVerticalScale(40),
                                        borderRadius: Utils.moderateVerticalScale(20),
                                        alignItems: "center",
                                    }}
                                />

                                <View
                                    style={{
                                        width: "100%",
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        fontSize: Utils.moderateVerticalScale(18),
                                        //padding: Utils.moderateVerticalScale(7),
                                    }}
                                >
                                    <Text style={{ fontSize: Utils.moderateVerticalScale(15), color: "#fff", }}>
                                        {this.state.SetDistance} m
                                    </Text>
                                    <Text style={{ fontSize: 10, color: "#fff", }}>Distance</Text>
                                </View>
                            </View>
                        </View>

                        <View style={localStyle.innerContainer}>
                            <View style={[GlobalStyle.card, localStyle.card]}>

                                <Image source={Images.calories}
                                    style={{
                                        width: Utils.moderateVerticalScale(40),
                                        height: Utils.moderateVerticalScale(40),
                                        borderRadius: Utils.moderateVerticalScale(20),
                                        alignItems: "center",
                                    }}
                                />

                                <View
                                    style={{
                                        width: "100%",
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        fontSize: Utils.moderateVerticalScale(18),
                                        //padding: Utils.moderateVerticalScale(7),
                                    }}
                                >
                                    <Text style={{ fontSize: Utils.moderateVerticalScale(15), color: "#fff", }}>
                                        {this.state.CalorieCount}
                                    </Text>
                                    <Text style={{ fontSize: 10, color: "#fff", }}>Calories</Text>
                                </View>
                            </View>
                        </View>
                        <View style={localStyle.innerContainer}>
                            <View style={[GlobalStyle.card, localStyle.card]}>

                                <Image source={Images.time}
                                    style={{
                                        width: Utils.moderateVerticalScale(40),
                                        height: Utils.moderateVerticalScale(40),
                                        borderRadius: Utils.moderateVerticalScale(20),
                                        alignItems: "center",
                                    }}
                                />

                                <View
                                    style={{
                                        width: "100%",
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        fontSize: Utils.moderateVerticalScale(18),
                                        //padding: Utils.moderateVerticalScale(7),
                                    }}
                                >
                                    <Text style={{ fontSize: 15, color: "#fff", }}> {this.state.finalTime} </Text>
                                    <Text style={{ fontSize: 10, color: "#fff", }}> Time</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={localStyle.innerContainer2}>
                            <View style={[GlobalStyle.card, localStyle.cardAvg]}>

                                <Image source={Images.average_steps}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 40 / 2,
                                        alignItems: "center",
                                    }}
                                />

                                <View
                                    style={{
                                        width: "100%",
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        fontSize: 18,
                                        // padding: 7
                                    }}
                                >

                                    <Text style={{
                                        fontSize: 15, color: "#fff", justifyContent: 'center',
                                        alignContent: 'center', fontWeight: '200'
                                    }}>Average Steps</Text>
                                    <Text style={{ fontSize: 10, color: "#fff", marginTop: Utils.moderateScale(-2) }}>
                                        {this.state.avgsteps} /per day
                                         </Text>
                                    {/* <Text style={ { fontSize: 10, color: "#555555", marginTop: Utils.moderateScale(-2) } }>/per day</Text> */}
                                </View>

                            </View>
                        </View>
                        <View style={localStyle.innerContainer2}>
                            <View style={[GlobalStyle.card, localStyle.cardAvg]}>


                                <Image source={Images.average_coins}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 40 / 2,
                                        alignItems: "center",
                                    }}
                                />

                                <View
                                    style={{
                                        width: "100%",
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        fontSize: 18,
                                        //padding: 7
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 15, color: "#fff", justifyContent: 'center', alignContent: 'center',
                                    }}>Average Coins</Text>
                                    <Text style={{ fontSize: 10, color: "#fff", marginTop: Utils.moderateScale(-2) }}>
                                        {this.state.avgCoin} / per day
                                    </Text>
                                    {/* <Text style={ { fontSize: 10, color: "#555555", marginTop: Utils.moderateScale(-2) } }>/per day</Text> */}
                                </View>
                            </View>
                        </View>

                    </View>
                    <View style={{ height: 30 }}></View>
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const localStyle = StyleSheet.create({
    MainContainer: {
        //  backgroundColor: 'transparent',
        flex: 1,
        paddingVertical: Utils.moderateVerticalScale(20),
        alignContent: 'center',
    },
    container: {
        backgroundColor: '#161616',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },

    input: {
        marginTop: Utils.moderateVerticalScale(5),
        marginLeft: Utils.moderateScale(10),
        alignSelf: 'stretch',
        padding: Utils.moderateScale(3),
        margin: Utils.moderateScale(2),
    },
    buttonContainer2: {
        height: Utils.moderateVerticalScale(50),
        width: "85%",
        marginLeft: Utils.moderateVerticalScale(25),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Utils.moderateVerticalScale(50),
    },
    input1: {
        marginTop: Utils.moderateVerticalScale(5),
        // marginLeft: Utils.moderateScale(0),
        // alignSelf: 'stretch', 
        padding: Utils.moderateScale(5),
        borderBottomColor: '#555555',
        margin: Utils.moderateScale(5),
        // marginRight:  Utils.moderateScale(0),
        borderBottomColor: '#555555',
        borderBottomWidth: Utils.moderateScale(2),
    },
    TextStyle2: {
        alignItems: 'center',
        color: '#555555',
        marginTop: Utils.moderateVerticalScale(2),
        marginLeft: Utils.moderateScale(10),
        alignSelf: 'stretch',
        padding: Utils.moderateScale(3),
        margin: Utils.moderateScale(2),

    },
    buttonContainer1: {
        marginVertical: Utils.moderateVerticalScale(30),
        height: Utils.moderateVerticalScale(60),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Utils.moderateVerticalScale(50),
    },
    // innerContainer: {
    //     flex: 1,
    //     justifyContent: 'space-around',
    //     alignContent: 'center',
    //     width: 150,
    //     height: 150,
    //     padding: Utils.moderateScale(0.5),

    // },
    // innerContainer2: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignContent: 'center',
    //     width: 150,
    //     height: 120,
    //     padding: Utils.moderateScale(0.5),

    // },
    // card: {
    //     margin: Utils.moderateScale(5),
    //     backgroundColor: '#272727',
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignContent: 'center',

    // },
    innerContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignContent: 'center',
        width: Utils.moderateVerticalScale(150),
        height: Utils.moderateVerticalScale(150),
        padding: Utils.moderateScale(0.5),

    },
    innerContainer2: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        width: Utils.moderateVerticalScale(150),
        height: Utils.moderateVerticalScale(120),
        padding: Utils.moderateScale(0.5),

    },
    card: {
        width: '95%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#272727',
        marginLeft: Utils.moderateVerticalScale(4),
        paddingVertical: Utils.moderateVerticalScale(15),
        marginBottom: Utils.moderateVerticalScale(0)
    },
    cardAvg: {
        width: '95%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#272727',
        marginLeft: Utils.moderateVerticalScale(5),
        paddingVertical: Utils.moderateVerticalScale(15),
        marginBottom: Utils.moderateVerticalScale(0)
    },
});

const mapStateToProps = state => {
    return { userData: state.appData.userData };
};

const mapDispatchToProps = dispatch => {
    return {
        setLoggedInUserData: data => dispatch(ActionCreators.setLoggedInUserData(data))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeScreen);     