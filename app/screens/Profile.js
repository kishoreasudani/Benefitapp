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
    Icon, Modal,
    PermissionsAndroid
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
import ImagePicker from 'react-native-image-picker';
import FAIcon from "react-native-vector-icons/FontAwesome";
import Loader from "../components/Loader";
import Snackbar from 'react-native-snackbar';
import DatePicker from "react-native-datepicker";
// create a component
const optionsImage = {
    title: 'Select or Click Photo',
    mediaType: 'photo',
    takePhotoButtonTitle: 'Take Photo',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
};
class ProfileScreen extends Component {
    _isMount = false;
    static navigationOptions = {
        header: null
    };

    constructor (props) {
        super(props);

        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        let hours = new Date().getHours();

        this.state = {
            username: '',
            file: "",
            password: '',
            txtDob: year + "/" + month + "/" + date,
            txtFirstName: "",
            txtLastName: "",
            txtMobileNo: "",
            avatar: "",
            id: "",
            dob: "",
            email: "",
            imageFullData: null,
            imageFullName: null,
            imageSource: null,
            imageSourceUri: null,
            imageData: null,
            imageType: null,
            imageExtension: null,
            modalVisible: false,
            ModalVisibleStatus: false,
            loading: true,
        }

        this.inputs = {};
        this.UpdateUserImage = this.UpdateUserImage.bind(this);
        this.UpdateUserProfile = this.UpdateUserProfile.bind(this);
        this.GetProfile = this.GetProfile.bind(this);

    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    componentDidMount() {
        this._isMount = true;
        this.GetProfile();

    }
    ShowModalFunction(visible) {
        this.setState({ ModalVisibleStatus: visible });
    }
    componentWillUnmount() {
        this._isMount = false;
    }
    GetProfile() {
        this.setState({
            txtFirstName: "",
            txtLastName: "",
            txtMobileNo: "",
            avatar: "",
            email: "",
            dob: "",
            txtDob: "",
            loading: true
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
                            var dateNew = "";
                            var dobNew = "";
                            let date = new Date().getDate();
                            let month = new Date().getMonth() + 1;
                            let year = new Date().getFullYear();
                            if (resultData.dob == "0000-00-00") {
                                dateNew = "",
                                    dobNew = ""
                            }
                            else {
                                dateNew = resultData.dob,
                                    dobNew = resultData.dob
                            }
                            this.setState({
                                txtFirstName: resultData.first_name,
                                txtLastName: resultData.last_name,
                                txtMobileNo: resultData.mobile,
                                avatar: resultData.avatar,
                                email: resultData.email,
                                dob: dobNew,
                                txtDob: dateNew,
                                id: resultData.id,
                                loading: false
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
                        loading: false
                    })
                }
            });
    }

    async selectFile() {
        ImagePicker.showImagePicker(optionsImage, (response) => {
            console.log("Response = ", response);
            let name = response.fileName;
            let ext;
            if (name === undefined) {
                ext = name;
            } else {
                ext = name
                    .split(".")
                    .pop()
                    .toLowerCase();
            }
            this.setState({
                imageExtension: ext,
                imageFullData: response,
                imageFullName: name,
                imageSource: response.uri,
                imageSourceUri: response.uri,
                imageData: response.data,
                imageType: response.type
            });
            this.selectedDocument = response.fileName;
            if (response.didCancel) {
                console.log("User cancelled file picker");
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
            } else {
                this.UpdateUserImage();
                this.setState({
                    file: response
                });
            }
        });
    }

    UpdateUserImage() {
        let doc = {
            uri: this.state.imageSourceUri,
            path: this.state.imageSource,
            type: this.state.imageType,
            name: this.state.imageFullName
        };
        let data = new FormData();
        data.append("id", this.props.userData.id);
        if (this.state.imageFullName == null) {
            data.append("avatar", this.props.userData.avatar);
        } else {
            data.append("avatar", doc);
        }
        // console.log('data', data);
        try {
            return fetch(URL.ImageURLProduction + 'wecontrol/uploadUserAvatar',
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "multipart/form-data",
                    },
                    body: data,
                })
                .then((response) => {
                    //  console.log(response)
                    response.json()
                })
                .then((result) => {
                    Utils.displayAlert("image Update successfully");
                    this.GetProfile();
                    return result;
                })
                .catch(error => console.warn(error));

        } catch (e) {
            console.debug(e);
        }
    }

    UpdateUserProfile() {
        check = true;
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var TCodeFirstName = this.state.txtFirstName;
        var TCodeLastName = this.state.txtLastName;
        msg = '';
        if (this.state.txtFirstName == '') {
            check = false;
            msg = 'Please enter first name';
        } else if (this.state.txtLastName == '') {
            check = false;
            msg = 'Please enter last name';
        } else if (this.state.txtMobileNo == '') {
            check = false;
            msg = 'Please enter mobile no';
        } else if (this.state.txtDob == '') {
            check = false;
            msg = 'Please enter Date Of Birth';
        }
        else if (/[^a-zA-Z0-9\-\/]/.test(TCodeFirstName)) {
            alert('first name is not alphanumeric.');
            return false;
        }

        else if (/[^a-zA-Z0-9\-\/]/.test(TCodeLastName)) {
            alert('last name is not alphanumeric.');
            return false;
        }

        if (check == false) {
            Snackbar.show({
                title: msg,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "Red",
            });
        } else {
            this.setState({
                loading: true
            }, () => {
                this.UpdateProfile();
            })
        }
    }

    UpdateProfile() {
        let data = {
            "id": this.props.userData.id,
            "first_name": this.state.txtFirstName,
            "last_name": this.state.txtLastName,
            "mobile": this.state.txtMobileNo,
            "dob": this.state.txtDob,
        };
        console.log('data', data);
        this.setState({
            loading: false
        })

        try {
            this.setState({ loading: true });
            Utils.makeApiRequest(URL.API_URL.updateProfile.url, URL.API_URL.updateProfile.endPoint,
                data, { authorization: this.props.userData.token }, "PUT")
                .then(result => {
                    if (this._isMount) {
                        this.setState({ loading: false });
                        if (result === false || typeof result !== "object") {
                            this.setState({ loading: false }, () => {
                                Utils.displayAlert("Oops!", "Something went wrong. Please try again.");
                            });
                        } else if (result) {
                            Utils.displayAlert("Profile updated successfully");
                            this.setState({ loading: false }, () => {
                                this.ShowModalFunction(false);
                                this.GetProfile();
                            });
                            // _this.setState({ disable: false }, () => {
                            //     _this.GetProfile();
                            // });
                        } else {
                            this.setState({ loading: false }, () => {
                                Utils.displayAlert("Oops!", result.msg || "Invalid Request");
                            });
                        }
                    }
                    else { this.setState({ loading: false }); }
                });
        } catch (e) {
            console.debug(e);
            this.setState({ loading: false });
        }
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
                        {/* onPress={() => this.props.navigation.goBack()} */ }
                        <TouchableOpacity onPress={ () => this.props.navigation.navigate('Home',
                            {
                                refreshing: true
                            }) }>
                            <FAIcon
                                name="arrow-left"
                                style={ {
                                    color: "white",
                                    fontSize: Utils.moderateScale(15),
                                } }
                            />
                        </TouchableOpacity>
                    </Left>
                    <Body style={ GlobalStyle.headerBody }>
                        <Text style={ GlobalStyle.headerTitle }>PROFILE</Text>
                    </Body>
                    <Right style={ { flex: 1 } }>
                    </Right>
                </Header>

                {/* onPress={() => this.props.navigation.navigate("ChangePassword")} */ }
                <View style={ localStyle.innerContainer }>
                    <View style={ [GlobalStyle.card, localStyle.card] }>
                        <ScrollView style={ { color: "#272727", width: '100%', } }>
                            <View >
                                <LinearGradient start={ { x: 0, y: 0 } } end={ { x: 1, y: 0 } }
                                    colors={ ['#70bf51', '#54c18d', '#3cc4f5'] }
                                    style={ {
                                        width: '100%', height: Utils.moderateVerticalScale(100),
                                        paddingTop: Utils.moderateVerticalScale(10),
                                        borderTopLeftRadius: Utils.moderateScale(Platform.OS == "android" ? 15 : 8),
                                        borderTopRightRadius: Utils.moderateScale(Platform.OS == "android" ? 15 : 8),
                                    } } >

                                    <TouchableOpacity onPress={ () => { this.ShowModalFunction(true) } } >
                                        <View style={ {
                                            paddingTop: Utils.moderateVerticalScale(15),
                                        } }>
                                            <FAIcon
                                                name="edit"
                                                style={ {
                                                    color: "black",
                                                    fontSize: Utils.moderateScale(15),
                                                    //bottom: Utils.moderateVerticalScale(10),
                                                    paddingTop: Utils.moderateVerticalScale(7),
                                                    borderRadius: Utils.moderateVerticalScale(20),
                                                    textAlign: "center",
                                                    position: "absolute",
                                                    // borderColor: "#000",
                                                    backgroundColor: "#61AABF",
                                                    lineHeight: Utils.moderateVerticalScale(25),
                                                    height: Utils.moderateVerticalScale(40),
                                                    width: Utils.moderateVerticalScale(40),
                                                    // borderWidth: 1,
                                                    zIndex: 1,
                                                    right: Utils.moderateVerticalScale(10),
                                                } }
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </LinearGradient>
                                <View style={ {
                                    justifyContent: 'center', alignContent: 'flex-end',
                                    alignItems: 'center', position: "relative", zIndex: 0
                                } }>
                                    { this.state.avatar != null && this.state.avatar != "" ? (
                                        <Image
                                            source={ {
                                                uri: URL.ImageURLProduction + "data/user/" + this.state.id + "/" + this.state.avatar
                                            } }
                                            style={ {
                                                width: Utils.moderateVerticalScale(100),
                                                height: Utils.moderateVerticalScale(100),
                                                borderRadius: Utils.moderateVerticalScale(100 / 2),
                                                borderColor: "#fff",
                                                borderWidth: 1,
                                                alignItems: "center",
                                                resizeMode: "cover",
                                                zIndex: 0,
                                                marginTop: Utils.moderateVerticalScale(-60)
                                            } }
                                        />
                                    ) : (
                                            <Image
                                                source={ require("../assets/Images/img/user-icon.png") }
                                                style={ {
                                                    width: Utils.moderateVerticalScale(100),
                                                    height: Utils.moderateVerticalScale(100),
                                                    borderRadius: Utils.moderateVerticalScale(100 / 2),
                                                    borderColor: "#fff",
                                                    borderWidth: 1,
                                                    alignItems: "center",
                                                    resizeMode: "cover",
                                                    zIndex: 0,
                                                    marginTop: Utils.moderateVerticalScale(-60)
                                                } }
                                            />
                                        ) }

                                    <TouchableOpacity
                                        onPress={ () => {
                                            this.selectFile();
                                        } }
                                    >
                                        <FAIcon
                                            name="camera"
                                            style={ {
                                                color: "green",
                                                fontSize: Utils.moderateScale(15),
                                                bottom: Utils.moderateVerticalScale(10),
                                                borderRadius: Utils.moderateVerticalScale(20),
                                                textAlign: "center",
                                                borderColor: "#fff",
                                                backgroundColor: "#000",
                                                lineHeight: Utils.moderateVerticalScale(30),
                                                height: Utils.moderateVerticalScale(30),
                                                width: Utils.moderateVerticalScale(30),
                                                borderWidth: 1,
                                                // right: -60,
                                                //position: "absolute",
                                                zIndex: 1
                                            } }
                                        />
                                    </TouchableOpacity>

                                    <View style={ { marginTop: Utils.moderateVerticalScale(20), } }>
                                        <Text style={ {
                                            fontFamily: 'Khand-Regular',
                                            fontSize: Utils.moderateVerticalScale(18),
                                            color: "#fff", marginVertical: Utils.moderateVerticalScale(5)
                                        } }>
                                            { this.state.txtFirstName } { " " }
                                            { this.state.txtLastName }
                                        </Text>
                                    </View>
                                </View>
                                <View style={ {
                                    height: Utils.moderateVerticalScale(0.5),
                                    width: '100%', backgroundColor: "#525252",
                                    marginVertical: Utils.moderateVerticalScale(25)
                                } } />
                            </View>
                            <View  >
                                <View style={ localStyle.formGroup } >
                                    <View style={ { paddingLeft: 5, paddingRight: 35, paddingTop: 40 } }>
                                        <Image
                                            source={ require("../assets/Images/img/mobile-number.png") }
                                            style={ {
                                                width: Utils.moderateVerticalScale(40),
                                                height: Utils.moderateVerticalScale(40),
                                                borderRadius: 40 / 2,
                                                alignItems: "center"
                                            } }
                                        />
                                    </View>
                                    <View style={ localStyle.textContainer }>
                                        <Text style={ localStyle.formLabel }>MOBILE NUMBER</Text>
                                        <Text style={ localStyle.input }>
                                            +91  { this.state.txtMobileNo }
                                        </Text>

                                    </View>
                                </View>
                            </View>
                            <View style={ localStyle.formGroup } >
                                <View style={ { paddingLeft: 10, paddingRight: 35, paddingTop: 40 } }>
                                    <Image
                                        source={ require("../assets/Images/img/email.png") }
                                        style={ {
                                            width: Utils.moderateVerticalScale(35),
                                            height: Utils.moderateVerticalScale(35),
                                            borderRadius: 40 / 2,
                                            alignItems: "center"
                                        } }
                                    />
                                </View>
                                <View style={ localStyle.textContainer }>
                                    <Text style={ localStyle.formLabel }>EMAIL ID</Text>
                                    <Text style={ localStyle.input }>
                                        { this.state.email }
                                    </Text>

                                </View>
                            </View>
                            <View style={ localStyle.formGroup } >
                                <View style={ { paddingLeft: 10, paddingRight: 35, paddingTop: 40 } }>
                                    <Image
                                        source={ require("../assets/Images/img/date-of-birth.png") }
                                        style={ {
                                            width: Utils.moderateVerticalScale(35),
                                            height: Utils.moderateVerticalScale(35),
                                            borderRadius: 40 / 2,
                                            alignItems: "center"
                                        } }
                                    />
                                </View>
                                <View style={ localStyle.textContainer }>
                                    <Text style={ localStyle.formLabel }>DATE OF BIRTH</Text>
                                    { this.state.dob ?
                                        <Text style={ localStyle.input }>{ this.state.dob } </Text>
                                        : null
                                    }
                                    {/* <Text style={ localStyle.input }>{ this.state.dob } </Text> */ }
                                </View>
                            </View>
                            <View style={ {
                                height: Utils.moderateVerticalScale(0.5),
                                width: '100%', backgroundColor: "#525252",
                                marginVertical: Utils.moderateVerticalScale(15)
                            } } />
                            <LinearGradient
                                start={ { x: 0, y: 0 } }
                                end={ { x: 1, y: 0 } }
                                colors={ ['#70bf51', '#54c18d', '#3cc4f5'] }
                                style={ localStyle.buttonContainer2 }>
                                <TouchableOpacity onPress={ () => this.props.navigation.navigate("ChangePassword") } style={ { width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center', height: '100%' } }>
                                    <Text style={ { fontFamily: 'Khand-Regular' } }>CHANGE PASSWORD</Text>
                                </TouchableOpacity>
                            </LinearGradient>

                            {/* <LinearGradient
                                start={ { x: 0, y: 0 } }
                                end={ { x: 1, y: 0 } }
                                colors={ ['#70bf51', '#54c18d', '#3cc4f5'] }
                                style={ localStyle.buttonContainer1 }>
                                <TouchableOpacity onPress={ () => this.props.navigation.navigate("MyCoins") } style={ { width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center', height: '100%' } }>
                                    <Text style={ { fontFamily: 'Khand-Regular' } }>MY REWARDS</Text>
                                </TouchableOpacity>
                            </LinearGradient> */}
                            <View style={ { height: 30 } }></View>
                        </ScrollView>
                    </View>
                </View>
                <Modal
                    transparent={ true }
                    animationType={ "slide" }
                    visible={ this.state.ModalVisibleStatus }
                    onRequestClose={ () => { this.ShowModalFunction(!this.state.ModalVisibleStatus) } } >
                    <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#25232354' } }>
                        <View style={ localStyle.ModalInsideView }>
                            <TouchableOpacity onPress={ () => { this.ShowModalFunction(false) } }>
                                <Text style={ localStyle.close }>
                                    X
                                </Text>
                            </TouchableOpacity>

                            <Text style={ localStyle.TextStyle1 }>
                                Update Profile
                                </Text>
                            <ScrollView style={ {
                                width: "100%",
                                height: Utils.moderateVerticalScale(250),
                            } }>
                                <View>
                                    <Text style={ localStyle.TextStyle2 }>FIRST NAME</Text>
                                    <TextInput
                                        value={ this.state.txtFirstName }
                                        onChangeText={ txtFirstName =>
                                            this.setState({ txtFirstName: txtFirstName })
                                        }
                                        returnKeyType="next"
                                        style={ localStyle.input1 }
                                        placeholder="First Name"
                                        placeholderTextColor="#555555"
                                        autoCapitalize="none"
                                        ref={ input => (this.inputs["txtFirstName"] = input) }
                                        underlineColorAndroid="transparent"
                                    />
                                </View>

                                <Text style={ localStyle.TextStyle2 }>LAST NAME</Text>
                                <TextInput
                                    value={ this.state.txtLastName }
                                    onChangeText={ txtLastName =>
                                        this.setState({ txtLastName: txtLastName })
                                    }
                                    returnKeyType="next"
                                    style={ localStyle.input1 }
                                    placeholder="Last Name"
                                    placeholderTextColor="#555555"
                                    autoCapitalize="none"
                                    ref={ input => (this.inputs["txtLastName"] = input) }
                                    underlineColorAndroid="transparent"
                                />
                                <Text style={ localStyle.TextStyle2 }>MOBILE NO</Text>
                                <TextInput
                                    value={ this.state.txtMobileNo }
                                    onChangeText={ txtMobileNo =>
                                        this.setState({ txtMobileNo: txtMobileNo })
                                    }
                                    returnKeyType="next"
                                    maxLength={ 10 }
                                    keyboardType="numeric"
                                    style={ localStyle.input1 }
                                    placeholder="Mobile No"
                                    placeholderTextColor="#555555"
                                    autoCapitalize="none"
                                    ref={ input => (this.inputs["txtMobileNo"] = input) }
                                    underlineColorAndroid="transparent"
                                />

                                <Text style={ localStyle.TextStyle2 }>Date Of Birth</Text>

                                <DatePicker
                                    style={ localStyle.input1 }
                                    date={ this.state.txtDob }
                                    mode="date"
                                    placeholder="Date Of Birth"
                                    is12Hour={ true }
                                    format="YYYY-MM-DD"
                                    //minDate={}
                                    visible="false"
                                    hideExtraDays={ true }
                                    firstDay={ 1 }
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={ {
                                        dateIcon: {
                                            left: 0,
                                            display: "none",
                                            marginLeft: 0
                                        },
                                        dateInput: {
                                            marginLeft: Utils.moderateVerticalScale(-220),
                                            borderWidth: 0
                                        }
                                    } }
                                    onDateChange={ txtDob => {
                                        this.setState({
                                            txtDob: txtDob
                                        });
                                    } }
                                />

                            </ScrollView>
                            <View style={ { width: "100%" } }>
                                <LinearGradient
                                    start={ { x: 0, y: 0 } }
                                    end={ { x: 1, y: 0 } }
                                    colors={ ['#70bf51', '#54c18d', '#3cc4f5'] }
                                    style={ localStyle.buttonContainer1 }>
                                    <TouchableOpacity onPress={ () => this.UpdateUserProfile() }
                                        style={ {
                                            width: '100%', alignContent: 'center', justifyContent: 'center',
                                            alignItems: 'center', height: '100%'
                                        } }>
                                        <Text style={ {} }>Update Profile</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>
                        </View>
                    </View>
                </Modal>
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
    close: {
        alignItems: 'center',
        color: '#000',
        marginLeft: Utils.moderateVerticalScale(20),
        fontSize: Utils.moderateVerticalScale(20),
        marginTop: Utils.moderateVerticalScale(5)

    },
    TextStyle1: {
        alignItems: 'center',
        color: '#000',
        marginLeft: Utils.moderateVerticalScale(125),
        marginTop: Utils.moderateVerticalScale(20)

    },
    TextStyle2: {
        justifyContent: 'center',
        alignItems: 'center',
        color: '#000',
        fontFamily: "Khand-Regular",
        marginLeft: Utils.moderateVerticalScale(25),
        marginTop: Utils.moderateVerticalScale(18),
        // lineHeight: Utils.moderateVerticalScale(15)
    },

    input1: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Utils.moderateVerticalScale(2),
        marginLeft: Utils.moderateVerticalScale(16),
        color: "#000",
        width: "90%",
        fontFamily: "Khand-Regular",
        padding: Utils.moderateVerticalScale(5),
        borderColor: '#000',
        margin: Utils.moderateVerticalScale(5),
        marginRight: Utils.moderateVerticalScale(50),
        borderWidth: 1
    },
    ModalInsideView: {
        backgroundColor: "white",
        width: '90%',
        height: '80%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#000",
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',

    },
    card: {
        margin: Utils.moderateScale(15),
        backgroundColor: '#272727',
        flex: 0,
        justifyContent: 'center',
        alignContent: 'center',
    },
    MainContainer: {
        flex: 1,
        paddingTop: Utils.moderateVerticalScale(20),
        alignItems: "center",
        marginTop: Utils.moderateVerticalScale(50),
        justifyContent: "center"
    },
    input: {
        marginTop: Utils.moderateVerticalScale(-8),
        fontSize: Utils.moderateVerticalScale(16),
        color: "#fff",
        padding: Utils.moderateVerticalScale(4),
        marginLeft: Utils.moderateVerticalScale(10),
    },
    formGroup: {
        flex: 1,
        marginLeft: Utils.moderateVerticalScale(15),
        flexDirection: "row"
    },
    textContainer: {
        alignItems: 'center',
        color: '#555555',
        marginLeft: Utils.moderateVerticalScale(-30),
        alignSelf: 'stretch',
        paddingTop: Utils.moderateVerticalScale(30),
    },
    formLabel: {
        alignItems: 'center',
        color: '#555555',
        marginTop: Utils.moderateVerticalScale(2),
        marginLeft: Utils.moderateVerticalScale(10),
        alignSelf: 'stretch',
        padding: Utils.moderateVerticalScale(3),
        margin: Utils.moderateVerticalScale(2),

    },
    buttonContainer2: {
        height: Utils.moderateVerticalScale(50),
        width: "90%",
        marginLeft: Utils.moderateVerticalScale(17),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Utils.moderateVerticalScale(50),
    },
    buttonContainer1: {
        marginVertical: Utils.moderateVerticalScale(10),
        height: Utils.moderateVerticalScale(50),
        width: "90%",
        marginLeft: Utils.moderateVerticalScale(20),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Utils.moderateVerticalScale(50),
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
)(ProfileScreen);    