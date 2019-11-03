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
    Icon,
    processColor
} from 'react-native';
import { Body, Header, Left, Right } from "native-base";
import { connect } from "react-redux";
import { ActionCreators } from "../actions/index";
import { Images } from "../assets/Images/index";
import * as Utils from "../lib/utils";
import { GlobalStyle } from "../assets/styles/GlobalStyle";
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Loader from "../components/Loader";
import { BarChart } from 'react-native-charts-wrapper';
import AppleHealthKit from 'rn-apple-healthkit';
import { Calendar } from "react-native-calendars";
import FAIcon from "react-native-vector-icons/FontAwesome";
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

// create a component
class MonthGraphScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        // const date = new Date().getDate();
        // const month = new Date().getMonth() + 1;
        // const year = new Date().getFullYear();
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        if (date < 10) {
            date = "0" + date;
        }
        if (month < 10) {
            month = "0" + month;
        }

        this.state = {
            calDate: "",
            stepsCount: 0,
            CalorieCount: 0,
            DistanceCount: 0,
            dateSelected: year + "-" + month + "-" + date,
            maxDate1: year + "-" + month + "-" + date,
            prevMonthAvailable: true,
            nextMonthAvailable: true
        }

        this.GetDailyCount = this.GetDailyCount.bind(this);
        this.DailyDistanceSamples = this.DailyDistanceSamples.bind(this);
        this.DailyCalorie = this.DailyCalorie.bind(this);
        this.GetDateCal = this.GetDateCal.bind(this);
        this.GetDateCalendar = this.GetDateCalendar.bind(this);
    }

    componentDidMount() {
        this._isMount = true;
        const date1 = String(new Date().getDate()).padStart(2, '0');
        const month1 = new Date().getMonth() + 1;
        const year1 = new Date().getFullYear();
        const CurrentDate = year1 + "-" + month1 + "-" + date1;
        this.GetDateCal(CurrentDate);
        //this.DailyDistanceSamples(CurrentDate);
    }

    GetDateCal(date) {
        this.GetDailyCount(date);
        this.DailyDistanceSamples(date);
    }
    GetDailyCount(date) {

        AppleHealthKit.isAvailable((err, available) => {
            if (available) {
                // ...
                // console.log('available') 
                AppleHealthKit.initHealthKit(healthKitOptions, (err, res) => {
                    if (err) {
                        console.log("error initializing healthkit: ", err);
                        return;
                    }
                    this.state = {
                        loading: true,
                    }
                    var start_new_date = date + "T00:00:17.971Z";
                    var end_new_date = date + "T23:59:59.971Z";

                    const newOptions = {
                        startDate: start_new_date,
                        endDate: end_new_date
                    };
                    //  console.log('resssss-', res) 
                    AppleHealthKit.getDailyStepCountSamples(newOptions, (err, steps) => {
                        if (err) {
                            console.log('errerrerrerr-', err)
                            return;
                        }
                        console.log('steppeppeppe-', steps)

                        if (steps.length > 0) {
                            var floosteps = Math.abs(steps[0].value)

                            this.setState({
                                stepsCount: Math.abs(floosteps)
                            });
                        }
                        this.DailyCalorie(date);

                    });
                });
            }
        });

        this.state = {
            loading: false,
        }
    }
    GetDateCalendar(date) {
        this.GetDailyCountCalendar(date);
        this.DailyDistanceSamples1(date);
    }

    GetDailyCountCalendar(date) {
        AppleHealthKit.isAvailable((err, available) => {
            if (available) {
                // ...
                // console.log('available') 
                AppleHealthKit.initHealthKit(healthKitOptions, (err, res) => {
                    if (err) {
                        console.log("error initializing healthkit: ", err);
                        return;
                    }
                    this.state = {
                        loading: true,
                    }
                    var start_new_date = date + "T00:00:17.971Z";
                    var end_new_date = date + "T00:00:17.971Z";
                    //var end_new_date = date + "T23:59:59.971Z";

                    const newOptions = {
                        startDate: start_new_date,
                        endDate: end_new_date
                    };

                    AppleHealthKit.getDailyStepCountSamples(newOptions, (err, steps) => {
                        if (err) {
                            console.log('1234567890 error-', err)
                            this.setState({
                                stepsCount: 0
                            });
                            return;
                        }
                        console.log('1234567890-', steps)

                        if (steps.length > 0) {
                            var floosteps = Math.abs(steps[0].value)
                            this.setState({
                                stepsCount: Math.abs(floosteps)
                            });
                        }
                        else {
                            this.setState({
                                stepsCount: 0
                            });

                        }
                        this.DailyCalorie(date);
                    });
                });
            }
        });

        this.state = {
            loading: false,
        }
    }
    DailyCalorie(date) {

        var CalCount = "";
        if (this.state.stepsCount == undefined) {
            CalCount = 0;
        }
        else {
            CalCount = Math.abs(this.state.stepsCount * 0.09);
        }
        this.setState({
            CalorieCount: Math.round(CalCount),
        });

    }

    DailyDistanceSamples(dateCal) {
        var start_new_dateCal = dateCal + "T00:00:17.971Z";
        var end_new_dateCal = dateCal + "T23:59:59.971Z";

        let newOptionsCal = {
            startDate: start_new_dateCal,
            endDate: end_new_dateCal,
        };
        AppleHealthKit.getDistanceWalkingRunning(newOptionsCal, (err, distance) => {
            if (err) {
                console.log('distance month-', err)
                this.setState({
                    DistanceCount: 0
                });
                return;
            }
            console.log('distance month-', distance.message)

            if (distance.message == undefined) {
                this.setState({
                    DistanceCount: 0
                });
            }
            else {
                var distanceFlor = Math.abs(distance.value)
                this.setState({
                    DistanceCount: Math.floor(distanceFlor)
                });

            }
        });

        this.state = {
            loading: false,
        }
    }

    DailyDistanceSamples1(dateCal) {
        var start_new_dateCal = dateCal + "T00:00:17.971Z";
        //var end_new_dateCal = dateCal + "T00:00:17.971Z";
        var end_new_dateCal = dateCal + "T23:59:59.971Z";

        let newOptionsCal = {
            // startDate: start_new_dateCal,
            date: end_new_dateCal,
        };
        console.log('newOptionsCalnewOptionsCal-', newOptionsCal)
        AppleHealthKit.getDistanceWalkingRunning(newOptionsCal, (err, distanceCal1) => {
            if (err) {
                console.log('distanceCal error-', err)
                this.setState({
                    DistanceCount: 0
                });
                return;
            }
            console.log('distanceCal distanceCal1-', distanceCal1.value.message)
            // if (distanceCal1.message == undefined) {
            //     this.setState({
            //         DistanceCount: 0
            //     });
            // }
            // else {
            var distanceFlor = Math.abs(distanceCal1.value)
            this.setState({
                DistanceCount: Math.floor(distanceFlor)
            });

            //}
        });

        this.state = {
            loading: false,
        }
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    handleSelect(event) {
        let entry = event.nativeEvent
        if (entry == null) {
            this.setState({ ...this.state, selectedEntry: null })
        } else {
            this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) })
        }
        console.log(event.nativeEvent)
    }

    // onDayPress(day) {
    //     this.setState({
    //         selected: day.dateString
    //     });
    // }

    render() {
        if (this.state.loading) {
            return <Loader loading={this.state.loading} />;
        }
        return (
            <View style={[GlobalStyle.container, localStyle.container]}>
                <Header
                    style={GlobalStyle.header}
                    androidStatusBarColor="#161616"
                    iosBarStyle="light-content"
                >
                    <Left style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Image source={Images.backArrow} style={{
                                marginRight: Utils.moderateScale(15, 0.5),
                                width: Utils.moderateScale(18),
                                height: Utils.moderateScale(14)
                            }} resizeMode="contain" resizeMethod="resize" />
                        </TouchableOpacity>
                    </Left>

                    <Body style={GlobalStyle.headerBody}>
                        <Text style={GlobalStyle.headerTitle}>Monthly Record </Text>
                    </Body>
                    <Right>

                    </Right>
                </Header>
                <ScrollView>
                    <View style={localStyle.innerContainer}>
                        <View style={[GlobalStyle.card, localStyle.card,
                        { flexDirection: 'column', justifyContent: 'space-between' }]}>

                            <Calendar
                                style={{ width: "100%", }}
                                current={this.state.dateSelected}
                                maxDate={this.state.maxDate1}
                                markedDates={{
                                    [this.state.calDate.dateString]:
                                        { selected: true, marked: false, selectedColor: '#3CB371' },
                                }}
                                onDayPress={day => {
                                    this.setState({
                                        calDate: day,
                                        selected: day.dateString
                                    }, () => {
                                        this.GetDateCalendar(this.state.calDate.dateString);
                                    })
                                }}

                                renderArrow={(direction) => {
                                    if (direction == 'left' && this.state.prevMonthAvailable) return (<FAIcon name={'caret-left'} size={16} color="white" />)
                                    if (direction == 'right' && this.state.nextMonthAvailable) return (<FAIcon name={'caret-right'} size={16} color="white" />)
                                }}

                                hideArrows={false}
                                hideExtraDays={true}
                                monthFormat={"MMMM yyyy"}
                                firstDay={1}
                                hideDayNames={false}
                                showWeekNumbers={false}
                                disableMonthChange={false}
                                theme={{
                                    backgroundColor: '#272727',
                                    calendarBackground: '#272727',
                                    textSectionTitleColor: '#fff',
                                    selectedDayBackgroundColor: '#3CB371',
                                    selectedDayTextColor: '#272727',
                                    todayTextColor: '#3CB371',
                                    dayTextColor: '#fff',
                                    textDisabledColor: '#676767',
                                    dotColor: '#3CB371',
                                    selectedDotColor: '#272727',
                                    monthTextColor: '#fff',
                                    indicatorColor: '#fff',
                                }}
                            />

                        </View>
                        <View style={[GlobalStyle.card, localStyle.card,
                        { flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        // paddingTop: 80,
                                        fontSize: 15,
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "column",
                                            marginLeft: Utils.moderateScale(18),
                                            fontSize: 15,
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontSize: Utils.moderateVerticalScale(15) }}>
                                            Total Steps </Text>

                                    </View>

                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "column",
                                            marginLeft: Utils.moderateScale(80),
                                            fontSize: 15,

                                        }}
                                    >
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: Utils.moderateVerticalScale(18),
                                            marginLeft: Utils.moderateVerticalScale(60),
                                        }}>   {this.state.stepsCount}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={[GlobalStyle.card, localStyle.card,
                        { flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        // paddingTop: 80,
                                        fontSize: Utils.moderateVerticalScale(15),
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "column",
                                            marginLeft: Utils.moderateScale(18),
                                            fontSize: Utils.moderateVerticalScale(15),
                                        }}
                                    >
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: Utils.moderateVerticalScale(15)
                                        }}>
                                            Total Calories  </Text>

                                    </View>

                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "column",
                                            marginLeft: Utils.moderateScale(80),
                                            fontSize: Utils.moderateVerticalScale(15),

                                        }}
                                    >
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: Utils.moderateVerticalScale(18),
                                            marginLeft: Utils.moderateVerticalScale(60),
                                        }}> {this.state.CalorieCount}   </Text>

                                    </View>
                                </View>
                            </View>

                        </View>
                        <View style={[GlobalStyle.card, localStyle.card,
                        { flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        // paddingTop: 80,
                                        fontSize: Utils.moderateVerticalScale(15),
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "column",
                                            marginLeft: Utils.moderateScale(18),
                                            fontSize: Utils.moderateVerticalScale(15),
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontSize: Utils.moderateVerticalScale(15) }}>
                                            Total Distance </Text>

                                    </View>

                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "column",
                                            marginLeft: Utils.moderateScale(80),
                                            fontSize: Utils.moderateVerticalScale(15),

                                        }}
                                    >
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: Utils.moderateVerticalScale(18),
                                            marginLeft: Utils.moderateVerticalScale(60),
                                        }}> {this.state.DistanceCount} m </Text>
                                    </View>
                                </View>
                            </View>

                        </View>

                    </View>
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
        justifyContent: 'space-evenly',
        alignContent: 'center',
        width: '100%',
        paddingVertical: Utils.moderateVerticalScale(10)
    },

    card: {
        margin: Utils.moderateScale(5),
        paddingVertical: Utils.moderateVerticalScale(10),
        backgroundColor: '#272727',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    MainContainer: {
        flex: 1,
        paddingTop: Utils.moderateScale(20),
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
        padding: Utils.moderateScale(2),
        margin: Utils.moderateScale(2)

    },
    buttonContainer1: {
        marginVertical: Utils.moderateVerticalScale(30),
        height: Utils.moderateVerticalScale(60),
        width: Utils.moderateVerticalScale(300),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Utils.moderateVerticalScale(50),
        marginLeft: Utils.moderateScale(35)
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
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MonthGraphScreen);      