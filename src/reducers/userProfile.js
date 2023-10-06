import {
  GET_DETAIL_USER,
  SEND_FRIEND_REQUEST,
  REMOVE_FRIEND_REQUEST,
  REJECT_FRIEND_REQUEST,
  ACCEPT_FRIEND_REQUEST,
  UNFRIEND,
  FOLLOW,
  UNFOLLOW,
  NOTI_FRIEND_ACCEPTED,
  LOGOUT,
} from 'actions';
import {FRIENDSHIP} from 'utils/constants';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FOLLOW.SUCCESS:
      return {
        ...state,
        [action.payload.inputPayload.userId]: state?.[
          action.payload.inputPayload.userId
        ] && {
          ...state?.[action.payload.inputPayload.userId],
          data: {
            ...state?.[action.payload.inputPayload.userId]?.data,
            follow: action.payload.data.id,
            relation: {
              ...state?.[action.payload.inputPayload.userId]?.data?.relation,
              follower:
                state?.[action.payload.inputPayload.userId]?.data?.relation
                  ?.follower + 1,
            },
          },
        },
      };
    case UNFOLLOW.SUCCESS:
      return {
        ...state,
        [action.payload.inputPayload.userId]: state?.[
          action.payload.inputPayload.userId
        ] && {
          ...state?.[action.payload.inputPayload.userId],
          data: {
            ...state?.[action.payload.inputPayload.userId]?.data,
            follow: null,
            relation: {
              ...state?.[action.payload.inputPayload.userId]?.data?.relation,
              follower:
                state?.[action.payload.inputPayload.userId]?.data?.relation
                  ?.follower > 0
                  ? state?.[action.payload.inputPayload.userId]?.data?.relation
                      ?.follower - 1
                  : 0,
            },
          },
        },
      };
    case ACCEPT_FRIEND_REQUEST.SUCCESS:
      return {
        ...state,
        [action.payload.inputPayload.userId]: state?.[
          action.payload.inputPayload.userId
        ] && {
          data: {
            ...state?.[action.payload.inputPayload.userId]?.data,
            friendship: {
              ...state?.[action.payload.inputPayload.userId]?.data?.friendship,
              status: FRIENDSHIP.FRIEND,
            },
            relation: {
              ...state?.[action.payload.inputPayload.userId]?.data?.relation,
              friend:
                state?.[action.payload.inputPayload.userId]?.data?.relation
                  .friend + 1,
            },
          },
        },
      };
    case REJECT_FRIEND_REQUEST.SUCCESS:
      return {
        ...state,
        [action.payload.inputPayload.userId]: state?.[
          action.payload.inputPayload.userId
        ] && {
          data: {
            ...state?.[action.payload.inputPayload.userId]?.data,
            friendship: {
              ...state?.[action.payload.inputPayload.userId]?.data?.friendship,
              status: FRIENDSHIP.GUEST,
              id: null,
            },
          },
        },
      };
    case REMOVE_FRIEND_REQUEST.SUCCESS:
      return {
        ...state,
        [action.payload.inputPayload.userId]: state?.[
          action.payload.inputPayload.userId
        ] && {
          data: {
            ...state?.[action.payload.inputPayload.userId]?.data,
            friendship: {
              ...state?.[action.payload.inputPayload.userId]?.data?.friendship,
              status: FRIENDSHIP.GUEST,
              id: null,
            },
            relation: {
              ...state?.[action.payload.inputPayload.userId]?.data?.relation,
              follower:
                state?.[action.payload.inputPayload.userId]?.data?.relation
                  ?.follower > 0
                  ? state?.[action.payload.inputPayload.userId]?.data?.relation
                      ?.follower - 1
                  : 0,
            },
          },
        },
      };
    case UNFRIEND.SUCCESS:
      return {
        ...state,
        [action.payload.inputPayload.userId]: state?.[
          action.payload.inputPayload.userId
        ] && {
          data: {
            ...state?.[action.payload.inputPayload.userId]?.data,
            friendship: {
              ...state?.[action.payload.inputPayload.userId]?.data?.friendship,
              status: FRIENDSHIP.GUEST,
              id: null,
            },
            relation: {
              ...state?.[action.payload.inputPayload.userId]?.data?.relation,
              friend:
                state?.[action.payload.inputPayload.userId]?.data?.relation
                  ?.friend > 0
                  ? state?.[action.payload.inputPayload.userId]?.data?.relation
                      ?.friend - 1
                  : 0,
              follower:
                state?.[action.payload.inputPayload.userId]?.data?.relation
                  ?.follower > 0
                  ? state?.[action.payload.inputPayload.userId]?.data?.relation
                      ?.follower - 1
                  : 0,
            },
          },
        },
      };
    case SEND_FRIEND_REQUEST.SUCCESS:
      return {
        ...state,
        [action.payload.inputPayload.id]: state?.[
          action.payload.inputPayload.id
        ] && {
          data: {
            ...state?.[action.payload.inputPayload.id]?.data,
            friendship: {
              ...state?.[action.payload.inputPayload.id]?.data?.friendship,
              status: FRIENDSHIP.REQUESTED,
              id: action.payload.data.id,
            },
            relation: {
              ...state?.[action.payload.inputPayload.id]?.data?.relation,
              follower:
                state?.[action.payload.inputPayload.id]?.data?.relation
                  ?.follower + 1,
            },
          },
        },
      };
    case GET_DETAIL_USER.REQUEST:
      return {
        ...state,
        [action.payload.inputPayload.userId]: {
          loading: true,
          error: null,
          data: state?.[action.payload.inputPayload.userId]?.data,
        },
      };
    case GET_DETAIL_USER.SUCCESS:
      return {
        ...state,
        [action.payload.inputPayload.userId]: {
          loading: false,
          data: action.payload.data,
        },
      };
    case GET_DETAIL_USER.FAILURE:
      return {
        ...state,
        [action.payload.inputPayload.userId]: {
          loading: false,
          error: action.payload.error,
          data: null,
        },
      };
    case NOTI_FRIEND_ACCEPTED:
      const relation = JSON.parse(action.payload.relation);
      return {
        ...state,
        [relation.id]: state?.[relation.id] && {
          data: {
            ...state?.[relation.id]?.data,
            friendship: {
              ...state?.[relation.id]?.data?.friendship,
              status: FRIENDSHIP.FRIEND,
              id: relation.friend_request_id,
            },
            follow: true,
            relation: {
              ...state?.[relation.id]?.data?.relation,
              friend: state?.[relation.id]?.data?.relation?.friend + 1,
              follower: state?.[relation.id]?.data?.relation?.follower + 1,
            },
          },
        },
      };
    case LOGOUT.SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
