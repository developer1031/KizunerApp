import React from 'react';
import { StackActions } from '@react-navigation/native';

export const navigationRef = React.createRef();

function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

function push(name, params) {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}

function goBack() {
  navigationRef.current?.goBack();
}

export const getActiveRouteName = (state) => {
  if (state) {
    const route = state.routes[state.index];
    console.log("_____--------", route)
    if (route.state) {
      return getActiveRouteName(route.state);
    }
    return route.name;
  }
};

export default {
  navigate,
  goBack,
  getActiveRouteName,
  push,
};
