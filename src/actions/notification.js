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
