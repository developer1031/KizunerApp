import {SHOW_MODALIZE, HIDE_MODALIZE, LOGOUT} from 'actions';

const INITIAL_STATE = {
  open: false,
  options: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_MODALIZE:
      return {
        ...state,
        open: true,
        options: action.payload,
      };
    case HIDE_MODALIZE:
      return {
        ...state,
        open: false,
        options: [],
      };
    case LOGOUT.SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }
}
