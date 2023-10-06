import {SHOW_MODALIZE_ALL, HIDE_MODALIZE_ALL} from 'actions';

const INITIAL_STATE = {
  open: false,
  options: [],
  selected: [],
  onApply: null,
  onClear: null,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_MODALIZE_ALL:
      return {
        ...state,
        open: true,
        options: action.payload.options,
        selected: action.payload.selected,
        onApply: action.payload.onApply,
        onClear: action.payload.onClear,
      };
    case HIDE_MODALIZE_ALL:
      return {
        ...state,
        open: false,
        options: [],
        selected: [],
        onApply: null,
        onClear: null,
      };
    default:
      return state;
  }
}
