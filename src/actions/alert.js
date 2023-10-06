import uuid from 'uuid/v4';
import {
  SHOW_ALERT,
  HIDE_ALERT,
  HIDE_ALL_ALERT,
  TOGGLE_SHOW_TROPHY_MODAL,
} from './types';

export function showAlert(data) {
  return {type: SHOW_ALERT, payload: {...data, id: uuid()}};
}

export function hideAlert(id) {
  return {type: HIDE_ALERT, payload: id};
}

export function hideAllAlert() {
  return {type: HIDE_ALL_ALERT};
}

export const toggleIsShowTrophyModal = isShow => {
  return dispatch => {
    dispatch({type: TOGGLE_SHOW_TROPHY_MODAL, payload: isShow});
  };
};
