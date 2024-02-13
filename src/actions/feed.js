import {
  UPLOAD_SINGLE_IMAGE,
  CREATE_HANGOUT,
  GET_USER_HANGOUTS,
  GET_MAP_HANGOUTS,
  GET_NEARBY_HANGOUTS,
  GET_RECOMMEND_HANGOUTS,
  GET_ONLINE_HANGOUTS,
  TOGGLE_LIKE_HANGOUT,
  TOGGLE_LIKE_HELP,
  GET_DETAIL_HANGOUT,
  GET_DETAIL_STATUS,
  CREATE_STATUS,
  GET_SELF_FEED,
  GET_NEWS_FEED,
  GET_USER_FEED,
  UPDATE_HANGOUT,
  DELETE_HANGOUT,
  UPDATE_STATUS,
  DELETE_STATUS,
  NEW_FEED_FROM_SOCKET,
  TOGGLE_LIKE_STATUS,
  GET_USER_LIKE_LIST,
  CREATE_HELP,
  UPDATE_HELP,
  DELETE_HELP,
  CHANGE_HANGOUT_STATUS,
  GET_DETAIL_HELP,
  CHANGE_HELP_STATUS,
  LIST_CHAT_ROOM_PUBLIC,
  ADD_MEMBER_TO_CHAT_EXPLORE,
  NOTIFICATION_SHARE_POST,
} from './types';

import {generateThunkAction} from './utilities';
import {showAlert} from './alert';

const DEFAULT_PERPAGE = 5;

export const getUserLikeList = ({id, page = 1}) =>
  generateThunkAction({
    actionType: GET_USER_LIKE_LIST,
    inputPayload: {id},
    apiOptions: {
      endpoint: `/reacts/${id}`,
      params: {
        per_page: 5,
        page,
      },
    },
  })();

export const newFeedFromSocket = () => ({type: NEW_FEED_FROM_SOCKET});

export const updateStatus = (statusId, data, callback) =>
  generateThunkAction({
    actionType: UPDATE_STATUS,
    apiOptions: {
      endpoint: `/statuses/${statusId}`,
      method: 'PUT',
      data,
    },
    inputPayload: {id: statusId},
    callback: {
      success: (_, dispatch) => {
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Your status updated!',
          }),
        );
        callback && callback();
      },
    },
  })();

export const deleteStatus = (statusId, callback) =>
  generateThunkAction({
    actionType: DELETE_STATUS,
    apiOptions: {
      endpoint: `/statuses/${statusId}`,
      method: 'DELETE',
    },
    inputPayload: {id: statusId},
    callback: {
      success: (_, dispatch) => {
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Your status deleted!',
          }),
        );
        callback && callback();
      },
    },
  })();

export const updateHangout = (hangoutId, data, callback) =>
  generateThunkAction({
    actionType: UPDATE_HANGOUT,
    apiOptions: {
      endpoint: `/hangouts/${hangoutId}`,
      method: 'PUT',
      data,
    },
    inputPayload: {id: hangoutId},
    callback: {
      success: (_, dispatch) => {
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Hangout updated!',
          }),
        );
        callback && callback();
      },
    },
  })();

export const deleteHangout = (hangoutId, callback) =>
  generateThunkAction({
    actionType: DELETE_HANGOUT,
    apiOptions: {
      endpoint: `/hangouts/${hangoutId}`,
      method: 'DELETE',
    },
    inputPayload: {id: hangoutId},
    // preCallback: (result) => {
    //   if (result?.data?.message !== 'Delete Help successfully') {
    //     throw new Error(result?.data?.message);
    //   }
    // },
    callback: {
      success: (_, dispatch) => {
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Your hangout deleted!',
          }),
        );
        callback && callback();
      },
    },
  })();

export const updateHelp = (helpId, data, callback) =>
  generateThunkAction({
    actionType: UPDATE_HELP,
    apiOptions: {
      endpoint: `/helps/${helpId}`,
      method: 'PUT',
      data,
    },
    inputPayload: {id: helpId},
    callback: {
      success: (_, dispatch) => {
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Help updated!',
          }),
        );
        callback && callback();
      },
    },
  })();

export const deleteHelp = (helpId, callback) =>
  generateThunkAction({
    actionType: DELETE_HELP,
    apiOptions: {
      endpoint: `/helps/${helpId}`,
      method: 'DELETE',
    },
    inputPayload: {id: helpId},
    preCallback: (result) => {
      if (result?.data?.message !== 'Delete Help successfully') {
        throw new Error(result?.data?.message);
      }
    },
    callback: {
      success: (result, dispatch) => {
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Your help deleted!',
          }),
        );
        callback && callback();
      },
    },
  })();

export const getUserFeed = ({page = 1, userId}) =>
  generateThunkAction({
    actionType: GET_USER_FEED,
    apiOptions: {
      endpoint: `/users/timeline/${userId}`,
      params: {
        per_page: DEFAULT_PERPAGE,
        page,
        scope: 'personal',
      },
    },
    inputPayload: {userId},
  })();

export const getNewsFeed = ({page = 1, type}, callback) =>
  generateThunkAction({
    actionType: GET_NEWS_FEED,
    apiOptions: {
      endpoint: '/users/timeline',
      params: {
        per_page: DEFAULT_PERPAGE,
        page,
        scope: 'timeline',
        type,
      },
    },
    callback,
  })();

export const getSelfFeed = ({page = 1}) =>
  generateThunkAction({
    actionType: GET_SELF_FEED,
    apiOptions: {
      endpoint: '/users/timeline',
      params: {
        per_page: DEFAULT_PERPAGE,
        page,
        scope: 'personal',
      },
    },
  })();

export const changeHangoutStatus = (hangoutId, status, callback) =>
  generateThunkAction({
    actionType: CHANGE_HANGOUT_STATUS,
    apiOptions: {
      method: 'POST',
      endpoint: `/hangouts/${hangoutId}/update-status`,
      data: {available_status: status},
    },
    callback: {
      success: (_, dispatch) => {
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Your status updated!',
          }),
        );
        callback && callback();
      },
    },
    inputPayload: {hangoutId, status},
  })();

export const changeHelpStatus = (helpId, status, callback) =>
  generateThunkAction({
    actionType: CHANGE_HELP_STATUS,
    apiOptions: {
      method: 'POST',
      endpoint: `/helps/${helpId}/update-status`,
      data: {available_status: status},
    },
    callback: {
      success: (_, dispatch) => {
        dispatch(
          showAlert({
            title: 'Success',
            type: 'success',
            body: 'Your status updated!',
          }),
        );
        callback && callback();
      },
    },
    inputPayload: {helpId, status},
  })();

export const createStatus = (data, callback) =>
  generateThunkAction({
    actionType: CREATE_STATUS,
    apiOptions: {
      method: 'POST',
      endpoint: '/statuses',
      data,
    },
    callback,
  })();

export const getDetailHangout = (hangoutId, callback) =>
  generateThunkAction({
    actionType: GET_DETAIL_HANGOUT,
    apiOptions: {
      endpoint: `/hangouts/${hangoutId}/detail`,
      useOnce: true,
    },
    inputPayload: {hangoutId},
    callback,
  })();

export const getDetailHelp = (helpId, callback) =>
  generateThunkAction({
    actionType: GET_DETAIL_HELP,
    apiOptions: {
      endpoint: `/helps/${helpId}/detail`,
      useOnce: true,
    },
    inputPayload: {helpId},
    callback,
  })();

export const getDetailStatus = (statusId, callback) =>
  generateThunkAction({
    actionType: GET_DETAIL_STATUS,
    apiOptions: {
      endpoint: `/statuses/${statusId}`,
      useOnce: true,
    },
    inputPayload: {statusId},
    callback,
  })();

export const toggleLikeHangout = ({hangoutId, userId}, callback) =>
  generateThunkAction({
    actionType: TOGGLE_LIKE_HANGOUT,
    apiOptions: {
      method: 'POST',
      endpoint: '/hangouts/react',
      data: {hangout_id: hangoutId},
    },
    inputPayload: {hangoutId, userId},
    callback,
  })();

export const toggleLikeHelp = ({helpId, userId}, callback) =>
  generateThunkAction({
    actionType: TOGGLE_LIKE_HELP,
    apiOptions: {
      method: 'POST',
      endpoint: '/helps/react',
      data: {help_id: helpId},
    },
    inputPayload: {helpId, userId},
    callback,
  })();

export const toggleLikeStatus = ({statusId, userId}, callback) =>
  generateThunkAction({
    actionType: TOGGLE_LIKE_STATUS,
    apiOptions: {
      method: 'POST',
      endpoint: '/statuses/react',
      data: {status_id: statusId},
    },
    inputPayload: {statusId, userId},
    callback,
  })();

export const uploadSingleImage = (data, callback) => {
  return generateThunkAction({
    actionType: UPLOAD_SINGLE_IMAGE,
    apiOptions: {
      method: 'POST',
      endpoint: '/upload/single',
      data,
    },
    callback,
  })();
};

export const uploadMultiMedia = (data, callback) => {
  return generateThunkAction({
    actionType: UPLOAD_SINGLE_IMAGE,
    apiOptions: {
      method: 'POST',
      endpoint: '/upload/multiple',
      data,
    },
    callback,
  })();
};

export const createHangout = (data, callback) => {
  console.log('🚀 ~ file: feed.js:393 ~ createHangout ~ data:', data);
  return generateThunkAction({
    actionType: CREATE_HANGOUT,
    apiOptions: {
      method: 'POST',
      endpoint: '/hangouts',
      data,
    },
    callback,
  })();
};

export const createHelp = (data, callback) =>
  generateThunkAction({
    actionType: CREATE_HELP,
    apiOptions: {
      method: 'POST',
      endpoint: '/helps',
      data,
    },
    callback,
  })();

export const getUserHangouts = ({page = 1}) =>
  generateThunkAction({
    actionType: GET_USER_HANGOUTS,
    apiOptions: {
      endpoint: '/hangouts',
      params: {
        per_page: DEFAULT_PERPAGE,
        page,
      },
    },
  })();

export const getNearbyHangouts = ({page = 1, lat, lng, radius}) =>
  generateThunkAction({
    actionType: GET_NEARBY_HANGOUTS,
    apiOptions: {
      endpoint: '/suggest/nearby',
      params: {
        per_page: DEFAULT_PERPAGE,
        page,
        radius: parseInt(radius),
        lat,
        lng,
      },
    },
  })();

export const getMapHangouts = ({page = 1, lat, lng, radius}) =>
  generateThunkAction({
    actionType: GET_MAP_HANGOUTS,
    apiOptions: {
      endpoint: '/suggest/nearby',
      params: {
        per_page: DEFAULT_PERPAGE,
        page,
        radius: parseInt(radius),
        lat,
        lng,
      },
    },
  })();

export const getOnlineHangouts = ({page = 1}, callback) =>
  generateThunkAction({
    actionType: GET_ONLINE_HANGOUTS,
    apiOptions: {
      endpoint: '/suggest/online',
      params: {
        per_page: DEFAULT_PERPAGE,
        page,
      },
    },
    callback,
  })();

export const getRecommendHangouts = ({page = 1}) =>
  generateThunkAction({
    actionType: GET_RECOMMEND_HANGOUTS,
    apiOptions: {
      endpoint: '/suggest/recommend',
      params: {
        per_page: DEFAULT_PERPAGE,
        page,
      },
    },
  })();

export const listChatRoomPublic = ({page = 1}) =>
  generateThunkAction({
    actionType: LIST_CHAT_ROOM_PUBLIC,
    apiOptions: {
      endpoint: '/chats/rooms',
      params: {
        per_page: DEFAULT_PERPAGE,
        page,
        type: 'public_group',
      },
    },
  })();

export const addMemberToRoomExplore = ({roomId, members}, callback) =>
  generateThunkAction({
    actionType: ADD_MEMBER_TO_CHAT_EXPLORE,
    inputPayload: {roomId, members},
    apiOptions: {
      endpoint: `/chats/rooms/${roomId}/members`,
      method: 'PUT',
      data: {members},
    },
    callback,
  })();

export const putNotificationSharePost = ({}) =>
  generateThunkAction({
    actionType: NOTIFICATION_SHARE_POST,
    apiOptions: {
      endpoint: `/user/sharepost`,
      method: 'PUT',
      params: {},
    },
  })();
