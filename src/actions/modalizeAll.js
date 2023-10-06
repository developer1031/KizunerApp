import {SHOW_MODALIZE_ALL, HIDE_MODALIZE_ALL} from './types';

export function showModalizeAll(payload) {
  return {type: SHOW_MODALIZE_ALL, payload};
}

export function hideModalizeAll() {
  return {type: HIDE_MODALIZE_ALL};
}
