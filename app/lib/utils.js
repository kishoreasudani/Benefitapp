import React from "react";
import {
  AsyncStorage,
  Dimensions,
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import * as Enums from "../lib/enums";
import * as URL from "../config/urls";
import { Config } from "../config/appConfig";
import DialogManager, { DialogContent, ScaleAnimation } from "react-native-dialog-component";
import { Images } from "../assets/Images/index";

const { width, height } = Dimensions.get("window");

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.25) =>
  size + (scale(size) - size) * factor;
const moderateVerticalScale = (size, factor = 0.25) =>
  size + (verticalScale(size) - size) * factor;

function siteUrl(endpoint = "guest") {
  return URL.API_BASE_URL + endpoint + "/";
}

const ItemsPerPage = 10;

function displayAlert(
  title = "",
  messageText = "",
  buttonText = "OK",
  callbackOnOk = null,
  cancelable = false,
  cancelableText = "Cancel",
  dismissOnBackPress = true,
  hasIcon = false,
  icon = Images.alert
) {
  const displayAlertStyle = StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: "#ffffff"
    },
    heading: {
      textAlign: "center",
      color: "#3CB371",
      fontWeight: "bold",
      fontSize: moderateScale(18)
    },
    messageContainer: {
      marginTop: moderateScale(10),
      width: "85%",
      marginBottom: moderateScale(10)
    },
    messageText: {
      textAlign: "center",
      fontWeight: "bold",
      color: "#333",
      fontSize: moderateScale(16)
    },
    acceptButton: {
      height: moderateVerticalScale(40),
      width: "40%",
      marginHorizontal: moderateScale(10),
      backgroundColor: "#54c18d",
      borderRadius: moderateScale(4),
      justifyContent: "center",
      alignItems: "center"
    },
    cancelButton: {
      height: moderateVerticalScale(40),
      width: "40%",
      marginHorizontal: moderateScale(10),
      backgroundColor: "#ffff",
      borderRadius: moderateScale(4),
      borderColor: "#BDBDBD",
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    acceptButtonText: {
      color: "#333333",
      fontWeight: "bold",
      fontSize: moderateScale(14)
    },
    cancelButtonText: {
      color: "#333333",
      fontWeight: "bold",
      fontSize: moderateScale(14)
    }
  });
  DialogManager.show(
    {
      haveTitleBar: false,
      width: width - scale(50),
      overlayOpacity: 0.4,
      dialogAnimation: new ScaleAnimation(),
      overlayBackgroundColor: "rgb(0, 0, 0)",
      dismissOnHardwareBackPress: dismissOnBackPress,
      dialogStyle: { borderRadius: 10, width: "90%", padding: 0 },
      children: (
        <DialogContent
          contentStyle={ { borderRadius: 10, padding: 0, margin: 0 } }
        >
          <View
            style={ [
              displayAlertStyle.container,
              { borderRadius: 10, margin: 0, paddingHorizontal: 0 }
            ] }
          >
            <View
              style={ {
                padding: moderateScale(20),
                marginVertical: moderateVerticalScale(5),
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              } }
            >
              { hasIcon ? (
                <View
                  style={ {
                    height: moderateScale(45),
                    width: moderateScale(45),
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "transparent"
                  } }
                >
                  <Image
                    source={ icon }
                    resizeMode="contain"
                    style={ {
                      height: moderateScale(40),
                      width: moderateScale(40)
                    } }
                  />
                </View>
              ) : (
                  <Text style={ displayAlertStyle.heading }>{ title }</Text>
                ) }
              <View style={ displayAlertStyle.messageContainer }>
                <Text style={ displayAlertStyle.messageText }>{ messageText }</Text>
              </View>
            </View>
            <View
              style={ {
                justifyContent: "space-evenly",
                alignContent: "center",
                alignItems: "center",
                width: "100%",
                marginHorizontal: 0,
                flexDirection: "row",
                marginBottom: 0,
                borderTopColor: "#bdbdbd",
                borderTopWidth: 1,
                height: moderateVerticalScale(80)
              } }
            >
              { cancelable ? (
                <TouchableOpacity
                  onPress={ () => {
                    DialogManager.dismissAll(() => {
                    });
                  } }
                  style={ displayAlertStyle.cancelButton }
                >
                  <Text style={ displayAlertStyle.cancelButtonText }>
                    { cancelableText.toUpperCase() }
                  </Text>
                </TouchableOpacity>
              ) : null }
              <TouchableOpacity
                onPress={ () => {
                  DialogManager.dismissAll(() => {
                    typeof callbackOnOk === "function" && callbackOnOk();
                  });
                } }
                style={ displayAlertStyle.acceptButton }
              >
                <Text style={ displayAlertStyle.acceptButtonText }>
                  { buttonText.toUpperCase() }
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </DialogContent>
      )
    },
    () => {
      // callback for show
    }
  );
}

function displayAlertRewards(
  title = "",
  messageText = "",
  buttonText = "OK",
  callbackOnOk = null,
  cancelable = false,
  cancelableText = "Cancel",
  dismissOnBackPress = true,
  hasIcon = false,
  icon = Images.alert
) {
  const displayAlertStyle = StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: "#ffffff"
    },
    heading: {
      textAlign: "center",
      color: "#3CB371",
      fontWeight: "bold",
      fontSize: moderateScale(18)
    },
    messageContainer: {
      marginTop: moderateScale(10),
      width: "85%",
      marginBottom: moderateScale(10)
    },
    messageText: {
      textAlign: "center",
      fontWeight: "bold",
      color: "#333",
      fontSize: moderateScale(16)
    },
    acceptButton: {
      height: moderateVerticalScale(40),
      width: "40%",
      marginHorizontal: moderateScale(10),
      backgroundColor: "#54c18d",
      borderRadius: moderateScale(4),
      justifyContent: "center",
      alignItems: "center"
    },
    cancelButton: {
      height: moderateVerticalScale(40),
      width: "40%",
      marginHorizontal: moderateScale(10),
      backgroundColor: "#ffff",
      borderRadius: moderateScale(4),
      borderColor: "#BDBDBD",
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    acceptButtonText: {
      color: "#333333",
      fontWeight: "bold",
      fontSize: moderateScale(14)
    },
    cancelButtonText: {
      color: "#333333",
      fontWeight: "bold",
      fontSize: moderateScale(14)
    }
  });
  DialogManager.show(
    {
      haveTitleBar: false,
      width: width - scale(50),
      overlayOpacity: 0.4,
      dialogAnimation: new ScaleAnimation(),
      overlayBackgroundColor: "rgb(0, 0, 0)",
      dismissOnHardwareBackPress: dismissOnBackPress,
      dialogStyle: { borderRadius: 10, width: "90%", padding: 0 },
      children: (
        <DialogContent
          contentStyle={ { borderRadius: 10, padding: 0, margin: 0 } }
        >
          <View
            style={ [
              displayAlertStyle.container,
              { borderRadius: 10, margin: 0, paddingHorizontal: 0 }
            ] }
          >
            <View
              style={ {
                padding: moderateScale(20),
                marginVertical: moderateVerticalScale(5),
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center"
              } }
            >
              { hasIcon ? (
                <View
                  style={ {
                    height: moderateScale(45),
                    width: moderateScale(45),
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "transparent"
                  } }
                >
                  <Image
                    source={ icon }
                    resizeMode="contain"
                    style={ {
                      height: moderateScale(100),
                      width: moderateScale(100)
                    } }
                  />
                </View>
              ) : (
                  <Text style={ displayAlertStyle.heading }>{ title }</Text>
                ) }
              <View style={ displayAlertStyle.messageContainer }>
                <Text style={ displayAlertStyle.messageText }>{ messageText }</Text>
              </View>
            </View>
            <View
              style={ {
                justifyContent: "space-evenly",
                alignContent: "center",
                alignItems: "center",
                width: "100%",
                marginHorizontal: 0,
                flexDirection: "row",
                marginBottom: 0,
                borderTopColor: "#bdbdbd",
                borderTopWidth: 1,
                height: moderateVerticalScale(80)
              } }
            >
              {/* { cancelable ? (
                <TouchableOpacity
                  onPress={ () => {
                    DialogManager.dismissAll(() => {
                    });
                  } }
                  style={ displayAlertStyle.cancelButton }
                >
                  <Text style={ displayAlertStyle.cancelButtonText }>
                    { cancelableText.toUpperCase() }
                  </Text>
                </TouchableOpacity>
              ) : null } */}
              <TouchableOpacity
                onPress={ () => {
                  DialogManager.dismissAll(() => {
                    typeof callbackOnOk === "function" && callbackOnOk();
                  });
                } }
                style={ displayAlertStyle.acceptButton }
              >
                <Text style={ displayAlertStyle.acceptButtonText }>
                  { buttonText.toUpperCase() }
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </DialogContent>
      )
    },
    () => {
      // callback for show
    }
  );
}

function getFormBody(data) {
  let formBody = [];
  for (let property in data) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}

function stripTrailingSlash(str) {
  if (str.substr(-1) === '/') {
    return str.substr(0, str.length - 1);
  }
  return str;
}

async function makeApiRequest(url, endpoint = null, data, headers = {}, method = "POST", isRaw = false, isJson = true, altURL = null, isFile = false) {
  let body = isRaw ? data : isJson ? JSON.stringify(data) : getFormBody(data);
  headers["Accept"] = "application/json";
  headers["Content-Type"] = isRaw ? "multipart/form-data" : isJson ? "application/json" : "application/x-www-form-urlencoded";
  let baseURL = altURL != null ? altURL : siteUrl(endpoint);
  baseURL = (endpoint != null && altURL != null) ? baseURL + endpoint + "/" : baseURL;
  printLog(baseURL + url);
  printLog({
    method: method,
    headers: headers,
    body: body
  });
  return fetch((url ? baseURL : stripTrailingSlash(baseURL)) + (url ? url : ''), {
    method: method,
    headers: headers,
    body: body,
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(JSON.stringify(data));
      if (data === false || typeof data !== "object") {
        displayAlert("", "Something went wrong. Please try again.", "okay", null, false, "", true, true, Images.alert);
        return false;
      } else if (data.statusCode != 200) {
        displayAlert("", data.message, "okay", null, false, "", true, true, Images.alert);
        return false;
      } else {
        return data;
      }
    })
    .catch(e => {
      console.log(e);
      try {
        const error = JSON.parse(e.message);
        displayAlert("", error.message, "okay", null, false, "", true, true, Images.alert);
      } catch (e) {
        displayAlert("", "Something went wrong. Please contact the administrator", "okay", null, false, "", true, true, Images.alert);
      }
      return false;
    });
}

async function getStateAsyncStorage(item) {
  try {
    let savedState = await AsyncStorage.getItem(item);
    if (savedState !== null) {
      let parsedState = await JSON.parse(savedState);
      return parsedState;
    } else {
      return false;
    }
  } catch (error) {
    printLog("Error occurred while retrieving state. Error: " + error);
    return false;
  }
}

async function saveStateAsyncStorage(data) {
  try {
    await AsyncStorage.setItem("appData", JSON.stringify(data));
    return true;
  } catch (error) {
    printLog("Error occurred while saving state. Error: " + error);
    return false;
  }
}

async function requestStoragePermission() {

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        'title': 'BENEFIT',
        'message': 'This application need to access your storage to save local data.'
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {

    }
  } catch (err) {
    console.log('Permission Error', err)
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'BENEFIT',
        'message': 'This application needs access to your location.'
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    }
  } catch (err) {
    console.log('Permission Error', err)
  }

  try {
    const permissions = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ]);
    if (
      permissions[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED && permissions[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    printLog(err);
    return false;
  }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function printLog(...body) {
  return Config.Production == false && console.log(...body)
}

function toUpperCaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

//get utc date time stamp
function getUTCTimestamp(date) {
  var d1 = date;
  var utcDate = d1.toUTCString();
  var timeStamp = new Date(utcDate).getTime() / 1000;
  return Math.floor(timeStamp);
}

//get utc date time stamp
function convertTimestampToUTCDate(timeStamp) {
  var date = new Date(timeStamp * 1000);
  return date.toUTCString();
}


function localDate(date) {
  let dateObj = new Date(convertTimestampToUTCDate(date));
  const month = dateObj.getMonth(); //months from 1-12
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return Enums.ShortMonths[month] + " " + day + ', ' + year;
}

export {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  width,
  height,
  siteUrl,
  displayAlert,
  displayAlertRewards,
  saveStateAsyncStorage,
  getStateAsyncStorage,
  makeApiRequest,
  getFormBody /*, isTablet, isEmpty*/,
  ItemsPerPage,
  requestStoragePermission,
  getKeyByValue,
  printLog,
  toUpperCaseFirst,
  getUTCTimestamp,
  convertTimestampToUTCDate,
  localDate,
  wait
};
