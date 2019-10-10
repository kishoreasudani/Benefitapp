// action types
export const ActionTypes = {
  SET_INITIAL_STATE: "SET_INITIAL_STATE",
  SET_LOGGED_IN_USER_DATA: "SET_LOGGED_IN_USER_DATA",
  SET_GUEST_USER_DATA: "SET_GUEST_USER_DATA",
  UPDATE_DEVICE_TOKEN: "UPDATE_DEVICE_TOKEN",
  UPDATE_USER_DATA: "UPDATE_USER_DATA",
  UPDATE_GUEST_USER_DATA: "UPDATE_GUEST_USER_DATA",
  SET_CURRENT_ROLE: "SET_CURRENT_ROLE",
};

// action creators
function setInitialState(data) {
  return {type: ActionTypes.SET_INITIAL_STATE, data: data};
}

function setLoggedInUserData(data) {
  return {type: ActionTypes.SET_LOGGED_IN_USER_DATA, data: data};
}

function setGuestUserData(data) {
  return {type: ActionTypes.SET_GUEST_USER_DATA, data: data};
}

function updateDeviceToken(data) {
  return {type: ActionTypes.UPDATE_DEVICE_TOKEN, data: data};
}

function updateUserData(data) {
  return {type: ActionTypes.UPDATE_USER_DATA, data: data};
}

function updateGuestUserData(data) {
  return {type: ActionTypes.UPDATE_GUEST_USER_DATA, data: data};
}

function setCurrentRole(data) {
  return {type: ActionTypes.SET_CURRENT_ROLE, data: data};
}

export const ActionCreators = {
  setInitialState: setInitialState,
  setLoggedInUserData: setLoggedInUserData,
  setGuestUserData: setGuestUserData,
  setCurrentRole: setCurrentRole,
  updateDeviceToken: updateDeviceToken,
  updateUserData: updateUserData,
  updateGuestUserData: updateGuestUserData,
};
