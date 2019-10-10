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
import GoogleFit, { Scopes } from 'react-native-google-fit';
import Loader from "../components/Loader";
import * as Buttons from "../components/Button";
import BackgroundTask from 'react-native-background-task';

const HAS_LAUNCHED = 'hasLaunched';
const options = {
    scopes: [
        Scopes.FITNESS_ACTIVITY_READ_WRITE,
        Scopes.FITNESS_BODY_READ_WRITE,
        Scopes.FITNESS_LOCATION_READ,
        Scopes.FITNESS_LOCATION_READ_WRITE,
    ],
}
const DailySteps = {
    startDate: new Date(),
    endDate: new Date().toISOString()
};
const optDistance = {
    startDate: new Date(),
    endDate: new Date().toISOString(),
};
const optCalorie = {
    startDate: new Date(),
    endDate: new Date().toISOString(),
    basalCalculation: true,
};

let OptActivity = {
    startDate: new Date(),
    endDate: new Date().toISOString(),
};
BackgroundTask.define(async () => {
    // Fetch some data over the network which we want the user to have an up-to-
    // date copy of, even if they have no network when using the app
    console.log('Hello from a background task')

    // Remember to call finish()
    //BackgroundTask.finish()
})
// create a component
class HomeScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor (props) {
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
        this.GetDailyCount = this.GetDailyCount.bind(this);
        this.DailyDistanceSamples = this.DailyDistanceSamples.bind(this);
        this.DailyCalorie = this.DailyCalorie.bind(this);
        this.earnCoin = this.earnCoin.bind(this);
        this.GetSetting = this.GetSetting.bind(this);
        this.countNotification = this.countNotification.bind(this);
        this.ActivitySamples = this.ActivitySamples.bind(this);
        this.GetProfile = this.GetProfile.bind(this);
        this.GetTodayList = this.GetTodayList.bind(this);
    }

    setAppLaunched() {
        AsyncStorage.setItem(HAS_LAUNCHED, 'true');
        let DateTime = new Date();
        let stepsCount = (this.state.stepsCount).toString();
        //  Alert.alert('DateTime', DateTime)
        AsyncStorage.setItem('InstallTime', DateTime);
        AsyncStorage.setItem('stepsAtInstallTime', stepsCount);
    }

    async componentDidMount() {
        this._isMount = true;
        BackgroundTask.schedule({
            period: 900,
            timeout: 30,
            // Aim to run every 30 mins - more conservative on battery
            // Aim to run every 30 mins - more conservative on battery
        })

        // Optional: Check if the device is blocking background tasks or not
        this.checkStatus()
        //this.setState({
        //loading: true,
        //refreshing: true
        //  });

        // setTimeout(() => {
        //  this.GetProfile();
        // this.setState({
        //  loading: false,
        //  refreshing: false
        //  });
        // }, 2000);
        GoogleFit.authorize(options)
            .then(authResult => {
                if (authResult.success) {

                    GoogleFit.startRecording((callback) => {
                        //console.log("callback", callback);
                        this.GetSetting();
                        this.GetTodayList();
                        this.GetProfile();
                        //this.ActivitySamples();
                        this.countNotification();
                        this.GetDailyCount(false);
                        this.DailyDistanceSamples();
                        this.DailyCalorie();
                        // this.earnCoin();
                    });

                    GoogleFit.observeSteps((callback) => {
                        //console.log("observeSteps", callback); 
                        this.GetDailyCount(false);
                        this.DailyDistanceSamples();
                        this.DailyCalorie();
                        //this.earnCoin();
                    })
                    setInterval(() => {
                        this.GetDailyCount(false);
                        this.DailyDistanceSamples();
                        this.DailyCalorie();
                        //this.ActivitySamples();
                        this.earnCoin();
                        this.GetTodayList();
                    }, 6000);

                    //dispatch("AUTH_SUCCESS"); 
                } else {
                    //dispatch("AUTH_DENIED", authResult.message);
                }
            })
            .catch(() => {
                //   dispatch("AUTH_ERROR");
            })
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    componentWillReceiveProps(props) {
        const _this = this;
        _this.setState({
            // loading: true,
            // refreshing: true
        });
        setTimeout(() => {
            _this.GetProfile();
            _this.setState({
                //  loading: false,
                //   refreshing: false
            });
        }, 2000);
    }

    async checkStatus() {
        const status = await BackgroundTask.statusAsync()

        if (status.available) {
            // Everything's fine
            console.log('Hello from a background')
            // Alert.alert('All ok', 'Background App Refresh')
            return
        }

        const reason = status.unavailableReason
        if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
            Alert.alert('Denied', 'Please enable background "Background App Refresh" for this app')
        } else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
            Alert.alert('Restricted', 'Background tasks are restricted on your device')
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
        Utils.makeApiRequest(URL.API_URL.getTodayList.url, URL.API_URL.getTodayList.endPoint, { user_id: this.props.userData.id },
            { authorization: this.props.userData.token })
            .then(async response => {

                if (response) {
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

    async GetDailyCount(ret) {
        var firstDate = null;
        var start_date = DailySteps.startDate;
        var dd = String(start_date.getDate()).padStart(2, '0');
        var mm = String(start_date.getMonth() + 1).padStart(2, '0');
        var yyyy = start_date.getFullYear();
        var start_new_date = yyyy + "-" + mm + "-" + dd + "T00:00:17.971Z";
        let todayDate = yyyy + "-" + mm + "-" + dd;
        const newOptions = {
            startDate: start_new_date,
            endDate: new Date().toISOString()
        };

        let installTime = await AsyncStorage.getItem('InstallTime');
        let installSteps = await AsyncStorage.getItem('stepsAtInstallTime');
        if (installTime != null) {
            var firstTime = new Date(installTime);
            var dd = String(firstTime.getDate()).padStart(2, '0');
            var mm = String(firstTime.getMonth() + 1).padStart(2, '0');
            var yyyy = firstTime.getFullYear();
            var firstDate = yyyy + "-" + mm + "-" + dd;
        }

        GoogleFit.getDailyStepCountSamples(newOptions)
            .then((res) => {
                if (res == '' && res == null) {
                    Alert.alert('result null')
                }
                else {
                    console.log('newOptions', newOptions)
                    console.log('Daily steps >>> ', res)
                    var finalStepCount = 0;
                    if (firstDate != null) {
                        if (firstDate == todayDate) {
                            var finalStepCount = res[2].steps[0].value - installSteps;
                        } else {
                            var finalStepCount = res[2].steps[0].value;
                        }
                    }
                    this.setState({
                        stepsCount: finalStepCount,
                    });
                    const hasLaunched = AsyncStorage.getItem(HAS_LAUNCHED);
                    // console.log('hasLaunched', hasLaunched)
                    if (hasLaunched == null || hasLaunched == '') {
                        // AsyncStorage.setItem('stepsAtInstallTime', res[2].steps[0].value);
                        this.setAppLaunched();
                    }
                }
            })
            .catch((err) => { console.warn(err) })
        if (ret) {
            return this.state.stepsCount;
        }
    }

    DailyDistanceSamples() {
        var start_date = optDistance.startDate;
        var dd = String(start_date.getDate()).padStart(2, '0');
        var mm = String(start_date.getMonth() + 1).padStart(2, '0');
        var yyyy = start_date.getFullYear();
        var start_new_date = yyyy + "-" + mm + "-" + dd + "T00:00:17.971Z";
        const DisNewOptions = {
            startDate: start_new_date,
            endDate: new Date().toISOString()
        };

        GoogleFit.getDailyDistanceSamples(DisNewOptions, (err, res) => {
            console.log('DailyDistanceSamples', res);
            var SetDistance = "";
            if (res == false) {
                SetDistance = 0;
            }
            else {
                if (res[0].distance != undefined && res[0].distance != null && res[0].distance != '') {
                    SetDistance = Math.round(res[0].distance)
                }
                else {
                    SetDistance = 0;
                }
            }
            this.setState({
                SetDistance: Math.abs(SetDistance),
            });
        });
    }

    DailyCalorie() {
        var start_date = optCalorie.startDate;
        var dd = String(start_date.getDate()).padStart(2, '0');
        var mm = String(start_date.getMonth() + 1).padStart(2, '0');
        var yyyy = start_date.getFullYear();
        var start_new_date = yyyy + "-" + mm + "-" + dd + "T00:00:17.971Z";
        const CalNewOptions = {
            startDate: start_new_date,
            endDate: new Date().toISOString(),
            basalCalculation: true,
        };
        GoogleFit.getDailyCalorieSamples(CalNewOptions, (err, res) => {
            console.log('DailyCalorie check', res);
            var CalCount = "";
            if (res == false) {
                CalCount = 0;
            }
            else {
                if (res[0].calorie != undefined && res[0].calorie != null && res[0].calorie != '') {
                    //if (res[0].calorie >= 0) {
                    CalCount = Math.round(res[0].calorie)
                    // }
                    // else {
                    //    CalCount = 0
                    // }
                }
                else {
                    CalCount = 0;
                }
            }
            this.setState({
                CalorieCount: Math.abs(CalCount),
            });
        });
    }
    ActivitySamples() {
        var start_date = OptActivity.startDate;
        var dd = String(start_date.getDate()).padStart(2, '0');
        var mm = String(start_date.getMonth() + 1).padStart(1, '0');
        var yyyy = start_date.getFullYear();
        var start_new_date = yyyy + "," + mm + "," + dd;
        var startDate = new Date(start_new_date);
        var startTimestamp = startDate.valueOf();
        var endDate = new Date();
        var endTimestamp = endDate.valueOf();
        if (startTimestamp != 0 && startTimestamp != "" && startTimestamp != null &&
            endTimestamp != 0 && endTimestamp != "" && endTimestamp != null) {
            const ActivityNewOptions = {
                startDate: startTimestamp,
                endDate: endTimestamp
            };
            GoogleFit.getActivitySamples(ActivityNewOptions, (err, res) => {
                //console.log('getActivitySamples', res);
                let finalTimes = "0m";
                let totalTime = 0;
                let totalMinutes = 0;
                let totalHours = 0;
                if (res == false) {
                    finalTimes = "0m";
                }
                else {
                    if (res.length > 0) {
                        res.map(item => {
                            if (item.quantity != undefined && item.quantity != "" && item.quantity != null && item.quantity != 0
                                && item.activityName != undefined && item.activityName != "still" && item.activityName != "unknown" && item.activityName != ""
                                && item.start != undefined && item.start != null && item.start != 0
                                && item.end != undefined && item.end != null && item.end != 0) {
                                var startDate = item.start;
                                var EndDate = item.end;
                                var totalMin = EndDate - startDate;
                                totalTime = totalTime + totalMin;
                                // console.log('totalMin', totalMin)
                            }
                        })
                        totalMinutes = Math.floor(((totalTime / 1000) / 60));
                        totalHours = Math.floor(totalMinutes / 60);
                        if (totalMinutes > 0 && totalMinutes < 60) {
                            finalTimes = totalMinutes + "m";
                        }

                        if (totalMinutes > 60) {
                            let remMin = 0;
                            remMin = totalMinutes - (totalHours * 60);
                            finalTimes = totalHours + "h " + remMin + "m";
                        }
                    }
                }
                this.setState({
                    finalTime: finalTimes
                })

                //  if (res[0].quantity == "" && res[0].quantity == null)

            });
        }
    }

    earnCoin() {
        const _this = this;

        let data = {
            user_id: this.props.userData.id,
            steps: this.state.stepsCount
        }

        if (this.state.stepsCount != 0) {
            Utils.makeApiRequest(URL.API_URL.earnCoin.url, URL.API_URL.earnCoin.endPoint, data,
                { authorization: this.props.userData.token }, "POST", false, true)
                .then(async response => {
                    if (response) {
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

    render() {

        if (this.state.loading) {
            return <Loader loading={ this.state.loading } />;
        }
        //require("../assets/Images/img/user-icon.png")
        const avatar = this.state.avatar != null && this.state.avatar != "" ?
            { uri: URL.ImageURLProduction + "data/user/" + this.props.userData.id + "/" + this.state.avatar } : require("../assets/Images/img/user-icon.png")
        const LiquidLevel = 100 - ((this.state.stepsCount / this.state.GoalSteps) * 100);
        //console.log(LiquidLevel)
        return (
            <View style={ [GlobalStyle.container, localStyle.container] }>
                <Header
                    style={ GlobalStyle.header }
                    androidStatusBarColor="#161616"
                    iosBarStyle="light-content"
                >
                    <Left style={ { flex: 1 } }>
                        <TouchableOpacity
                            onPress={ () => this.props.navigation.navigate("Profile") }>
                            <Image
                                source={ avatar }
                                style={ {
                                    width: Utils.moderateVerticalScale(30),
                                    height: Utils.moderateVerticalScale(30),
                                    borderRadius: Utils.moderateVerticalScale(80 / 2),
                                    alignItems: "center",
                                    resizeMode: "cover",
                                    zIndex: 10,
                                } }
                            />
                        </TouchableOpacity>
                    </Left>
                    <Body style={ GlobalStyle.headerBody }>
                        <Text style={ GlobalStyle.headerTitle }>
                            { (this.state.txtUserName) }
                        </Text>
                    </Body>
                    <Right style={ { flex: 1 } }>
                        <Buttons.ShowNotification onPress={ () => {
                            this.props.navigation.navigate("Notifications")
                        } } />
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

                <ScrollView style={ localStyle.MainContainer } >
                    <View style={ { flexDirection: "row", marginTop: Utils.moderateScale(10), justifyContent: 'center' } } >
                        <TouchableOpacity>
                            <Text style={ [GlobalStyle.text, GlobalStyle.textHeading, { color: "#3CB371", marginHorizontal: Utils.moderateScale(10) }] }> Today </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => this.props.navigation.navigate("WeekGraph") }>
                            <Text style={ [GlobalStyle.text, GlobalStyle.textHeading, { color: "#555555", marginHorizontal: Utils.moderateScale(10) }] }> Week </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => this.props.navigation.navigate("MonthGraph") }>
                            <Text style={ [GlobalStyle.text, GlobalStyle.textHeading, { color: "#555555", marginHorizontal: Utils.moderateScale(10) }] }> Month </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={ {
                        flexDirection: 'row',
                        justifyContent: 'center',
                        //overflow: "hidden",
                    } }>
                        <View style={ {
                            width: Utils.moderateVerticalScale(200),
                            height: Utils.moderateVerticalScale(200),
                            borderRadius: Utils.moderateVerticalScale(200 / 2),
                            borderWidth: 0,
                            borderColor: "#fff",
                            backgroundColor: "#222",
                            marginVertical: Utils.moderateVerticalScale(40),
                            overflow: "hidden",
                        } }>
                            <Text style={ {
                                fontSize: 12,
                                textAlign: "center",
                                paddingTop: 20,
                                color: "white",
                                position: "relative",
                                zIndex: 1
                            } }>
                                Goal:{ "\n" }
                                { this.state.GoalSteps }
                                { " " } Steps
                        </Text>
                            <Text style={ {
                                fontSize: 42,
                                textAlign: "center",
                                paddingTop: 20,
                                fontFamily: "Khand-Bold",
                                color: "white",
                                position: "relative",
                                zIndex: 1
                            } }>
                                { this.state.stepsCount }
                            </Text>
                            <Text style={ {
                                fontSize: 15,
                                textAlign: "center",
                                paddingTop: 20,
                                color: "white",
                                position: "relative",
                                zIndex: 1
                            } }>
                                Steps
                        </Text>
                            <View style={ {
                                position: "absolute",
                                top: LiquidLevel + "%",
                                width: Utils.moderateVerticalScale(200),
                                height: Utils.moderateVerticalScale(200),
                                zIndex: 0
                            } }>
                                <Image source={ Images.WavePedometerV2 } />
                            </View>
                        </View>
                    </View>
                    <View style={ {
                        flexDirection: 'row',
                    } }>
                        <View style={ localStyle.innerContainer }>
                            <View style={ [GlobalStyle.card, localStyle.card] }>
                                <TouchableOpacity>
                                    <Image source={ Images.distance }
                                        style={ {
                                            width: Utils.moderateVerticalScale(40),
                                            height: Utils.moderateVerticalScale(40),
                                            borderRadius: Utils.moderateVerticalScale(20),
                                            alignItems: "center",
                                        } }
                                    />
                                </TouchableOpacity>
                                <View
                                    style={ {
                                        width: "100%",
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        fontSize: 18,
                                        padding: 7
                                    } }
                                >
                                    <Text style={ { fontSize: 15, color: "#fff", } }>
                                        { this.state.SetDistance } m</Text>
                                    <Text style={ { fontSize: 10, color: "#fff", } }>Distance</Text>
                                </View>
                            </View>
                        </View>

                        <View style={ localStyle.innerContainer }>
                            <View style={ [GlobalStyle.card, localStyle.card] }>
                                <TouchableOpacity>

                                    <Image source={ Images.calories }
                                        style={ {
                                            width: Utils.moderateVerticalScale(40),
                                            height: Utils.moderateVerticalScale(40),
                                            borderRadius: Utils.moderateVerticalScale(20),
                                            alignItems: "center",
                                        } }
                                    />
                                </TouchableOpacity>
                                <View
                                    style={ {
                                        width: "100%",
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        fontSize: 18,
                                        padding: 7
                                    } }
                                >
                                    <Text style={ { fontSize: 15, color: "#fff", } }>
                                        { this.state.CalorieCount }
                                    </Text>
                                    <Text style={ { fontSize: 10, color: "#fff", } }>Calories</Text>
                                </View>
                            </View>
                        </View>
                        <View style={ localStyle.innerContainer }>
                            <View style={ [GlobalStyle.card, localStyle.card] }>
                                <TouchableOpacity>

                                    <Image source={ Images.time }
                                        style={ {
                                            width: Utils.moderateVerticalScale(40),
                                            height: Utils.moderateVerticalScale(40),
                                            borderRadius: Utils.moderateVerticalScale(20),
                                            alignItems: "center",
                                        } }
                                    />
                                </TouchableOpacity>
                                <View
                                    style={ {
                                        width: "100%",
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        fontSize: 18,
                                        padding: 7
                                    } }
                                >
                                    <Text style={ { fontSize: 15, color: "#fff", } }> { this.state.finalTime } </Text>
                                    <Text style={ { fontSize: 10, color: "#fff", } }>Time</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={ { flexDirection: 'row', } }>
                        <View style={ localStyle.innerContainer2 }>
                            <View style={ [GlobalStyle.card, localStyle.card] }>
                                <TouchableOpacity>
                                    <Image source={ Images.average_steps }
                                        style={ {
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40 / 2,
                                            alignItems: "center",
                                        } }
                                    />
                                </TouchableOpacity>
                                <View
                                    style={ {
                                        width: "100%",
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        fontSize: 18,
                                        padding: 7
                                    } }
                                >

                                    <Text style={ {
                                        fontSize: 15, color: "#fff", justifyContent: 'center',
                                        alignContent: 'center', fontWeight: '200'
                                    } }>Average Steps</Text>
                                    <Text style={ { fontSize: 10, color: "#fff", marginTop: Utils.moderateScale(-2) } }>
                                        { this.state.avgsteps } /per day
                                         </Text>
                                    {/* <Text style={ { fontSize: 10, color: "#555555", marginTop: Utils.moderateScale(-2) } }>/per day</Text> */ }
                                </View>

                            </View>
                        </View>
                        <View style={ localStyle.innerContainer2 }>
                            <View style={ [GlobalStyle.card, localStyle.card] }>
                                <TouchableOpacity>

                                    <Image source={ Images.average_coins }
                                        style={ {
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40 / 2,
                                            alignItems: "center",
                                        } }
                                    />
                                </TouchableOpacity>
                                <View
                                    style={ {
                                        width: "100%",
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        fontSize: 18,
                                        padding: 7
                                    } }
                                >
                                    <Text style={ {
                                        fontSize: 15, color: "#fff", justifyContent: 'center', alignContent: 'center',
                                    } }>Average Coins</Text>
                                    <Text style={ { fontSize: 10, color: "#fff", marginTop: Utils.moderateScale(-2) } }>
                                        { this.state.avgCoin }  / per day
                                    </Text>
                                    {/* <Text style={ { fontSize: 10, color: "#555555", marginTop: Utils.moderateScale(-2) } }>/per day</Text> */ }
                                </View>
                            </View>
                        </View>

                    </View>
                    <View style={ { height: 30 } }></View>
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const localStyle = StyleSheet.create({
    MainContainer: {
        backgroundColor: 'transparent',
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
    innerContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignContent: 'center',
        width: 150,
        height: 150,
        padding: Utils.moderateScale(0.5),

    },
    innerContainer2: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        width: 150,
        height: 120,
        padding: Utils.moderateScale(0.5),

    },
    // card: {
    //     margin: Utils.moderateScale(5),
    //     backgroundColor: '#272727',
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignContent: 'center',

    // },
    card: {
        width: '97%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#272727',
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