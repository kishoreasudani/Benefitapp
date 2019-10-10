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
import { Container, Content, Icon, Accordion } from "native-base";
import FAIcon from "react-native-vector-icons/FontAwesome";
import Loader from "../components/Loader";

// create a component
class FAQsScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            faqData: []
        }
    }

    componentDidMount() {
        this._isMount = true;
        this.faqs();
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    faqs() {
        const _this = this;
        this.state = {
            loading: true,
        }
        let data = {
            search_text: "",
            page_no: 0,
            page_size: 0
        }
        Utils.makeApiRequest(URL.API_URL.getFaqList.url, URL.API_URL.getFaqList.endPoint, data, { authorization: this.props.userData.token })
            .then(async response => {
                if (response) {

                    this.setState({
                        faqData: response.body,
                        loading: false
                    })

                } else {
                    this.setState({
                        faqData: [],
                        loading: false
                    })
                }
            })
    }
    _renderHeader(item, expanded) {
        return (
            <View style={ { flex: 1 } }>
                <View style={ [localStyle.card,
                ] }>
                    <View style={ localStyle.FaqQuestion }>
                        <Text style={ localStyle.FaqInnerQuestion }>
                            { item.question }
                        </Text>

                        { expanded
                            ? <Icon style={ { fontSize: 12, color: "#fff", } } name="remove" />
                            : <Icon style={ { fontSize: 12, color: "#fff", } } name="add" /> }

                    </View>
                </View>
            </View>

        );
    }
    _renderContent(item) {
        return (
            <Text style={ localStyle.FaqAnswer }  >
                { item.answer }
            </Text>
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
                        <TouchableOpacity onPress={ () => this.props.navigation.goBack() }>
                            <FAIcon name="arrow-left" style={ { color: "white", fontSize: Utils.moderateScale(15) } } />
                        </TouchableOpacity>
                    </Left>
                    <Body style={ GlobalStyle.headerBody }>
                        <Text style={ GlobalStyle.headerTitle }>FAQs</Text>
                    </Body>
                    <Right>
                        <TouchableOpacity onPress={ () => this.props.navigation.navigate("Notifications") }>
                            <FAIcon name="bell" style={ { color: "white", fontSize: Utils.moderateScale(15) } } />
                        </TouchableOpacity>
                    </Right>
                </Header>


                <Accordion
                    style={ { borderBottomColor: "#fff" } }
                    dataArray={ this.state.faqData }
                    animation={ true }
                    expanded={ true }
                    renderHeader={ this._renderHeader }
                    renderContent={ this._renderContent }
                />
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
    FaqAnswer: {
        marginLeft: Utils.moderateVerticalScale(10),
        marginRight: Utils.moderateVerticalScale(10),
        marginBottom: Utils.moderateVerticalScale(0),
        backgroundColor: "#555555",
        paddingTop: Utils.moderateVerticalScale(10),
        color: "#fff",
        fontStyle: "italic",
        borderRadius: Utils.moderateVerticalScale(6),
        borderWidth: Utils.moderateVerticalScale(1),
        borderLeftWidth: Utils.moderateVerticalScale(5),
        paddingLeft: Utils.moderateVerticalScale(12),
        paddingRight: Utils.moderateVerticalScale(10),
        paddingBottom: Utils.moderateVerticalScale(10),
        borderLeftColor: "#70bf51",
    },
    FaqQuestion: {
        flexDirection: "row",
        padding: Utils.moderateVerticalScale(10),
        justifyContent: "space-between",
        alignItems: "center",
    },
    FaqInnerQuestion: {
        fontSize: Utils.moderateVerticalScale(15),
        marginLeft: Utils.moderateVerticalScale(5),
        fontWeight: "600", color: "#fff",
    },
    card: {
        marginLeft: Utils.moderateVerticalScale(10),
        marginTop: Utils.moderateVerticalScale(10),
        marginRight: Utils.moderateVerticalScale(10),
        marginBottom: Utils.moderateVerticalScale(0),
        borderRadius: Utils.moderateVerticalScale(10),
        paddingVertical: Utils.moderateVerticalScale(2),
        backgroundColor: '#272727',
        flex: 1,
        height: Utils.moderateVerticalScale(50),
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
    buttonContainer1: {
        marginVertical: Utils.moderateVerticalScale(30),
        height: Utils.moderateVerticalScale(60),
        width: Utils.moderateVerticalScale(300),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Utils.moderateVerticalScale(50),
        marginLeft: Utils.moderateVerticalScale(35)
    },
    circle: {
        width: Utils.moderateVerticalScale(35),
        height: Utils.moderateVerticalScale(35),
        marginVertical: Utils.moderateVerticalScale(20),
        borderRadius: Utils.moderateVerticalScale(18),
        backgroundColor: '#555555',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

const mapStateToProps = state => {
    return { userData: state.appData.userData };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FAQsScreen);