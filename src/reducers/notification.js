import {
  GET_NOTI_LIST,
  UPDATE_FCM_TOKEN,
  UPDATE_NOTI_SETTING,
  GET_NOTI_SETTING,
  GET_NOTI_COUNT,
  READ_NOTI,
  DELETE_NOTI,
  LOGOUT,
  UPDATE_EMAIL_SETTING,
} from 'actions';

const INITIAL_STATE = {
  allow: true,
  allowEmail: false,
  beingUpdateFcmToken: false,
  beingUpdateSetting: false,
  beingUpdateEmailSetting: false,
  beingGetNotiSetting: false,
  list: [],
  listLoading: false,
  listLastPage: 1,
  count: 0,
  fcm_token: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DELETE_NOTI.SUCCESS:
      return {
        ...state,
        list: state.list.filter((i) => i.id !== action.payload.inputPayload.id),
        //count: 0,
      };
    case READ_NOTI.REQUEST:
      return {
        ...state,
        list: state.list.map((i) =>
          i.id === action.payload.inputPayload.id ? {...i, status: true} : i,
        ),
        //count: state.count > 0 ? state.count - 1 : 0,
      };
    case READ_NOTI.FAILURE:
      return {
        ...state,
        list: state.list.map((i) =>
          i.id === action.payload.id ? {...i, status: false} : i,
        ),
        //count: state.count + 1,
      };
    case GET_NOTI_COUNT.SUCCESS:
      return {
        ...state,
        count: action.payload.data.statistic,
      };
    case GET_NOTI_LIST.REQUEST:
      return {
        ...state,
        listLoading: true,
      };
    case GET_NOTI_LIST.SUCCESS:
      return {
        ...state,
        listLoading: false,
        listLastPage: action.payload.meta.pagination.total_pages,
        list:
          action.payload.meta.pagination.current_page === 1
            ? action.payload.data
            : [...state.list, ...action.payload.data],
      };
    case GET_NOTI_LIST.FAILURE:
      return {
        ...state,
        listLoading: false,
      };
    case UPDATE_FCM_TOKEN.REQUEST:
      return {
        ...state,
        beingUpdateFcmToken: true,
      };
    case UPDATE_FCM_TOKEN.SUCCESS:
      return {
        ...state,
        beingUpdateFcmToken: false,
        fcm_token: action?.payload?.inputPayload?.fcm_token,
      };
    case UPDATE_FCM_TOKEN.FAILURE:
      return {
        ...state,
        beingUpdateFcmToken: false,
      };
    case UPDATE_NOTI_SETTING.REQUEST:
      return {
        ...state,
        beingUpdateSetting: true,
        allow: action.payload.data.notification,
      };
    case UPDATE_NOTI_SETTING.SUCCESS:
      return {
        ...state,
        beingUpdateSetting: false,
        allow: action.payload.data.notification,
      };
    case UPDATE_NOTI_SETTING.FAILURE:
      return {
        ...state,
        beingUpdateSetting: false,
      };

    case UPDATE_EMAIL_SETTING.REQUEST:
      return {
        ...state,
        beingUpdateEmailSetting: true,
        allowEmail: action.payload.data.email_notification,
      };
    case UPDATE_EMAIL_SETTING.SUCCESS:
      return {
        ...state,
        beingUpdateEmailSetting: false,
        allowEmail: action.payload.data.email_notification,
      };
    case UPDATE_EMAIL_SETTING.FAILURE:
      return {
        ...state,
        beingUpdateEmailSetting: false,
      };
    case GET_NOTI_SETTING.REQUEST:
      return {
        ...state,
        beingGetNotiSetting: true,
      };
    case GET_NOTI_SETTING.SUCCESS:
      return {
        ...state,
        beingGetNotiSetting: false,
        allow: action.payload.data.notification,
        allowEmail: action.payload.data.email_notification,
      };
    case GET_NOTI_SETTING.FAILURE:
      return {
        ...state,
        beingGetNotiSetting: false,
      };
    case LOGOUT.SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
