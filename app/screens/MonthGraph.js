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
import GoogleFit, { Scopes } from 'react-native-google-fit';
import { Calendar } from "react-native-calendars";
import FAIcon from "react-native-vector-icons/FontAwesome";
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
// create a component
class MonthGraphScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor (props) {
        super(props);
        const date = new Date().getDate();
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();

        this.state = {
            calDate: "",
            stepsCount: 0,
            CalorieCount: 0,
            DistanceCount: 0,
            //prevMonthAvailable: false,
            dateSelected: year + "-" + month + "-" + date,
            prevMonthAvailable: true,
            nextMonthAvailable: true
        }

        this.GetDailyCount = this.GetDailyCount.bind(this);
        this.DailyDistanceSamples = this.DailyDistanceSamples.bind(this);
        this.DailyCalorie = this.DailyCalorie.bind(this);
        //this.onDayPress = this.onDayPress.bind(this);
        this.GetDateCal = this.GetDateCal.bind(this);
    }

    componentDidMount() {
        this._isMount = true;
        const date1 = String(new Date().getDate()).padStart(2, '0');
        const month1 = new Date().getMonth() + 1;
        const year1 = new Date().getFullYear();
        const CurrentDate = year1 + "-" + month1 + "-" + date1;
        this.GetDateCal(CurrentDate);
    }

    GetDateCal(date) {
        this.GetDailyCount(date);
        this.DailyDistanceSamples(date);
    }

    GetDailyCount(date) {
        this.state = {
            loading: true,
        }
        var start_new_date = date + "T00:00:17.971Z";
        var end_new_date = date + "T23:59:59.971Z";

        const newOptions = {
            startDate: start_new_date,
            endDate: end_new_date
        };

        GoogleFit.getDailyStepCountSamples(newOptions)
            .then((res) => {
                console.log('dateformat', res)
                var SetDistance = "";
                if (res == false) {
                    SetDistance = 0;
                }
                else {
                    if (res[2].steps != undefined && res[2].steps != null && res[2].steps != '') {
                        SetDistance = Math.round(res[2].steps[0].value)
                    }
                    else {
                        SetDistance = 0;
                    }
                }
                this.setState({
                    stepsCount: Math.abs(SetDistance),
                });
                this.DailyCalorie(date);
            })
            .catch((err) => { console.warn(err) })
        this.state = {
            loading: false,
        }
    }

    DailyDistanceSamples(date) {
        this.state = {
            loading: true,
        }
        var start_new_date = date + "T00:00:17.971Z";
        var end_new_date = date + "T23:59:59.971Z";

        const newOptions = {
            startDate: start_new_date,
            endDate: end_new_date
        };

        GoogleFit.getDailyDistanceSamples(newOptions, (err, res) => {
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
                DistanceCount: Math.abs(SetDistance),
            });
        });
        this.state = {
            loading: false,
        }
    }

    DailyCalorie(date) {
        // this.state = {
        //     loading: true,
        // }

        var start_new_date = date + "T00:00:17.971Z";
        var end_new_date = date + "T23:59:59.971Z";

        // const newOptions = {
        //     startDate: start_new_date,
        //     endDate: end_new_date
        // };

        // GoogleFit.getDailyCalorieSamples(newOptions, (err, res) => {
        //     var CalCount = "";
        //     if (res == false) {
        //         CalCount = 0;
        //     }
        //     else {
        //         if (res[0].calorie != undefined && res[0].calorie != null && res[0].calorie != '') {
        //             CalCount = Math.round(res[0].calorie)
        //         }
        //         else {
        //             CalCount = 0;
        //         }
        //     }
        //     this.setState({
        //         CalorieCount: Math.abs(CalCount),
        //     });
        // });
        // this.state = {
        //     loading: false,
        // } 
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
                        <Text style={ GlobalStyle.headerTitle }>Monthly Record </Text>
                    </Body>
                    <Right>

                    </Right>
                </Header>
                <ScrollView>
                    <View style={ localStyle.innerContainer }>
                        <View style={ [GlobalStyle.card, localStyle.card,
                        { flexDirection: 'column', justifyContent: 'space-between' }] }>

                            <Calendar
                                style={ { width: "100%", } }
                                current={ this.state.dateSelected }
                                // minDate={ '2019-10-01' }
                                maxDate={ this.state.dateSelected }
                                // maxDate={ {
                                //     [this.state.dateSelected]:
                                //     {
                                //         selectedDayBackgroundColor: '#3CB371',

                                //     }
                                // } }
                                markedDates={ {
                                    [this.state.calDate.dateString]:
                                        { selected: true, marked: false, selectedColor: '#3CB371' },
                                } }

                                // renderArrow={ (t) => {
                                //     if (t == 'left') return (
                                //         <FAIcon name={ 'arrow-left' } size={ Utils.moderateScale(15) } color="white"
                                //         />);
                                // } }

                                onDayPress={ day => {
                                    this.setState({
                                        calDate: day,
                                        selected: day.dateString
                                    }, () => {
                                        this.GetDateCal(this.state.calDate.dateString);
                                    })
                                } }

                                renderArrow={ (direction) => {
                                    if (direction == 'left' && this.state.prevMonthAvailable) return (<FAIcon name={ 'caret-left' } size={ 16 } color="white" />)
                                    if (direction == 'right' && this.state.nextMonthAvailable) return (<FAIcon name={ 'caret-right' } size={ 16 } color="white" />)
                                } }

                                hideArrows={ false }
                                hideExtraDays={ true }
                                monthFormat={ "MMMM dd yyyy" }
                                firstDay={ 1 }
                                hideDayNames={ false }
                                showWeekNumbers={ false }
                                disableMonthChange={ false }
                                // onPressArrowLeft={ substractMonth => substractMonth() }
                                //onPressArrowRight={ addMonth => addMonth() }
                                theme={ {
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
                                } }
                            />

                        </View>
                        <View style={ [GlobalStyle.card, localStyle.card,
                        { flexDirection: 'row', justifyContent: 'space-between' }] }>
                            <View
                                style={ {
                                    flex: 1,
                                    flexDirection: "row",
                                } }
                            >
                                <View
                                    style={ {
                                        flex: 1,
                                        flexDirection: "row",
                                        // paddingTop: 80,
                                        fontSize: 15,
                                        justifyContent: 'space-between'
                                    } }
                                >
                                    <View
                                        style={ {
                                            flex: 1,
                                            flexDirection: "column",
                                            marginLeft: Utils.moderateScale(18),
                                            fontSize: 15,
                                        } }
                                    >
                                        <Text style={ { color: '#fff', fontSize: Utils.moderateVerticalScale(15) } }>
                                            Total Steps </Text>

                                    </View>

                                    <View
                                        style={ {
                                            flex: 1,
                                            flexDirection: "column",
                                            marginLeft: Utils.moderateScale(80),
                                            fontSize: 15,

                                        } }
                                    >
                                        <Text style={ {
                                            color: '#fff',
                                            fontSize: Utils.moderateVerticalScale(18),
                                            marginLeft: Utils.moderateVerticalScale(60),
                                        } }>   { this.state.stepsCount }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={ [GlobalStyle.card, localStyle.card,
                        { flexDirection: 'row', justifyContent: 'space-between' }] }>
                            <View
                                style={ {
                                    flex: 1,
                                    flexDirection: "row",
                                } }
                            >
                                <View
                                    style={ {
                                        flex: 1,
                                        flexDirection: "row",
                                        // paddingTop: 80,
                                        fontSize: Utils.moderateVerticalScale(15),
                                        justifyContent: 'space-between'
                                    } }
                                >
                                    <View
                                        style={ {
                                            flex: 1,
                                            flexDirection: "column",
                                            marginLeft: Utils.moderateScale(18),
                                            fontSize: Utils.moderateVerticalScale(15),
                                        } }
                                    >
                                        <Text style={ {
                                            color: '#fff',
                                            fontSize: Utils.moderateVerticalScale(15)
                                        } }>
                                            Total Calories  </Text>

                                    </View>

                                    <View
                                        style={ {
                                            flex: 1,
                                            flexDirection: "column",
                                            marginLeft: Utils.moderateScale(80),
                                            fontSize: Utils.moderateVerticalScale(15),

                                        } }
                                    >
                                        <Text style={ {
                                            color: '#fff',
                                            fontSize: Utils.moderateVerticalScale(18),
                                            marginLeft: Utils.moderateVerticalScale(60),
                                        } }> { this.state.CalorieCount }   </Text>

                                    </View>
                                </View>
                            </View>

                        </View>
                        <View style={ [GlobalStyle.card, localStyle.card,
                        { flexDirection: 'row', justifyContent: 'space-between' }] }>
                            <View
                                style={ {
                                    flex: 1,
                                    flexDirection: "row",
                                } }
                            >
                                <View
                                    style={ {
                                        flex: 1,
                                        flexDirection: "row",
                                        // paddingTop: 80,
                                        fontSize: Utils.moderateVerticalScale(15),
                                        justifyContent: 'space-between'
                                    } }
                                >
                                    <View
                                        style={ {
                                            flex: 1,
                                            flexDirection: "column",
                                            marginLeft: Utils.moderateScale(18),
                                            fontSize: Utils.moderateVerticalScale(15),
                                        } }
                                    >
                                        <Text style={ { color: '#fff', fontSize: Utils.moderateVerticalScale(15) } }>
                                            Total Distance </Text>

                                    </View>

                                    <View
                                        style={ {
                                            flex: 1,
                                            flexDirection: "column",
                                            marginLeft: Utils.moderateScale(80),
                                            fontSize: Utils.moderateVerticalScale(15),

                                        } }
                                    >
                                        <Text style={ {
                                            color: '#fff',
                                            fontSize: Utils.moderateVerticalScale(18),
                                            marginLeft: Utils.moderateVerticalScale(60),
                                        } }> { this.state.DistanceCount } m </Text>
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