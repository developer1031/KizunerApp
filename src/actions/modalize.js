import {SHOW_MODALIZE, HIDE_MODALIZE} from './types';

export function showModalize(payload) {
  return {type: SHOW_MODALIZE, payload};
}

export function hideModalize() {
  return {type: HIDE_MODALIZE};
}
