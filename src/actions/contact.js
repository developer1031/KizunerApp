import {
  GET_FRIEND_LIST,
  GET_FOLLOWER_LIST,
  GET_FOLLOWING_LIST,
  SEND_FRIEND_REQUEST,
  ACCEPT_FRIEND_REQUEST,
  REJECT_FRIEND_REQUEST,
  REMOVE_FRIEND_REQUEST,
  UNFRIEND,
  GET_FRIEND_REQUEST_LIST,
  FOLLOW,
  UNFOLLOW,
  BLOCK_USER,
  UNBLOCK_USER,
  GET_BLOCK_LIST,
  EDIT_CONTACT_SEARCH,
} from './types';
import {generateThunkAction} from './utilities';
import {showAlert} from './alert';

export function editContactSearch(userId, value) {
  return {
    type: EDIT_CONTACT_SEARCH,
    payload: {userId, value},
  };
}

export const blockUser = (userId, callback) =>
  generateThunkAction({
    actionType: BLOCK_USER,
    apiOptions: {
      endpoint: '/users-blocks',
      method: 'POST',
      data: {user_id: userId},
    },
    inputPayload: {userId},
    callback,
  })();

export const unblockUser = (id, userId) =>
  generateThunkAction({
    actionType: UNBLOCK_USER,
    apiOptions: {
      endpoint: `/users-blocks/${id}`,
      method: 'DELETE',
    },
    inputPayload: {id, userId},
  })();

export const getBlockList = ({page = 1}) =>
  generateThunkAction({
    actionType: GET_BLOCK_LIST,
    apiOptions: {
      endpoint: '/users-blocks',
      params: {
        per_page: 15,
        page,
      },
    },
  })();

export const follow = (userId, userName, callback) =>
  generateThunkAction({
    actionType: FOLLOW,
    inputPayload: {userId},
    apiOptions: {
      endpoint: '/users-follows',
      method: 'POST',
      data: {user_id: userId},
    },
    callback: {
      success: (_, dispatch) => {
        dispatch(
          showAlert({
            title: 'Success',
            body: `You followed ${userName}!`,
            type: 'success',
          }),
        );
        callback && callback();
      },
    },
  })();

export const unfollow = (requestId, userId, userName, callback) =>
  generateThunkAction({
    actionType: UNFOLLOW,
    inputPayload: {userId},
    apiOptions: {
      endpoint: `/users-follows/${requestId}`,
      method: 'DELETE',
    },
    callback: {
      success: (_, dispatch) => {
        dispatch(
          showAlert({
            title: 'Success',
            body: `You unfollowed ${userName}!`,
            type: 'success',
          }),
        );
        callback && callback();
      },
    },
  })();

export const sendFriendRequest = (user, callback) =>
  generateThunkAction({
    actionType: SEND_FRIEND_REQUEST,
    apiOptions: {
      endpoint: '/users-friends',
      method: 'POST',
      data: {user_id: user.id},
    },
    inputPayload: {id: user.id},
    callback: {
      success: (_, dispatch) => {
        dispatch(
          showAlert({
            title: 'Success',
            body: `Waiting for ${user.name} to accept.`,
            type: 'success',
          }),
        );
        callback && callback();
      },
    },
  })();

export const acceptFriendRequest = (requestId, userId) =>
  generateThunkAction({
    actionType: ACCEPT_FRIEND_REQUEST,
    apiOptions: {
      endpoint: `/users-friends/${requestId}`,
      method: 'PUT',
      params: {action: 'accept'},
    },
    inputPayload: {userId},
  })();

export const rejectFriendRequest = (requestId, userId) =>
  generateThunkAction({
    actionType: REJECT_FRIEND_REQUEST,
    apiOptions: {
      endpoint: `/users-friends/${requestId}`,
      method: 'PUT',
      params: {action: 'reject'},
    },
    inputPayload: {userId},
  })();

export const removeFriendRequest = (requestId, userId) =>
  generateThunkAction({
    actionType: REMOVE_FRIEND_REQUEST,
    apiOptions: {
      endpoint: `/users-friends/${requestId}`,
      method: 'DELETE',
    },
    inputPayload: {userId},
  })();

export const unfriend = (requestId, userId) =>
  generateThunkAction({
    actionType: UNFRIEND,
    apiOptions: {
      endpoint: `/users-friends/${requestId}`,
      method: 'DELETE',
    },
    inputPayload: {userId},
  })();

export const getFriendRequestList = ({page = 1}) =>
  generateThunkAction({
    actionType: GET_FRIEND_REQUEST_LIST,
    apiOptions: {
      endpoint: '/users-friends-list',
      params: {
        per_page: 15,
        page,
        status: 'pending',
      },
    },
  })();

export const getFriendList = ({page = 1, userId, query}) =>
  generateThunkAction({
    actionType: GET_FRIEND_LIST,
    inputPayload: {userId},
    apiOptions: {
      endpoint: userId
        ? `/users-friends-list/${userId}`
        : '/users-friends-list',
      params: {
        per_page: 15,
        page,
        query,
      },
    },
  })();

export const getFollowerList = ({page = 1, userId, query}) =>
  generateThunkAction({
    actionType: GET_FOLLOWER_LIST,
    inputPayload: {userId},
    apiOptions: {
      endpoint: userId ? `/users-follows/${userId}` : '/users-follows',
      params: {
        per_page: 15,
        page,
        type: 'follower',
        query,
      },
    },
  })();

export const getFollowingList = ({page = 1, userId, query}) =>
  generateThunkAction({
    actionType: GET_FOLLOWING_LIST,
    inputPayload: {userId},
    apiOptions: {
      endpoint: userId ? `/users-follows/${userId}` : '/users-follows',
      params: {
        per_page: 15,
        page,
        type: 'following',
        query,
      },
    },
  })();
