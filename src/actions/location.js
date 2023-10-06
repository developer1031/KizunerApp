import {UPDATE_LOCATION, UPDATE_ADDRESS} from './types';

export function updateLocationRequest() {
  return {type: UPDATE_LOCATION.REQUEST};
}

export function updateLocationSuccess(payload) {
  return {type: UPDATE_LOCATION.SUCCESS, payload};
}

export function updateLocationFailure(payload) {
  return {type: UPDATE_LOCATION.FAILURE, payload};
}

export function updateAddressRequest() {
  return {type: UPDATE_ADDRESS.REQUEST};
}

export function updateAddressSuccess(payload) {
  return {type: UPDATE_ADDRESS.SUCCESS, payload};
}

export function updateAddressFailure(payload) {
  return {type: UPDATE_ADDRESS.FAILURE, payload};
}
