import {
  GET_FRIEND_LIST,
  GET_FOLLOWER_LIST,
  GET_FOLLOWING_LIST,
  SEND_FRIEND_REQUEST,
  GET_FRIEND_REQUEST_LIST,
  ACCEPT_FRIEND_REQUEST,
  REJECT_FRIEND_REQUEST,
  REMOVE_FRIEND_REQUEST,
  UNFRIEND,
  FOLLOW,
  UNFOLLOW,
  BLOCK_USER,
  UNBLOCK_USER,
  GET_BLOCK_LIST,
  LOGOUT,
  EDIT_CONTACT_SEARCH,
} from 'actions';

const INITIAL_STATE = {
  friend: {},
  follower: {},
  following: {},
  requestList: [],
  requestLoading: false,
  requestLastPage: 1,
  requestError: null,
  blockList: [],
  blockListLoading: false,
  blockListLastPage: 1,
  blockListError: null,
  requesting: [],
  beingFollow: [],
  beingBlock: [],
  search: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EDIT_CONTACT_SEARCH:
      return {
        ...state,
        search: {
          ...state.search,
          [action.payload.userId]: action.payload.value,
        },
      };
    case UNFOLLOW.REQUEST:
      return {
        ...state,
        beingFollow: state.beingFollow
          ? [...state.beingFollow, action.payload.inputPayload.userId]
          : [action.payload.inputPayload.userId],
      };
    case UNFOLLOW.SUCCESS:
      return {
        ...state,
        beingFollow: state.beingFollow.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
      };
    case UNFOLLOW.FAILURE:
      return {
        ...state,
        beingFollow: state.beingFollow.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
      };
    case FOLLOW.REQUEST:
      return {
        ...state,
        beingFollow: state.beingFollow
          ? [...state.beingFollow, action.payload.inputPayload.userId]
          : [action.payload.inputPayload.userId],
      };
    case FOLLOW.SUCCESS:
      return {
        ...state,
        beingFollow: state.beingFollow.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
      };
    case FOLLOW.FAILURE:
      return {
        ...state,
        beingFollow: state.beingFollow.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
      };
    case BLOCK_USER.REQUEST:
      return {
        ...state,
        beingBlock: state.beingBlock
          ? [...state.beingBlock, action.payload.inputPayload.userId]
          : [action.payload.inputPayload.userId],
      };
    case BLOCK_USER.SUCCESS:
      return {
        ...state,
        beingBlock: state.beingBlock.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
      };
    case BLOCK_USER.FAILURE:
      return {
        ...state,
        beingBlock: state.beingBlock.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
      };
    case UNBLOCK_USER.REQUEST:
      return {
        ...state,
        beingBlock: state.beingBlock
          ? [...state.beingBlock, action.payload.inputPayload.userId]
          : [action.payload.inputPayload.userId],
      };
    case UNBLOCK_USER.SUCCESS:
      return {
        ...state,
        beingBlock: state.beingBlock.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
        blockList: state.blockList.filter(
          (i) => i.id !== action.payload.inputPayload.id,
        ),
      };
    case UNBLOCK_USER.FAILURE:
      return {
        ...state,
        beingBlock: state.beingBlock.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
      };
    case REJECT_FRIEND_REQUEST.REQUEST:
      return {
        ...state,
        requesting: state.requesting
          ? [...state.requesting, action.payload.inputPayload.userId]
          : [action.payload.inputPayload.userId],
      };
    case REJECT_FRIEND_REQUEST.SUCCESS:
      return {
        ...state,
        requesting: state.requesting.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
        requestList: state.requestList.filter(
          (i) => i.user.id !== action.payload.inputPayload.userId,
        ),
      };
    case REJECT_FRIEND_REQUEST.FAILURE:
      return {
        ...state,
        requesting: state.requesting.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
      };
    case ACCEPT_FRIEND_REQUEST.REQUEST:
      return {
        ...state,
        requesting: state.requesting
          ? [...state.requesting, action.payload.inputPayload.userId]
          : [action.payload.inputPayload.userId],
      };
    case ACCEPT_FRIEND_REQUEST.SUCCESS:
      return {
        ...state,
        requesting: state.requesting.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
        requestList: state.requestList.filter(
          (i) => i.user.id !== action.payload.inputPayload.userId,
        ),
      };
    case ACCEPT_FRIEND_REQUEST.FAILURE:
      return {
        ...state,
        requesting: state.requesting.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
      };
    case REMOVE_FRIEND_REQUEST.REQUEST:
      return {
        ...state,
        requesting: state.requesting
          ? [...state.requesting, action.payload.inputPayload.userId]
          : [action.payload.inputPayload.userId],
      };
    case REMOVE_FRIEND_REQUEST.SUCCESS:
      return {
        ...state,
        requesting: state.requesting.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
      };
    case REMOVE_FRIEND_REQUEST.FAILURE:
      return {
        ...state,
        requesting: state.requesting.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
      };
    case UNFRIEND.REQUEST:
      return {
        ...state,
        requesting: state.requesting
          ? [...state.requesting, action.payload.inputPayload.userId]
          : [action.payload.inputPayload.userId],
      };
    case UNFRIEND.SUCCESS:
      return {
        ...state,
        requesting: state.requesting.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
      };
    case UNFRIEND.FAILURE:
      return {
        ...state,
        requesting: state.requesting.filter(
          (i) => i !== action.payload.inputPayload.userId,
        ),
      };
    case SEND_FRIEND_REQUEST.REQUEST:
      return {
        ...state,
        requesting: state.requesting
          ? [...state.requesting, action.payload.inputPayload.id]
          : [action.payload.inputPayload.id],
      };
    case SEND_FRIEND_REQUEST.SUCCESS:
      return {
        ...state,
        requesting: state.requesting.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
      };
    case SEND_FRIEND_REQUEST.FAILURE:
      return {
        ...state,
        requesting: state.requesting.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
      };
    case GET_FRIEND_REQUEST_LIST.REQUEST:
      return {
        ...state,
        requestLoading: true,
        requestList:
          action.payload?.params?.page === 1 ? [] : state.requestList,
      };
    case GET_FRIEND_REQUEST_LIST.SUCCESS:
      return {
        ...state,
        requestLoading: false,
        requestList:
          action.payload?.meta?.pagination?.current_page === 1
            ? action.payload.data
            : [...state.requestList, ...action.payload.data],
        requestLastPage: action.payload.meta?.pagination?.total_pages || 1,
      };
    case GET_FRIEND_REQUEST_LIST.FAILURE:
      return {
        ...state,
        requestLoading: false,
        requestError: action.payload.error,
      };
    case GET_BLOCK_LIST.REQUEST:
      return {
        ...state,
        blockListLoading: true,
        blockList: action.payload?.params?.page === 1 ? [] : state.blockList,
      };
    case GET_BLOCK_LIST.SUCCESS:
      return {
        ...state,
        blockListLoading: false,
        blockList:
          action.payload?.meta?.pagination?.current_page === 1
            ? action.payload.data
            : [...state.blockList, ...action.payload.data],
        blockListLastPage: action.payload.meta?.pagination?.total_pages || 1,
      };
    case GET_BLOCK_LIST.FAILURE:
      return {
        ...state,
        blockListLoading: false,
        blockListError: action.payload.error,
      };
    case GET_FRIEND_LIST.REQUEST:
      return {
        ...state,
        friend: {
          ...state.friend,
          [action.payload.inputPayload.userId || 'me']: {
            loading: true,
            list: state.friend?.[action.payload.inputPayload.userId || 'me']
              ?.list,
            lastPage:
              state.friend?.[action.payload.inputPayload.userId || 'me']
                ?.lastPage,
            error: null,
          },
        },
      };
    case GET_FRIEND_LIST.SUCCESS:
      return {
        ...state,
        friend: {
          ...state.friend,
          [action.payload.inputPayload.userId || 'me']: {
            loading: false,
            list:
              action.payload?.meta?.pagination?.current_page === 1
                ? action.payload.data
                : [
                    ...state.friend?.[
                      action.payload.inputPayload.userId || 'me'
                    ]?.list,
                    ...action.payload.data,
                  ],
            lastPage: action.payload.meta?.pagination?.total_pages,
          },
        },
      };
    case GET_FRIEND_LIST.FAILURE:
      return {
        ...state,
        friend: {
          ...state.friend,
          [action.payload.inputPayload.userId || 'me']: {
            loading: false,
            list: [],
            lastPage: 1,
            error: action.payload.error,
          },
        },
      };
    case GET_FOLLOWER_LIST.REQUEST:
      return {
        ...state,
        follower: {
          ...state.follower,
          [action.payload.inputPayload.userId || 'me']: {
            loading: true,
            list: state.follower?.[action.payload.inputPayload.userId || 'me']
              ?.list,
            lastPage:
              state.follower?.[action.payload.inputPayload.userId || 'me']
                ?.lastPage,
            error: null,
          },
        },
      };
    case GET_FOLLOWER_LIST.SUCCESS:
      return {
        ...state,
        follower: {
          ...state.follower,
          [action.payload.inputPayload.userId || 'me']: {
            loading: false,
            list:
              action.payload?.meta?.pagination?.current_page === 1
                ? action.payload.data
                : [
                    ...state.follower?.[
                      action.payload.inputPayload.userId || 'me'
                    ]?.list,
                    ...action.payload.data,
                  ],
            lastPage: action.payload.meta?.pagination?.total_pages,
          },
        },
      };
    case GET_FOLLOWER_LIST.FAILURE:
      return {
        ...state,
        follower: {
          ...state.follower,
          [action.payload.inputPayload.userId || 'me']: {
            loading: false,
            list: [],
            lastPage: 1,
            error: action.payload.error,
          },
        },
      };
    case GET_FOLLOWING_LIST.REQUEST:
      return {
        ...state,
        following: {
          ...state.following,
          [action.payload.inputPayload.userId || 'me']: {
            loading: true,
            list: state.following?.[action.payload.inputPayload.userId || 'me']
              ?.list,
            lastPage:
              state.following?.[action.payload.inputPayload.userId || 'me']
                ?.lastPage,
            error: null,
          },
        },
      };
    case GET_FOLLOWING_LIST.SUCCESS:
      return {
        ...state,
        following: {
          ...state.following,
          [action.payload.inputPayload.userId || 'me']: {
            loading: false,
            list:
              action.payload?.meta?.pagination?.current_page === 1
                ? action.payload.data
                : [
                    ...state.following?.[
                      action.payload.inputPayload.userId || 'me'
                    ]?.list,
                    ...action.payload.data,
                  ],
            lastPage: action.payload.meta?.pagination?.total_pages,
          },
        },
      };
    case GET_FOLLOWING_LIST.FAILURE:
      return {
        ...state,
        following: {
          ...state.following,
          [action.payload.inputPayload.userId || 'me']: {
            loading: false,
            list: [],
            lastPage: 1,
            error: action.payload.error,
          },
        },
      };
    case LOGOUT.SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
