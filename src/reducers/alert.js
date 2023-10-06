import {
  SHOW_ALERT,
  HIDE_ALERT,
  HIDE_ALL_ALERT,
  LOGOUT,
  TOGGLE_SHOW_TROPHY_MODAL,
} from 'actions';

const INITIAL_STATE = {
  list: [],
  alert: null,
  isShowModalTrophy: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_ALERT:
      return {
        ...state,
        alert: action.payload,
      };
    case HIDE_ALERT:
      return {
        ...state,
        alert: null,
      };
    // case SHOW_ALERT:
    //   return {
    //     ...state,
    //     list: [...state.list, action.payload],
    //   };
    // case HIDE_ALERT:
    //   return {
    //     ...state,
    //     list: state.list.filter(i => i.id !== action.payload),
    //   };
    // case HIDE_ALL_ALERT:
    //   return {
    //     ...state,
    //     list: [],
    //   };

    case TOGGLE_SHOW_TROPHY_MODAL:
      return {
        ...state,
        isShowModalTrophy: action.payload,
      };

    case LOGOUT.SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }
}
