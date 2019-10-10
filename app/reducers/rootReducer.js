import {ActionTypes} from "../actions/index";

const initialState = {
  appData: {
    notificationCount: 0,
    firstTimeUser: true,
    userData: {},
    currentRole: {}
  }
};

const userData = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOGGED_IN_USER_DATA:
      return action.data;
    case ActionTypes.SET_GUEST_USER_DATA:
      return action.data;
    case ActionTypes.UPDATE_DEVICE_TOKEN:
      return {...state, deviceToken: action.data};
    case ActionTypes.UPDATE_USER_DATA:
      return {...state, ...action.data};
    case ActionTypes.UPDATE_GUEST_USER_DATA:
      return {...state, ...action.data};
    default:
      return state;
  }
};

const currentRole = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_ROLE:
      return action.data;
    default:
      return state;
  }
};

const rootReducer = (state = initialState, action) => {
  let newState = {
    userData: userData(state.userData, action),
    notificationCount: state.notificationCount,
    firstTimeUser: state.firstTimeUser,
    currentRole: currentRole(state.currentRole, action),
  };

  if (action.type == ActionTypes.SET_INITIAL_STATE) {
    newState = Object.assign(newState, action.data);
  }
  return newState;
};

export default rootReducer;
