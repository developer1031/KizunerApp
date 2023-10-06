import moment from 'moment';
import NavigationService from 'navigation/service';

import {
  LIST_CHAT_ROOM,
  CREATE_CHAT_ROOM,
  UPDATE_CHAT_ROOM_NAME,
  DELETE_CHAT_ROOM,
  ADD_MEMBER_TO_CHAT,
  REMOVE_MEMBER_FROM_CHAT,
  JOIN_CHAT_ROOM,
  LEAVE_CHAT_ROOM,
  SEND_MESSAGE,
  UPLOAD_MESSAGE_IMAGE,
  DELETE_MESSAGE,
  GET_ROOM_MESSAGES,
  NEW_MESSAGE_FROM_SOCKET,
  JOIN_CHAT_ROOM_BY_ID,
  SEEN_CHAT_ROOM,
  RELOAD_DRAFT_MESSAGE_BY_ROOM_ID,
  UPLOAD_MESSAGE_VIDEO,
  LIST_CHAT_ROOM_PUBLIC,
  JOIN_CHAT_ROOM_EXPLORE,
  SEEN_CHAT_ROOM_EXPLORE,
  JOIN_CHAT_ROOM_BY_ID_EXPLORE,
  CREATE_CHAT_ROOM_BOT,
  CREATE_CHAT_ROOM_RELATED_USER,
  GET_BADGE_CHAT_SINGLE,
  GET_BADGE_CHAT_GROUP,
  SET_UNSEEN_SINGE,
  SET_UNSEEN_GROUP,
} from './types';
import {generateThunkAction} from './utilities';

export const joinChatRoomById = (id) =>
  generateThunkAction({
    actionType: JOIN_CHAT_ROOM_BY_ID,
    apiOptions: {
      endpoint: `/chats/rooms/${id}`,
    },
    callback: {
      success: (data, dispatch) => {
        NavigationService.navigate('ChatRoom');
      },
    },
  })();

export const joinChatRoomByIdExplore = (id) =>
  generateThunkAction({
    actionType: JOIN_CHAT_ROOM_BY_ID_EXPLORE,
    apiOptions: {
      endpoint: `/chats/rooms/${id}`,
    },
    callback: {
      success: (data, dispatch) => {
        NavigationService.navigate('ChatRoom');
      },
    },
  })();

export const uploadMessageImage = (data, tmpMessage, callback) =>
  generateThunkAction({
    actionType: UPLOAD_MESSAGE_IMAGE,
    inputPayload: {
      tmpMessage,
    },
    apiOptions: {
      method: 'POST',
      endpoint: '/chats/images',
      data,
    },
    callback: {
      success: (result, dispatch) => {
        callback && callback(result);
      },
    },
  })();

export const uploadMessageVideo = (data, tmpMessage, callback) =>
  generateThunkAction({
    actionType: UPLOAD_MESSAGE_VIDEO,
    inputPayload: {
      tmpMessage,
    },
    apiOptions: {
      method: 'POST',
      endpoint: '/chats/videos',
      data,
    },
    callback: {
      success: (result, dispatch) => {
        callback && callback(result);
      },
    },
  })();

export function newMessageFromSocket(data) {
  return {
    type: NEW_MESSAGE_FROM_SOCKET,
    payload: data,
  };
}

export const getRoomMessages = ({page = 1, id}) =>
  generateThunkAction({
    actionType: GET_ROOM_MESSAGES,
    apiOptions: {
      endpoint: `/chats/rooms/${id}/messages`,
      params: {
        per_page: 20,
        page,
      },
    },
  })();

export const deleteMessage = (id) =>
  generateThunkAction({
    actionType: DELETE_MESSAGE,
    inputPayload: {id},
    apiOptions: {
      endpoint: `/chats/messages/${id}`,
      method: 'DELETE',
    },
  })();

export const sendMessage = (
  {room_id, text, hangout, image, user, tmpId, help},
  callback,
) =>
  generateThunkAction({
    actionType: SEND_MESSAGE,
    inputPayload: {id: room_id, text, hangout, image, tmpId, user, help},
    apiOptions: {
      endpoint: '/chats/messages',
      method: 'POST',
      data: {
        room_id,
        text,
        hangout,
        help,
        images: image && [image],
      },
    },
    callback,
  })();

export function joinChatRoom(data) {
  NavigationService.navigate('ChatRoom', {
    draftMessage: data.draftMessage || '',
  });
  return {
    type: JOIN_CHAT_ROOM,
    payload: data,
  };
}

export function joinChatRoomExplore(data) {
  NavigationService.navigate('ChatRoom', '');
  return {
    type: JOIN_CHAT_ROOM_EXPLORE,
    payload: data,
  };
}

export function reloadDraftMessageByRoomId(data) {
  return {
    type: RELOAD_DRAFT_MESSAGE_BY_ROOM_ID,
    payload: data,
  };
}

export function leaveChatRoom() {
  return {
    type: LEAVE_CHAT_ROOM,
  };
}

export const listChatRoom = ({page = 1, query = '', type, reset}, callback) =>
  // console.log('===') ||
  generateThunkAction({
    actionType: LIST_CHAT_ROOM,
    apiOptions: {
      endpoint: query?.length ? '/chats/search' : '/chats/rooms',
      params: {
        per_page: 10,
        page,
        query,
        type:
          type === 1
            ? 'personal'
            : type === 2
            ? 'group'
            : type === 3
            ? 'location'
            : null,
      },
    },
    inputPayload: {reset, typeChat: type},
    callback,
  })();

export const createChatRoom = ({members, isFake}, callback) =>
  generateThunkAction({
    actionType: CREATE_CHAT_ROOM,
    apiOptions: {
      endpoint: '/chats/rooms',
      method: 'POST',
      data: {members: members && members?.length > 1 ? members : members[0]},
    },
    callback: {
      success: (payload) => {
        if (callback) {
          callback(payload);
        } else {
          if (isFake) {
            NavigationService.navigate('ChatRoomBot', {data: payload});
          } else {
            NavigationService.goBack();
            NavigationService.navigate('ChatRoom', {data: payload});
          }
        }
      },
    },
  })();

export const createChatRelatedUser = ({members}, callback) =>
  generateThunkAction({
    actionType: CREATE_CHAT_ROOM_RELATED_USER,
    apiOptions: {
      endpoint: '/chats/rooms',
      method: 'POST',
      data: {members: members && members?.length > 1 ? members : members[0]},
    },
    callback: {
      success: (payload, dispatch) => {
        dispatch(joinChatRoomById(payload?.data?.id));
        dispatch(seenChatRoom({roomId: payload?.data?.id}));
      },
    },
  })();

export const createChatRoomBot = ({members, isFake}, callback) =>
  generateThunkAction({
    actionType: CREATE_CHAT_ROOM_BOT,
    apiOptions: {
      endpoint: '/chats/rooms',
      method: 'POST',
      data: {members: members && members?.length > 1 ? members : members[0]},
    },
    callback: {
      success: (payload) => {
        // payload?.data?.users?.map((item, i) => {
        //   if (item?.is_fake === 0) {
        //     console.log({roomId: payload?.data?.id, userId: item?.id});
        //     seenChatRoom({roomId: payload?.data?.id, userId: item?.id});
        //   }
        // });
        if (callback) {
          callback(payload);
        } else {
          if (isFake) {
            NavigationService.navigate('ChatRoomBot', {data: payload});
          } else {
            NavigationService.goBack();
            NavigationService.navigate('ChatRoom', {data: payload});
          }
        }
      },
    },
  })();

export const createChatRoomLocation = ({members, isFake}, callback) =>
  generateThunkAction({
    actionType: CREATE_CHAT_ROOM,
    apiOptions: {
      endpoint: '/chats/rooms',
      method: 'POST',
      data: {members: members && members?.length > 1 ? members : members[0]},
    },
    callback: {
      success: (payload) => {
        if (callback) {
          callback(payload);
        } else {
          NavigationService.navigate('ChatRoom', {data: payload});
        }
      },
    },
  })();

export const updateChatRoomName = ({roomId, name}, callback) =>
  generateThunkAction({
    actionType: UPDATE_CHAT_ROOM_NAME,
    inputPayload: {roomId, name},
    callback,
    apiOptions: {
      endpoint: `/chats/rooms/${roomId}`,
      method: 'PUT',
      data: {name},
    },
  })();

export const deleteChatRoom = ({roomId}, callback) =>
  generateThunkAction({
    actionType: DELETE_CHAT_ROOM,
    apiOptions: {
      endpoint: `/chats/rooms/${roomId}`,
      method: 'DELETE',
    },
    inputPayload: {roomId},
    callback,
  })();

export const addMemberToRoom = ({roomId, members}, callback) =>
  generateThunkAction({
    actionType: ADD_MEMBER_TO_CHAT,
    inputPayload: {roomId, members},
    apiOptions: {
      endpoint: `/chats/rooms/${roomId}/members`,
      method: 'PUT',
      data: {members},
    },
    callback,
  })();

export const deleteMemberFromRoom = ({roomId, userId}, callback) =>
  generateThunkAction({
    actionType: REMOVE_MEMBER_FROM_CHAT,
    inputPayload: {roomId, userId},
    apiOptions: {
      endpoint: `/chats/rooms/${roomId}/members/${userId}`,
      method: 'DELETE',
    },
    callback,
  })();

export const seenChatRoom = ({roomId, userId}, callback) =>
  generateThunkAction({
    actionType: SEEN_CHAT_ROOM,
    inputPayload: {roomId, userId},
    apiOptions: {
      endpoint: `/chats/rooms/${roomId}/seen`,
      method: 'POST',
    },
    callback,
  })();

export const seenChatRoomExplore = ({roomId, userId}, callback) =>
  generateThunkAction({
    actionType: SEEN_CHAT_ROOM_EXPLORE,
    inputPayload: {roomId, userId},
    apiOptions: {
      endpoint: `/chats/rooms/${roomId}/seen`,
      method: 'POST',
    },
    callback,
  })();

const setBadgeStatus = (type, payload) => {
  return {
    type: type === 'personal' ? SET_UNSEEN_SINGE : SET_UNSEEN_GROUP,
    payload,
  };
};
export const getBadgeChatSingle = () =>
  generateThunkAction({
    actionType: GET_BADGE_CHAT_SINGLE,
    apiOptions: {
      endpoint: '/chats/rooms',
      params: {
        per_page: 10,
        page: 1,
        query: '',
        type: 'personal',
      },
    },
    callback: {
      success: (result, dispatch) => {
        const hasNoMessage = !result.data.length;
        if (hasNoMessage) {
          dispatch(setBadgeStatus('personal', false));
        }

        const messageList = result.data;

        const hasUnseenMessage = !!messageList.find((item) =>
          moment(
            item?.users?.find((i) => i.id === item.fectch_user_id)?.seen_at,
          ).isBefore(moment(item?.updated_at)),
        );

        dispatch(setBadgeStatus('personal', hasUnseenMessage));
      },
    },
  })();
export const getBadgeChatGroup = () =>
  generateThunkAction({
    actionType: GET_BADGE_CHAT_GROUP,
    apiOptions: {
      endpoint: '/chats/rooms',
      params: {
        per_page: 10,
        page: 1,
        query: '',
        type: 'group',
      },
    },
    callback: {
      success: (result, dispatch) => {
        const hasNoMessage = !result.data.length;
        if (hasNoMessage) {
          dispatch(setBadgeStatus('group', false));
        }

        const messageList = result.data;

        const hasUnseenMessage = !!messageList.find((item) =>
          moment(
            item?.users?.find((i) => i.id === item.fectch_user_id)?.seen_at,
          ).isBefore(moment(item?.updated_at)),
        );

        dispatch(setBadgeStatus('group', hasUnseenMessage));
      },
    },
  })();
