//import libraries
import React, { Component } from 'react';
import {
    StyleSheet,
    View, Dimensions,
    Alert,
    Image,
    Platform,
    Text,
    ImageBackground, PixelRatio,
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
class WeekGraphScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            stepArr: [],
            chardata: {},
            status: true,
            status1: false,
            status2: false,
            status2: false,
            maxSteps: 0,
            TotalStep: 0,
            AvgStep: 0,
            Type: 1,
            legend: {
                enabled: true,
                textSize: 14,
                form: 'SQUARE',
                formSize: 14,
                xEntrySpace: 10,
                yEntrySpace: 5,
                formToTextSpace: 5,
                wordWrapEnabled: true,
                maxSizePercent: 0.5
            },
            data: {
                dataSets: [{
                    values: [{ y: 100 }, { y: 105 }, { y: 102 }, { y: 110 }, { y: 114 }, { y: 109 }, { y: 105 }, { y: 99 }, { y: 95 }],
                    label: 'Bar dataSet',
                    config: {
                        color: processColor('teal'),
                        barShadowColor: processColor('lightgrey'),
                        highlightAlpha: 90,
                        highlightColor: processColor('red'),
                    }
                }],

                config: {
                    barWidth: 0.7,
                }
            },
            highlights: [{ x: 3 }, { x: 6 }],
            xAxis: {
                valueFormatter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                granularityEnabled: true,
                granularity: 1,
            }
        };
        this.GetDailyCount = this.GetDailyCount.bind(this);
        this.DailyDistanceSamples = this.DailyDistanceSamples.bind(this);
        this.DailyCalorie = this.DailyCalorie.bind(this);
    }

    componentDidMount() {
        this._isMount = true;
        //this.GetDailyCount();
        //this.DailyDistanceSamples();
        //this.DailyCalorie();
    }
    GetWeekDays() {
        let weekDays = [];
        let allWeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var End_date = new Date();
        for (let k = 0; k < 7; k++) {
            if (k == 0) {
                var endDates = End_date.setDate(End_date.getDate());
                var DatePush = new Date(endDates);
                weekDays.push(allWeekDays[DatePush.getDay()]);
            }
            else {
                var endDatesNew = End_date.setDate(End_date.getDate() - 1);
                var EndDatePush = new Date(endDatesNew);
                weekDays.push(allWeekDays[EndDatePush.getDay()]);
            }

        }
        return weekDays;
    }
    GetDailyCount() {
        this.state = {
            loading: true,
            status: true,
            status1: false,
            status2: false,
            Type: 1,
        }
        var End_date = new Date();
        var start_date = new Date();
        var hhh = start_date.setDate(start_date.getDate() - 7);
        var d = new Date(hhh);

        var dd = String(start_date.getDate()).padStart(2, '0');
        var dd1 = String(start_date.getDate()).padStart(2, '0');
        var mm = String(start_date.getMonth() + 1).padStart(2, '0');
        var yyyy = start_date.getFullYear();
        var start_new_date = yyyy + "-" + mm + "-" + dd + "T00:00:17.971Z";
        var end_new_date = yyyy + "-" + mm + "-" + dd1 + "T23:59:59.971Z";

        const newOptions = {
            startDate: start_new_date,
            endDate: End_date.toISOString()
        };

        let finalTimes = [];
        let calculateTime = [];
        let Total = 0;
        let TotalAvg = 0;
        let toDay = "";

        AppleHealthKit.getDailyStepCountSamples(newOptions, (err, steps) => {
            if (err) {
                console.log('errerrerrerr-', err)
                return;
            }
            // console.log('week graph-', steps)
            // if (steps.length > 0) {
            //     this.setState({
            //         stepsCount: Math.abs(steps[0].value)
            //     });
            // }

            if (steps == '' && steps == null) {
                console.log('result null')
                this.state = {
                    loading: false,
                }
            }
            else {
                for (let i = 0; i < (7 - steps.length); i++) {
                    finalTimes.push({ y: 0 })
                    calculateTime.push(0)
                    Total = Total + 0
                }
                let k = 0;
                steps.map(item => {
                    if (k > 0) {
                        if (k <= 7) {
                            finalTimes.push({ y: item.value })
                            calculateTime.push(item.value)
                            Total = Total + item.value

                        }
                    }
                    k++;
                })

                TotalAvg = Total / 7;
                // console.log('mac ', TotalAvg);
                this.setState({
                    stepArr: finalTimes,
                    data: {
                        dataSets: [{
                            values: finalTimes,
                            label: '',
                            config: {
                                color: processColor('#54c18d'),
                                drawFilled: false,
                                fillColor: processColor('gray'),
                                textColor: processColor('gray'),
                                fillAlpha: 50, valueTextSize: 0,
                                drawCircles: false,
                                startAtZero: false,
                                drawGridLines: false
                            }
                        }],
                        config: {
                            barWidth: 0.4,
                            color: processColor('#54c18d'),
                        }
                    },
                    xAxis: {
                        valueFormatter: this.GetWeekDays().reverse(),
                        position: 'BOTTOM',
                        drawGridLines: false,
                        spaceBetweenLabels: 0,
                        labelRotationAngle: 1.0,
                        textColor: processColor('gray'),
                        axisLineColor: processColor('#54c18d'),
                        axisLineWidth: 1
                    },

                    yAxis: {
                        left: {
                            drawGridLines: false,
                            textColor: processColor('gray'),
                            axisMinimum: 0,
                            labelCount: 8,
                            axisMaximum: Math.max(...calculateTime),
                            axisLineColor: processColor('#54c18d'),
                            axisLineWidth: 1
                        },
                        right: { enabled: false }
                    },
                    loading: false,
                    status: true,
                    status1: false,
                    status2: false,
                    maxSteps: Math.max(...calculateTime),
                    TotalStep: Math.floor(Total),
                    AvgStep: Math.floor(TotalAvg),
                    Type: 1,
                })
            }

        })
        //  .catch((err) => { console.warn(err) })
    }

    DailyDistanceSamples() {
        this.state = {
            loading: true,
            status: false,
            status1: false,
            status2: true,
            Type: 3,
        }
        var End_dateDis = new Date();
        var start_dateDis = new Date();
        var hhh = start_dateDis.setDate(start_dateDis.getDate() - 7);
        var d = new Date(hhh);

        var dd = String(start_dateDis.getDate()).padStart(2, '0');
        var dd1 = String(start_dateDis.getDate()).padStart(2, '0');
        var mm = String(start_dateDis.getMonth() + 1).padStart(2, '0');
        var yyyy = start_dateDis.getFullYear();
        var start_new_dateCal = yyyy + "-" + mm + "-" + dd + "T00:00:17.971Z";
        var end_new_date = yyyy + "-" + mm + "-" + dd1 + "T23:59:59.971Z";

        const newOptions1 = {
            startDate: start_new_dateCal,
            endDate: End_dateDis.toISOString()
        };

        let finalTimes = [];
        let calculateTime = [];
        let Total = 0;
        let TotalAvg = 0;

        console.log('date distance', newOptions1)

        AppleHealthKit.getDistanceWalkingRunning(newOptions1, (err, distance) => {
            console.log('week distance', distance)
            if (distance == '' && distance == null) {
                console.log('result null')
                this.state = {
                    loading: false,
                }
            }
            else {
                for (let i = 0; i < (7 - distance.length); i++) {
                    finalTimes.push({ y: 0 })
                    calculateTime.push(0)
                    Total = Total + 0
                }
                let k = 0;
                distance.map(item => {
                    if (k > 0) {
                        if (k <= 7) {
                            finalTimes.push({ y: item.distance })
                            calculateTime.push(item.distance)
                            Total = Total + item.distance
                        }
                    }
                    k++;
                })
                TotalAvg = Total / 7;

                this.setState({
                    stepArr: finalTimes,
                    data: {
                        dataSets: [{
                            values: finalTimes,
                            label: '',
                            config: {
                                color: processColor('#54c18d'),
                                drawFilled: false,
                                fillColor: processColor('gray'),
                                textColor: processColor('gray'),
                                fillAlpha: 50, valueTextSize: 0,
                                drawCircles: false,
                                startAtZero: false,
                                drawGridLines: false
                            }
                        }],
                        config: {
                            barWidth: 0.4,
                            color: processColor('#54c18d'),
                        }
                    },
                    xAxis: {
                        valueFormatter: this.GetWeekDays().reverse(),
                        position: 'BOTTOM',
                        drawGridLines: false,
                        spaceBetweenLabels: 0,
                        labelRotationAngle: 1.0,
                        textColor: processColor('gray'),
                        axisLineColor: processColor('#54c18d'),
                        axisLineWidth: 1
                    },

                    yAxis: {
                        left: {
                            drawGridLines: false,
                            textColor: processColor('gray'),
                            axisMinimum: 0,
                            labelCount: 8,
                            axisMaximum: Math.max(...calculateTime),
                            axisLineColor: processColor('#54c18d'),
                            axisLineWidth: 1,

                        },
                        right: { enabled: false }
                    },
                    loading: false,
                    status: false,
                    status1: false,
                    status2: true,
                    Type: 3,
                    TotalStep: Math.floor(Total),
                    AvgStep: Math.floor(TotalAvg),
                })
            }

        });

    }

    DailyCalorie() {
        this.state = {
            loading: true,
            status: false,
            status1: true,
            status2: false,
            Type: 2,
        }
        var End_date = new Date();
        var start_date = new Date();
        var hhh = start_date.setDate(start_date.getDate() - 7);
        var d = new Date(hhh);

        var dd = String(start_date.getDate()).padStart(2, '0');
        var dd1 = String(start_date.getDate()).padStart(2, '0');
        var mm = String(start_date.getMonth() + 1).padStart(2, '0');
        var yyyy = start_date.getFullYear();
        var start_new_date = yyyy + "-" + mm + "-" + dd + "T00:00:17.971Z";
        var end_new_date = yyyy + "-" + mm + "-" + dd1 + "T23:59:59.971Z";

        const newOptions = {
            startDate: start_new_date,
            endDate: End_date.toISOString()
        };

        let finalTimes = [];
        let calculateTime = [];
        let Total = 0;
        let TotalAvg = 0;

        AppleHealthKit.getDailyStepCountSamples(newOptions, (err, res) => {
            // AppleHealthKit.getDailyStepCountSamples(newOptions)
            // .then((res) => {
            if (res == '' && res == null) {
                console.log('result null')
                this.state = {
                    loading: false,
                }
            }
            else {
                for (let i = 0; i < (7 - res.length); i++) {
                    finalTimes.push({ y: 0 * 0.09 })
                    calculateTime.push(0 * 0.09)
                    Total = Total + 0
                }
                let k = 0;
                res.map(item => {
                    if (k > 0) {
                        if (k <= 7) {
                            finalTimes.push({ y: item.value * 0.09 })
                            calculateTime.push(item.value * 0.09)
                            Total = Total + item.value
                        }
                    }
                    k++;
                })

                TotalAvg = Total / 7;
                //console.log('mac ', TotalAvg);
                this.setState({
                    stepArr: finalTimes,
                    data: {
                        dataSets: [{
                            values: finalTimes,
                            label: '',
                            config: {
                                color: processColor('#54c18d'),
                                drawFilled: false,
                                fillColor: processColor('gray'),
                                textColor: processColor('gray'),
                                fillAlpha: 50, valueTextSize: 0,
                                drawCircles: false,
                                startAtZero: false,
                                drawGridLines: false
                            }
                        }],
                        config: {
                            barWidth: 0.4,
                            color: processColor('#54c18d'),
                        }
                    },
                    xAxis: {
                        valueFormatter: this.GetWeekDays().reverse(),
                        position: 'BOTTOM',
                        drawGridLines: false,
                        spaceBetweenLabels: 0,
                        labelRotationAngle: 1.0,
                        textColor: processColor('gray'),
                        axisLineColor: processColor('#54c18d'),
                        axisLineWidth: 1
                    },

                    yAxis: {
                        left: {
                            drawGridLines: false,
                            textColor: processColor('gray'),
                            axisMinimum: 0,
                            labelCount: 8,
                            axisMaximum: Math.max(...calculateTime),
                            axisLineColor: processColor('#54c18d'),
                            axisLineWidth: 1
                        },
                        right: { enabled: false }
                    },
                    loading: false,
                    status: false,
                    status1: true,
                    status2: false,
                    Type: 2,
                    TotalStep: Math.floor(Total),
                    AvgStep: Math.floor(TotalAvg),
                })
            }

        })
        // .catch((err) => { console.warn(err) })
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

    render() {
        // if (this.state.loading) {
        //     return <Loader loading={this.state.loading} />;
        // }
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
                        <Text style={GlobalStyle.headerTitle}>Week Graph </Text>
                    </Body>
                    <Right>

                    </Right>
                </Header>
                <ScrollView>
                    <View style={localStyle.innerContainer}>
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
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: Utils.moderateVerticalScale(15)
                                        }}>
                                            Highest Record </Text>
                                        {/* <Text style={ {
                                            color: '#555555', fontWeight: '400',
                                            fontSize: Utils.moderateVerticalScale(15)
                                        } }>
                                        </Text> */}
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
                                            fontSize: Utils.moderateVerticalScale(18)
                                        }}> {this.state.maxSteps} steps </Text>
                                        {/* <Text style={ {
                                            color: '#555555', fontWeight: '400',
                                            fontSize: Utils.moderateVerticalScale(15)
                                        } }> </Text> */}
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={[GlobalStyle.card, localStyle.card,
                        { flexDirection: 'column', justifyContent: 'space-between' }]}>
                            <View style={{
                                flex: 1, flexDirection: "row", justifyContent: "space-evenly",
                                marginVertical: Utils.moderateVerticalScale(25)
                            }} >
                                <TouchableOpacity onPress={() => this.GetDailyCount()}>
                                    {
                                        this.state.status ?
                                            <Text style={{
                                                marginLeft: Utils.moderateVerticalScale(0),
                                                fontSize: Utils.moderateVerticalScale(16), color: "#54c18d"
                                            }}> Steps  </Text>

                                            : <Text style={{
                                                marginLeft: Utils.moderateVerticalScale(0),
                                                fontSize: Utils.moderateVerticalScale(16), color: "#555555"
                                            }}> Steps  </Text>
                                    }
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.DailyCalorie()}>
                                    {
                                        this.state.status1 ?
                                            <Text style={{
                                                marginLeft: Utils.moderateVerticalScale(70),
                                                fontSize: Utils.moderateVerticalScale(16), color: "#54c18d"
                                            }}> XCAL </Text>
                                            :
                                            <Text style={{
                                                marginLeft: Utils.moderateVerticalScale(70),
                                                fontSize: Utils.moderateVerticalScale(16), color: "#555555"
                                            }}> XCAL </Text>
                                    }
                                </TouchableOpacity>
                                {/* onPress={() => this.DailyDistanceSamples()} */}
                                <TouchableOpacity >
                                    {
                                        this.state.status2 ?
                                            <Text style={{
                                                marginLeft: Utils.moderateVerticalScale(60),
                                                fontSize: Utils.moderateVerticalScale(16), color: "#54c18d"
                                            }}> Distance </Text>
                                            :
                                            <Text style={{
                                                marginLeft: Utils.moderateVerticalScale(60),
                                                fontSize: Utils.moderateVerticalScale(16), color: "#555555"
                                            }}> Distance </Text>

                                    }
                                </TouchableOpacity>
                            </View>

                            <BarChart style={{
                                flex: 1,
                                width: "100%",
                                height: Utils.moderateVerticalScale(300)
                            }}
                                data={this.state.data}
                                xAxis={this.state.xAxis}
                                yAxis={this.state.yAxis}
                                drawGridBackground={false}
                                scaleEnabled={false}
                                chartDescription={{
                                    text: ' ',
                                    textColor: processColor('#FFF'),
                                    textSize: 10, positionX: 700, positionY: 50
                                }}
                                drawValueAboveBar={true}
                                legend={{ enabled: false }}
                                description={{ enabled: false }}
                            />
                            {/* <BarChart
                                style={{
                                    flex: 1
                                }}
                                data={this.state.data}
                                xAxis={this.state.xAxis}
                                animation={{ durationX: 2000 }}
                                legend={this.state.legend}
                                gridBackgroundColor={processColor('#ffffff')}
                                visibleRange={{ x: { min: 5, max: 5 } }}
                                drawBarShadow={false}
                                drawValueAboveBar={true}
                                drawHighlightArrow={true}
                                onSelect={this.handleSelect.bind(this)}
                                highlights={this.state.highlights}
                                onChange={(event) => console.log(event.nativeEvent)}
                            /> */}

                            <View style={{
                                height: Utils.moderateVerticalScale(0.5),
                                width: '100%', backgroundColor: "#525252",
                                marginVertical: Utils.moderateVerticalScale(10)
                            }} />

                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                }} >
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "column",
                                        marginLeft: Utils.moderateScale(40),
                                        fontSize: 15,
                                    }}
                                >
                                    <View style={localStyle.innerContainer}>
                                        <Text style={{
                                            color: '#fff', fontWeight: '400',
                                            fontSize: Utils.moderateVerticalScale(10)
                                        }}>Total {" "}
                                            {
                                                this.state.Type == 1 ? "Steps"
                                                    : this.state.Type == 2 ? "Calories" :
                                                        "Distance"
                                            }

                                        </Text>
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: Utils.moderateVerticalScale(10)
                                        }}> {this.state.TotalStep}
                                        </Text>
                                    </View>

                                </View>

                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "column",
                                        marginVertical: Utils.moderateVerticalScale(10),
                                        fontSize: 105,
                                        marginLeft: Utils.moderateScale(40),
                                    }}
                                >

                                    <View style={localStyle.innerContainer}>
                                        <Text style={{
                                            color: '#555555',
                                            marginHorizontal: Utils.moderateScale(4)
                                        }}>|</Text>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "column",
                                        fontSize: 15,

                                    }}
                                >
                                    <View style={localStyle.innerContainer}>
                                        <Text style={{
                                            color: '#fff', fontWeight: '400',
                                            fontSize: Utils.moderateVerticalScale(10)
                                        }}>  Avg {" "}
                                            {
                                                this.state.Type == 1 ? "Steps"
                                                    : this.state.Type == 2 ? "Calories" :
                                                        "Distance"
                                            }
                                        </Text>
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: Utils.moderateVerticalScale(10)
                                        }}>   {this.state.AvgStep}

                                        </Text>
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
        margin: Utils.moderateScale(6),
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
)(WeekGraphScreen);      