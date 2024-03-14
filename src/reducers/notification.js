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
  UPDATE_NOTI_HANGOUT_HELP,
  UPDATE_NOTI_MESSAGE,
  UPDATE_NOTI_FOLLOW,
  UPDATE_NOTI_LIKE,
  UPDATE_NOTI_COMMENT,
  UPDATE_EMAIL_PAYMENT,
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

  hangout_help_notification: true,
  message_notification: true,
  follow_notification: true,
  comment_notification: true,
  like_notification: true,
  payment_email_notification: true,
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
    case UPDATE_NOTI_HANGOUT_HELP.REQUEST:
      return {
        ...state,
        beingUpdateSetting: true,
        hangout_help_notification:
          action.payload.data.hangout_help_notification,
      };
    case UPDATE_NOTI_HANGOUT_HELP.SUCCESS:
      return {
        ...state,
        beingUpdateSetting: false,
        hangout_help_notification:
          action.payload.data.hangout_help_notification,
      };
    case UPDATE_NOTI_HANGOUT_HELP.FAILURE:
      return {
        ...state,
        beingUpdateSetting: false,
      };
    case UPDATE_NOTI_MESSAGE.REQUEST:
      return {
        ...state,
        beingUpdateSetting: true,
        message_notification: action.payload.data.message_notification,
      };
    case UPDATE_NOTI_MESSAGE.SUCCESS:
      return {
        ...state,
        beingUpdateSetting: false,
        message_notification: action.payload.data.message_notification,
      };
    case UPDATE_NOTI_MESSAGE.FAILURE:
      return {
        ...state,
        beingUpdateSetting: false,
      };
    case UPDATE_NOTI_FOLLOW.REQUEST:
      return {
        ...state,
        beingUpdateSetting: true,
        follow_notification: action.payload.data.follow_notification,
      };
    case UPDATE_NOTI_FOLLOW.SUCCESS:
      return {
        ...state,
        beingUpdateSetting: false,
        follow_notification: action.payload.data.follow_notification,
      };
    case UPDATE_NOTI_FOLLOW.FAILURE:
      return {
        ...state,
        beingUpdateSetting: false,
      };
    case UPDATE_NOTI_LIKE.REQUEST:
      return {
        ...state,
        beingUpdateSetting: true,
        like_notification: action.payload.data.like_notification,
      };
    case UPDATE_NOTI_LIKE.SUCCESS:
      return {
        ...state,
        beingUpdateSetting: false,
        like_notification: action.payload.data.like_notification,
      };
    case UPDATE_NOTI_LIKE.FAILURE:
      return {
        ...state,
        beingUpdateSetting: false,
      };
    case UPDATE_NOTI_COMMENT.REQUEST:
      return {
        ...state,
        beingUpdateSetting: true,
        comment_notification: action.payload.data.comment_notification,
      };
    case UPDATE_NOTI_COMMENT.SUCCESS:
      return {
        ...state,
        beingUpdateSetting: false,
        comment_notification: action.payload.data.comment_notification,
      };
    case UPDATE_NOTI_COMMENT.FAILURE:
      return {
        ...state,
        beingUpdateSetting: false,
      };
    case UPDATE_EMAIL_PAYMENT.REQUEST:
      return {
        ...state,
        beingUpdateEmailSetting: true,
        payment_email_notification:
          action.payload.data.payment_email_notification,
      };
    case UPDATE_EMAIL_PAYMENT.SUCCESS:
      return {
        ...state,
        beingUpdateEmailSetting: false,
        payment_email_notification:
          action.payload.data.payment_email_notification,
      };
    case UPDATE_EMAIL_PAYMENT.FAILURE:
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
        hangout_help_notification:
          action.payload.data.hangout_help_notification,
        message_notification: action.payload.data.message_notification,
        follow_notification: action.payload.data.follow_notification,
        comment_notification: action.payload.data.comment_notification,
        like_notification: action.payload.data.like_notification,
        payment_email_notification:
          action.payload.data.payment_email_notification,
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
