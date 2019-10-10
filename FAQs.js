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
        let data = {
            search_text: "",
            page_no: 0,
            page_size: 0
        }
        console.log(this.props.userData.token)
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
            <View style={ {
                flexDirection: "row",
                padding: 10,
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#A9DAD6"
            } }>
                <Text style={ { fontWeight: "600" } }>
                    { item.question }
                </Text>
                { expanded
                    ? <Icon style={ { fontSize: 18 } } name="remove-circle" />
                    : <Icon style={ { fontSize: 18 } } name="add-circle" /> }
            </View>
        );
    }
    _renderContent(item) {
        return (
            <Text
                style={ {
                    backgroundColor: "#e3f1f1",
                    padding: 10,
                    fontStyle: "italic",
                } }
            >
                { item.answer }
            </Text>
        );
    }
    render() {
        return (
            <View style={ [GlobalStyle.container, localStyle.container] }>
                <Header
                    style={ GlobalStyle.header }
                    androidStatusBarColor="#333"
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
                        <Text style={ GlobalStyle.headerTitle }>FAQs</Text>
                    </Body>
                    <Right>

                    </Right>
                </Header>
                <ScrollView>

                    <View style={ localStyle.innerContainer }>
                        <View style={ [GlobalStyle.card, localStyle.card, { flexDirection: 'row', justifyContent: 'space-between' }] }>

                            <Container>
                                <Header />
                                <Content padder style={ { backgroundColor: "white" } }>
                                    <Accordion
                                        dataArray={ this.state.faqData }
                                        animation={ true }
                                        expanded={ true }
                                        renderHeader={ this._renderHeader }
                                        renderContent={ this._renderContent }
                                    />
                                </Content>
                            </Container>
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
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        paddingVertical: Utils.moderateVerticalScale(10)
    },

    card: {
        margin: Utils.moderateScale(15),
        paddingVertical: Utils.moderateVerticalScale(10),
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
    console.log(state.appData.userData)
    return { userData: state.appData.userData };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FAQsScreen);