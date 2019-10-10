/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry, YellowBox } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
console.disableYellowBox = true;
YellowBox.ignoreWarnings(["Warning: ..."]);
AppRegistry.registerComponent(appName, () => App);
