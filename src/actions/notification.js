import {generateThunkAction} from './utilities';

import {
  UPDATE_FCM_TOKEN,
  UPDATE_NOTI_SETTING,
  GET_NOTI_SETTING,
  GET_NOTI_LIST,
  GET_NOTI_COUNT,
  NOTI_FRIEND_ACCEPTED,
  NOTI_NEW_FOLLOW,
  READ_NOTI,
  DELETE_NOTI,
  UPDATE_EMAIL_SETTING,
  UPDATE_NOTI_HANGOUT_HELP,
  UPDATE_NOTI_MESSAGE,
  UPDATE_NOTI_FOLLOW,
  UPDATE_NOTI_LIKE,
  UPDATE_NOTI_COMMENT,
  UPDATE_EMAIL_PAYMENT,
} from './types';

export const readNoti = (id, callback) =>
  generateThunkAction({
    actionType: READ_NOTI,
    apiOptions: {
      endpoint: `/notifications/${id}`,
      method: 'PUT',
    },
    inputPayload: {id},
    callback,
  })();

export const deleteNoti = (id, callback) =>
  generateThunkAction({
    actionType: DELETE_NOTI,
    apiOptions: {
      endpoint: '/notifications/delete',
      method: 'POST',
      data: {id},
    },
    inputPayload: {id},
    callback,
  })();

export function notiFriendAccepted(payload) {
  return {
    type: NOTI_FRIEND_ACCEPTED,
    payload,
  };
}

export function notiNewFollow(payload) {
  return {
    type: NOTI_NEW_FOLLOW,
    payload,
  };
}

export const updateFcmToken = ({fcm_token}) =>
  generateThunkAction({
    actionType: UPDATE_FCM_TOKEN,
    inputPayload: {fcm_token},
    apiOptions: {
      endpoint: '/devices',
      method: 'POST',
      data: {fcm_token},
    },
  })();

export const updateNotiSetting = ({notification, email_notification}) =>
  generateThunkAction({
    actionType: UPDATE_NOTI_SETTING,
    apiOptions: {
      endpoint: '/devices/notifications',
      method: 'POST',
      data: {notification, email_notification},
    },
  })();

export const updateEmailSetting = ({notification, email_notification}) =>
  generateThunkAction({
    actionType: UPDATE_EMAIL_SETTING,
    apiOptions: {
      endpoint: '/devices/notifications',
      method: 'POST',
      data: {notification, email_notification},
    },
  })();

export const getNotiSetting = () =>
  generateThunkAction({
    actionType: GET_NOTI_SETTING,
    apiOptions: {
      endpoint: '/devices/notifications',
    },
  })();

export const getNotiCount = () =>
  generateThunkAction({
    actionType: GET_NOTI_COUNT,
    apiOptions: {
      endpoint: '/notifications/statistic',
    },
  })();

export const getNotiList = ({page}) =>
  generateThunkAction({
    actionType: GET_NOTI_LIST,
    apiOptions: {
      endpoint: '/notifications',
      params: {
        per_page: 10,
        page,
      },
    },
  })();

export const updateHangoutHelpNoti = ({hangout_help_notification}) =>
  generateThunkAction({
    actionType: UPDATE_NOTI_HANGOUT_HELP,
    apiOptions: {
      endpoint: '/devices/hangout_help_notification',
      method: 'POST',
      data: {hangout_help_notification},
    },
  })();

export const updateMessageNoti = ({message_notification}) =>
  generateThunkAction({
    actionType: UPDATE_NOTI_MESSAGE,
    apiOptions: {
      endpoint: '/devices/message_notification',
      method: 'POST',
      data: {message_notification},
    },
  })();

export const updateFollowNoti = ({follow_notification}) =>
  generateThunkAction({
    actionType: UPDATE_NOTI_FOLLOW,
    apiOptions: {
      endpoint: '/devices/follow_notification',
      method: 'POST',
      data: {follow_notification},
    },
  })();

export const updateCommentNoti = ({comment_notification}) =>
  generateThunkAction({
    actionType: UPDATE_NOTI_COMMENT,
    apiOptions: {
      endpoint: '/devices/comment_notification',
      method: 'POST',
      data: {comment_notification},
    },
  })();

export const updateLikeNoti = ({like_notification}) =>
  generateThunkAction({
    actionType: UPDATE_NOTI_LIKE,
    apiOptions: {
      endpoint: '/devices/like_notification',
      method: 'POST',
      data: {like_notification},
    },
  })();

export const updatePaymentEmail = ({payment_email_notification}) =>
  generateThunkAction({
    actionType: UPDATE_EMAIL_PAYMENT,
    apiOptions: {
      endpoint: '/devices/payment_email_notification',
      method: 'POST',
      data: {payment_email_notification},
    },
  })();
