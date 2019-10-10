import {combineReducers} from "redux";
import rootReducer from "./rootReducer";

const appReducer = combineReducers({
  appData: rootReducer
});

export default appReducer;
