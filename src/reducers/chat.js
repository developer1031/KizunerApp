import {
  LIST_CHAT_ROOM,
  CREATE_CHAT_ROOM,
  UPDATE_CHAT_ROOM_NAME,
  DELETE_CHAT_ROOM,
  ADD_MEMBER_TO_CHAT,
  REMOVE_MEMBER_FROM_CHAT,
  JOIN_CHAT_ROOM,
  LEAVE_CHAT_ROOM,
  GET_ROOM_MESSAGES,
  SEND_MESSAGE,
  DELETE_MESSAGE,
  UPLOAD_MESSAGE_IMAGE,
  NEW_MESSAGE_FROM_SOCKET,
  JOIN_CHAT_ROOM_BY_ID,
  CREATE_OFFER,
  SEEN_CHAT_ROOM,
  LOGOUT,
  RELOAD_DRAFT_MESSAGE_BY_ROOM_ID,
  UPLOAD_MESSAGE_VIDEO,
  CREATE_OFFER_HELP,
  JOIN_CHAT_ROOM_EXPLORE,
  SEEN_CHAT_ROOM_EXPLORE,
  ADD_MEMBER_TO_CHAT_EXPLORE,
  JOIN_CHAT_ROOM_BY_ID_EXPLORE,
  CREATE_CHAT_ROOM_BOT,
  CREATE_CHAT_ROOM_RELATED_USER,
  SET_UNSEEN_GROUP,
  SET_UNSEEN_SINGE,
} from 'actions';

const INITIAL_STATE = {
  messageList: [],
  messageLastPage: 1,
  messageLoading: false,
  messageError: null,
  beingCreateRoom: false,
  roomDetail: null,
  roomMessages: [],
  roomMessagesLoading: false,
  roomMessagesLastPage: 1,
  roomMessagesError: null,
  beingSendMessage: [],
  beingDeleteMessage: [],
  beingUploadImage: [],
  beingAddMember: false,
  beingUpdateName: false,
  beingGetRoomDetail: false,
  reset: false,
  typeChat: 1,
  reloadDraftMessageByChatRoom: null,
  typeList: null,

  hasUnseenSingle: false,
  hasUnseenGroup: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEEN_CHAT_ROOM.SUCCESS:
      return {
        ...state,
        messageList: state.messageList.map((item) =>
          item.id === action.payload.inputPayload.roomId
            ? {
                ...item,
                users: item.users.map((i) =>
                  i.id === action.payload.inputPayload.userId
                    ? {
                        ...i,
                        seen_at: new Date(),
                      }
                    : i,
                ),
              }
            : item,
        ),
      };
    case SEEN_CHAT_ROOM_EXPLORE.SUCCESS:
      return {
        ...state,
        messageList: state.messageList.map((item) =>
          item.id === action.payload.inputPayload.roomId
            ? {
                ...item,
                users: item.users.map((i) =>
                  i.id === action.payload.inputPayload.userId
                    ? {
                        ...i,
                        seen_at: new Date(),
                      }
                    : i,
                ),
              }
            : item,
        ),
      };
    case CREATE_OFFER.SUCCESS:
      return {
        ...state,
        roomMessages: state.roomMessages.map((item) =>
          item.hangout && item.hangout.id === action.payload.data.hangout_id
            ? {
                ...item,
                hangout: {
                  ...item.hangout,
                  can_hangout: false,
                },
              }
            : item,
        ),
      };
    case CREATE_OFFER_HELP.SUCCESS:
      return {
        ...state,
        roomMessages: state.roomMessages.map((item) =>
          item.help && item.help.id === action.payload.data.help_id
            ? {
                ...item,
                help: {
                  ...item.help,
                  can_help: false,
                },
              }
            : item,
        ),
      };
    case JOIN_CHAT_ROOM_BY_ID.REQUEST:
      return {
        ...state,
        beingGetRoomDetail: true,
      };
    case JOIN_CHAT_ROOM_BY_ID.SUCCESS:
      return {
        ...state,
        beingGetRoomDetail: false,
        roomDetail: action.payload.data,
      };
    case JOIN_CHAT_ROOM_BY_ID_EXPLORE.SUCCESS:
      return {
        ...state,
        roomDetail: action.payload.data,
      };
    case JOIN_CHAT_ROOM_BY_ID.FAILURE:
      return {
        ...state,
        beingGetRoomDetail: false,
      };
    case UPDATE_CHAT_ROOM_NAME.REQUEST:
      return {
        ...state,
        beingUpdateName: true,
      };
    case UPDATE_CHAT_ROOM_NAME.SUCCESS:
      return {
        ...state,
        beingUpdateName: false,
        messageList: state.messageList.map((item) =>
          item.id === action.payload.inputPayload.roomId
            ? {
                ...item,
                name: action.payload.inputPayload.name,
              }
            : item,
        ),
        roomDetail:
          state.roomDetail?.id === action.payload.inputPayload.roomId
            ? {
                ...state.roomDetail,
                name: action.payload.inputPayload.name,
              }
            : state.roomDetail,
      };
    case UPDATE_CHAT_ROOM_NAME.FAILURE:
      return {
        ...state,
        beingUpdateName: false,
      };
    case ADD_MEMBER_TO_CHAT.REQUEST:
      return {
        ...state,
        beingAddMember: true,
      };
    case ADD_MEMBER_TO_CHAT.SUCCESS:
      return {
        ...state,
        beingAddMember: false,
        messageList: state.messageList.map((item) =>
          item.id === action.payload.data.id ? action.payload.data : item,
        ),
        roomDetail:
          state.roomDetail?.id === action.payload.data.id
            ? action.payload.data
            : state.roomDetail,
      };
    case ADD_MEMBER_TO_CHAT.FAILURE:
      return {
        ...state,
        beingAddMember: false,
      };
    case ADD_MEMBER_TO_CHAT_EXPLORE.SUCCESS:
      return {
        ...state,
        roomDetail:
          state.roomDetail?.id === action.payload.data.id
            ? action.payload.data
            : state.roomDetail,
      };
    case DELETE_CHAT_ROOM.SUCCESS:
      return {
        ...state,
        messageList: state.messageList.filter(
          (i) => i.id !== action.payload.inputPayload.roomId,
        ),
      };
    case REMOVE_MEMBER_FROM_CHAT.REQUEST:
      return {
        ...state,
      };
    case REMOVE_MEMBER_FROM_CHAT.SUCCESS:
      return {
        ...state,
        messageList: state.messageList.map((item) =>
          item.id === action.payload.inputPayload.roomId
            ? {
                ...item,
                users: item.users.filter(
                  (i) => i.id !== action.payload.inputPayload.userId,
                ),
              }
            : item,
        ),
        roomDetail:
          state.roomDetail?.id === action.payload.inputPayload.roomId
            ? {
                ...state.roomDetail,
                users: state.roomDetail.users.filter(
                  (i) => i.id !== action.payload.inputPayload.userId,
                ),
              }
            : state.roomDetail,
      };
    case REMOVE_MEMBER_FROM_CHAT.REQUEST:
      return {
        ...state,
      };
    case UPLOAD_MESSAGE_IMAGE.REQUEST:
      return {
        ...state,
        roomMessages:
          state.roomDetail?.id ===
          action.payload?.inputPayload?.tmpMessage?.room_id
            ? [
                {
                  id: action.payload?.inputPayload?.tmpId,
                  ...action.payload?.inputPayload?.tmpMessage,
                },
                ...state.roomMessages,
              ]
            : state.roomMessages,
      };
    case UPLOAD_MESSAGE_IMAGE.FAILURE:
      return {
        ...state,
        roomMessages:
          state.roomDetail?.id === action.payload?.tmpMessage?.room_id
            ? state.roomMessages.filter((i) => i.id !== action.payload?.tmpId)
            : state.roomMessages,
      };
    case UPLOAD_MESSAGE_VIDEO.REQUEST:
      return {
        ...state,
        roomMessages:
          state.roomDetail?.id ===
          action.payload?.inputPayload?.tmpMessage?.room_id
            ? [
                {
                  id: action.payload?.inputPayload?.tmpId,
                  ...action.payload?.inputPayload?.tmpMessage,
                },
                ...state.roomMessages,
              ]
            : state.roomMessages,
      };
    case UPLOAD_MESSAGE_VIDEO.FAILURE:
      return {
        ...state,
        roomMessages:
          state.roomDetail?.id === action.payload?.tmpMessage?.room_id
            ? state.roomMessages.filter((i) => i.id !== action.payload?.tmpId)
            : state.roomMessages,
      };
    case NEW_MESSAGE_FROM_SOCKET:
      const foundRoom = state.messageList.find(
        (item) => item.id === action.payload?.room_id,
      );
      const updatedRoom = foundRoom && {
        ...foundRoom,
        last_message: {
          data: action.payload,
        },
        updated_at: new Date(),
      };
      return {
        ...state,
        roomMessages:
          state.roomDetail?.id === action.payload?.room_id
            ? [action.payload, ...state.roomMessages]
            : state.roomMessages,
        messageList: updatedRoom
          ? [
              updatedRoom,
              ...state.messageList.filter(
                (item) => item.id !== action.payload?.room_id,
              ),
            ]
          : state.messageList,
      };
    case DELETE_MESSAGE.REQUEST:
      return {
        ...state,
        beingDeleteMessage: state.beingDeleteMessage
          ? [...state.beingDeleteMessage, action.payload.inputPayload.id]
          : [action.payload.inputPayload.id],
      };
    case DELETE_MESSAGE.SUCCESS:
      return {
        ...state,
        beingDeleteMessage: state.beingDeleteMessage.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
        roomMessages: state.roomMessages.filter(
          (i) => i.id !== action.payload.inputPayload.id,
        ),
      };
    case DELETE_MESSAGE.FAILURE:
      return {
        ...state,
        beingDeleteMessage: state.beingDeleteMessage.filter(
          (i) => i !== action.payload.id,
        ),
      };
    case SEND_MESSAGE.REQUEST:
      return {
        ...state,
        roomMessages:
          state.roomDetail?.id === action.payload.inputPayload.id &&
          !state.roomMessages.find(
            (i) => i.id === action.payload.inputPayload.tmpId,
          )
            ? [
                {
                  id: action.payload.inputPayload.tmpId,
                  text: action.payload.inputPayload.text,
                  image: action.payload.inputPayload.image,
                  user: action.payload.inputPayload.user,
                  created_at: new Date(),
                },
                ...state.roomMessages,
              ]
            : state.roomMessages,
        beingSendMessage: state.beingSendMessage
          ? [...state.beingSendMessage, action.payload.inputPayload.tmpId]
          : [action.payload.inputPayload.tmpId],
      };
    case SEND_MESSAGE.SUCCESS:
      const foundRoom1 = state.messageList.find(
        (item) => item.id === action.payload.inputPayload.id,
      );
      const updatedRoom1 = foundRoom1 && {
        ...foundRoom1,
        updated_at: new Date(),
        last_message: {data: action.payload.data},
        users: foundRoom1.users.map((i) =>
          i.id === action.payload.inputPayload?.user?.id
            ? {
                ...i,
                seen_at: new Date(),
              }
            : i,
        ),
      };
      return {
        ...state,
        beingSendMessage: state.beingSendMessage.filter(
          (i) => i !== action.payload.inputPayload.tmpId,
        ),
        messageList: updatedRoom1
          ? [
              updatedRoom1,
              ...state.messageList.filter(
                (item) => item.id !== action.payload.inputPayload.id,
              ),
            ]
          : state.messageList,
        roomMessages:
          state.roomDetail?.id === action.payload.inputPayload.id
            ? [
                action.payload.data,
                ...state.roomMessages.filter(
                  (i) => i.id !== action.payload.inputPayload.tmpId,
                ),
              ]
            : state.roomMessages,
      };
    case SEND_MESSAGE.FAILURE:
      return {
        ...state,
        beingSendMessage: state.beingSendMessage.filter(
          (i) => i !== action.payload.tmpId,
        ),
        roomMessages:
          state.roomDetail?.id === action.payload.id
            ? state.roomMessages.filter((i) => i.id !== action.payload.tmpId)
            : state.roomMessages,
      };
    case GET_ROOM_MESSAGES.REQUEST:
      return {
        ...state,
        roomMessagesLoading: true,
      };
    case GET_ROOM_MESSAGES.SUCCESS:
      return {
        ...state,
        roomMessagesLoading: false,
        roomMessages:
          action.payload?.meta?.pagination?.current_page === 1
            ? action.payload.data
            : [...state.roomMessages, ...action.payload.data],
        roomMessagesLastPage:
          action.payload?.meta?.pagination?.total_pages || 1,
      };
    case GET_ROOM_MESSAGES.FAILURE:
      return {
        ...state,
        roomMessagesLoading: false,
        roomMessagesError: action.payload.error,
      };
    case JOIN_CHAT_ROOM:
      return {
        ...state,
        roomDetail: action.payload,
      };
    case JOIN_CHAT_ROOM_EXPLORE:
      return {
        ...state,
        roomDetail: action.payload,
      };
    case LEAVE_CHAT_ROOM:
      return {
        ...state,
        roomDetail: null,
        roomMessages: [],
        roomMessagesLoading: false,
        roomMessagesLastPage: 1,
        roomMessagesError: null,
      };
    case LIST_CHAT_ROOM.REQUEST:
      return {
        ...state,
        messageLoading: true,
        reset: action.payload.inputPayload.reset,
        typeChat: action.payload.inputPayload.typeChat,
      };
    case LIST_CHAT_ROOM.SUCCESS:
      return {
        ...state,
        messageLoading: false,
        messageList:
          action.payload?.meta?.pagination?.current_page === 1
            ? action.payload.data
            : [...state.messageList, ...action.payload.data],
        messageLastPage: action.payload?.meta?.pagination?.total_pages || 1,
        reset: false,
        typeChat: action.payload.inputPayload.typeChat,
      };
    case LIST_CHAT_ROOM.FAILURE:
      return {
        ...state,
        messageLoading: false,
        messageError: action.payload.error,
        reset: false,
        typeChat: action.payload.inputPayload.typeChat,
      };
    case CREATE_CHAT_ROOM.REQUEST:
      return {
        ...state,
        beingCreateRoom: true,
      };
    case CREATE_CHAT_ROOM.SUCCESS:
      // messageList: !state.messageList.find(
      return {
        ...state,
        beingCreateRoom: false,
        messageList: state.messageList.find(
          (i) =>
            i.id === action.payload.data.id &&
            i.type === action.payload.data.type,
        )
          ? [action.payload.data, ...state.messageList]
          : state.messageList,
        roomDetail: action.payload.data,
      };
    case CREATE_CHAT_ROOM_RELATED_USER.SUCCESS:
      // messageList: !state.messageList.find(
      return {
        ...state,
        roomDetail: action.payload.data,
      };
    case CREATE_CHAT_ROOM_BOT.SUCCESS:
      // messageList: !state.messageList.find(
      return {
        ...state,
        roomDetail: action.payload.data,
      };
    case CREATE_CHAT_ROOM.FAILURE:
      return {
        ...state,
        beingCreateRoom: false,
      };
    case LOGOUT.SUCCESS:
      return INITIAL_STATE;
    case RELOAD_DRAFT_MESSAGE_BY_ROOM_ID:
      return {
        ...state,
        reloadDraftMessageByChatRoom: action.payload,
      };

    case SET_UNSEEN_SINGE:
      return {
        ...state,
        hasUnseenSingle: action.payload,
      };
    case SET_UNSEEN_GROUP:
      return {
        ...state,
        hasUnseenGroup: action.payload,
      };

    default:
      return state;
  }
};
