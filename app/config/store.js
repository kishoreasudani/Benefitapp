import {applyMiddleware, createStore} from "redux";
import appReducer from '../reducers/index';

const store = createStore(appReducer, applyMiddleware(/*middleware, */));

export default store;
