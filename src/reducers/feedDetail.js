import {
  GET_DETAIL_HELP,
  TOGGLE_LIKE_HELP,
  GET_DETAIL_HANGOUT,
  TOGGLE_LIKE_HANGOUT,
  CREATE_OFFER,
  GET_DETAIL_STATUS,
  TOGGLE_LIKE_STATUS,
  GET_COMMENT_LIST,
  POST_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
  NEW_COMMENT_FROM_SOCKET,
  UPDATE_OFFER_STATUS,
  GET_USER_LIKE_LIST,
  LOGOUT,
  CREATE_OFFER_HELP,
  UPDATE_OFFER_STATUS_HELP,
} from 'actions';

const INITIAL_STATE = {
  hangout: {},
  status: {},
  comment: {},
  like: {},
  help: {},
};

const transformFeedStatus = (feed, status) => {
  if (!feed) {
    return feed;
  }

  if (status === 'cancel') {
    return {
      ...feed,
      data: {
        ...feed.data,
        offered: false,
        offers_count:
          feed.data?.offers_count > 0 ? feed.data?.offers_count - 1 : 0,
      },
    };
  }
  if (status === 'accept') {
    return {
      ...feed,
      data: {
        ...feed.data,
        offers_accepted: (feed.data?.offers_accepted || 0) + 1,
      },
    };
  }
  return feed;
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NEW_COMMENT_FROM_SOCKET:
      return {
        ...state,
        comment: {
          ...state.comment,
          [action.payload.id]: state.comment?.[action.payload.id] && {
            ...state.comment?.[action.payload.id],
            list:
              state.comment?.[action.payload.id]?.list &&
              state.comment?.[action.payload.id]?.list.find(
                (item) => item.id === action.payload.comment.id,
              )
                ? state.comment?.[action.payload.id]?.list
                : [
                    ...state.comment?.[action.payload.id].list,
                    action.payload.comment,
                  ],
          },
        },
      };
    /**
     * POST COMMENT
     */
    case POST_COMMENT.REQUEST:
      return {
        ...state,
        comment: {
          ...state.comment,
          [action.payload.inputPayload.id]: state.comment?.[
            action.payload.inputPayload.id
          ] && {
            ...state.comment?.[action.payload.inputPayload.id],
            posting: true,
          },
        },
      };
    case POST_COMMENT.SUCCESS:
      return {
        ...state,
        comment: {
          ...state.comment,
          [action.payload.inputPayload.id]: state.comment?.[
            action.payload.inputPayload.id
          ] && {
            ...state.comment?.[action.payload.inputPayload.id],
            posting: false,
            list: [
              ...state.comment?.[action.payload.inputPayload.id]?.list,
              action.payload.data,
            ],
          },
        },
        hangout: {
          [action.payload.inputPayload.id]: state.hangout?.[
            action.payload.inputPayload.id
          ] && {
            ...state.hangout?.[action.payload.inputPayload.id],
            data: {
              ...state.hangout?.[action.payload.inputPayload.id].data,
              comment_count:
                state.hangout?.[action.payload.inputPayload.id]?.data
                  ?.comment_count + 1,
            },
          },
        },
        help: {
          [action.payload.inputPayload.id]: state.help?.[
            action.payload.inputPayload.id
          ] && {
            ...state.help?.[action.payload.inputPayload.id],
            data: {
              ...state.help?.[action.payload.inputPayload.id].data,
              comment_count:
                state.help?.[action.payload.inputPayload.id]?.data
                  ?.comment_count + 1,
            },
          },
        },
        status: {
          [action.payload.inputPayload.id]: state.status?.[
            action.payload.inputPayload.id
          ] && {
            ...state.status?.[action.payload.inputPayload.id],
            data: {
              ...state.status?.[action.payload.inputPayload.id].data,
              comment_count:
                state.status?.[action.payload.inputPayload.id]?.data
                  ?.comment_count + 1,
            },
          },
        },
      };
    case POST_COMMENT.FAILURE:
      return {
        ...state,
        comment: {
          ...state.comment,
          [action.payload.inputPayload.id]: state.comment?.[
            action.payload.inputPayload.id
          ] && {
            ...state.comment?.[action.payload.inputPayload.id],
            posting: false,
          },
        },
      };
    /**
     * EDIT COMMENT
     */
    case EDIT_COMMENT.REQUEST:
      return {
        ...state,
        comment: {
          ...state.comment,
          [action.payload.inputPayload.hangoutId]: state.comment?.[
            action.payload.inputPayload.hangoutId
          ] && {
            ...state.comment?.[action.payload.inputPayload.hangoutId],
            posting: action.payload.inputPayload.id,
          },
        },
      };
    case EDIT_COMMENT.SUCCESS:
      return {
        ...state,
        comment: {
          ...state.comment,
          [action.payload.inputPayload.hangoutId]: state.comment?.[
            action.payload.inputPayload.hangoutId
          ] && {
            ...state.comment?.[action.payload.inputPayload.hangoutId],
            posting: false,
            list:
              state.comment?.[action.payload.inputPayload.hangoutId]?.list &&
              state.comment?.[action.payload.inputPayload.hangoutId]?.list.map(
                (item) =>
                  item.id === action.payload.data.id
                    ? action.payload.data
                    : item,
              ),
          },
        },
      };
    case EDIT_COMMENT.FAILURE:
      return {
        ...state,
        comment: {
          ...state.comment,
          [action.payload.inputPayload.hangoutId]: state.comment?.[
            action.payload.inputPayload.hangoutId
          ] && {
            ...state.comment?.[action.payload.inputPayload.hangoutId],
            posting: false,
          },
        },
      };
    /**
     * DELETE COMMENT
     */
    case DELETE_COMMENT.REQUEST:
      return {
        ...state,
        comment: {
          ...state.comment,
          [action.payload.inputPayload.hangoutId]: state.comment?.[
            action.payload.inputPayload.hangoutId
          ] && {
            ...state.comment?.[action.payload.inputPayload.hangoutId],
            deleting: action.payload.inputPayload.id,
          },
        },
      };
    case DELETE_COMMENT.SUCCESS:
      return {
        ...state,
        comment: {
          ...state.comment,
          [action.payload.inputPayload.hangoutId]: state.comment?.[
            action.payload.inputPayload.hangoutId
          ] && {
            ...state.comment?.[action.payload.inputPayload.hangoutId],
            deleting: null,
            list:
              state.comment?.[action.payload.inputPayload.hangoutId]?.list &&
              state.comment?.[
                action.payload.inputPayload.hangoutId
              ]?.list.filter(
                (item) => item.id !== action.payload.inputPayload.id,
              ),
          },
        },
        hangout: {
          [action.payload.inputPayload.hangoutId]: state.hangout?.[
            action.payload.inputPayload.hangoutId
          ] && {
            ...state.hangout?.[action.payload.inputPayload.hangoutId],
            data: {
              ...state.hangout?.[action.payload.inputPayload.hangoutId].data,
              comment_count:
                state.hangout?.[action.payload.inputPayload.hangoutId]?.data
                  ?.comment_count - 1,
            },
          },
        },
        help: {
          [action.payload.inputPayload.hangoutId]: state.help?.[
            action.payload.inputPayload.hangoutId
          ] && {
            ...state.help?.[action.payload.inputPayload.hangoutId],
            data: {
              ...state.help?.[action.payload.inputPayload.hangoutId].data,
              comment_count:
                state.help?.[action.payload.inputPayload.hangoutId]?.data
                  ?.comment_count - 1,
            },
          },
        },
        status: {
          [action.payload.inputPayload.hangoutId]: state.status?.[
            action.payload.inputPayload.hangoutId
          ] && {
            ...state.status?.[action.payload.inputPayload.hangoutId],
            data: {
              ...state.status?.[action.payload.inputPayload.hangoutId].data,
              comment_count:
                state.status?.[action.payload.inputPayload.hangoutId]?.data
                  ?.comment_count - 1,
            },
          },
        },
      };
    case DELETE_COMMENT.FAILURE:
      return {
        ...state,
        comment: {
          ...state.comment,
          [action.payload.inputPayload.hangoutId]: state.comment?.[
            action.payload.inputPayload.hangoutId
          ] && {
            ...state.comment?.[action.payload.inputPayload.hangoutId],
            deleting: null,
          },
        },
      };
    /**
     * GET COMMENT LIST
     */
    case GET_COMMENT_LIST.REQUEST:
      return {
        ...state,
        comment: {
          ...state.comment,
          [action.payload.inputPayload.id]: {
            loading: true,
            error: null,
            list: state.comment?.[action.payload.inputPayload.id]?.list,
            lastPage: state.comment?.[action.payload.inputPayload.id]?.lastPage,
          },
        },
      };
    case GET_COMMENT_LIST.SUCCESS:
      return {
        ...state,
        comment: {
          ...state.comment,
          [action.payload.inputPayload.id]: {
            loading: false,
            list:
              action.payload?.meta?.pagination?.current_page === 1
                ? action.payload.data
                : [
                    ...action.payload.data,
                    ...state.comment?.[action.payload.inputPayload.id]?.list,
                  ],
            lastPage: action.payload?.meta?.pagination?.total_pages,
          },
        },
      };
    case GET_COMMENT_LIST.FAILURE:
      return {
        ...state,
        comment: {
          ...state.comment,
          [action.payload.inputPayload.id]: {
            loading: false,
            error: action.payload.error,
          },
        },
      };
    /**
     * GET USER LIKE LIST
     */
    case GET_USER_LIKE_LIST.REQUEST:
      return {
        ...state,
        like: {
          ...state.like,
          [action.payload.inputPayload.id]: {
            loading: true,
            error: null,
            list: state.like?.[action.payload.inputPayload.id]?.list,
            lastPage: state.like?.[action.payload.inputPayload.id]?.lastPage,
          },
        },
      };
    case GET_USER_LIKE_LIST.SUCCESS:
      return {
        ...state,
        like: {
          ...state.like,
          [action.payload.inputPayload.id]: {
            loading: false,
            list:
              action.payload?.meta?.pagination?.current_page === 1
                ? action.payload.data
                : [
                    ...action.payload.data,
                    ...state.like?.[action.payload.inputPayload.id]?.list,
                  ],
            lastPage: action.payload?.meta?.pagination?.total_pages,
          },
        },
      };
    case GET_USER_LIKE_LIST.FAILURE:
      return {
        ...state,
        like: {
          ...state.like,
          [action.payload.inputPayload.id]: {
            loading: false,
            error: action.payload.error,
          },
        },
      };
    /**
     * UPDATE OFFER STATUS
     */
    case UPDATE_OFFER_STATUS.SUCCESS:
      return {
        ...state,
        hangout: {
          ...state.hangout,
          [action.payload.inputPayload.hangoutId]: transformFeedStatus(
            state.hangout?.[action.payload.inputPayload.hangoutId],
            action.payload.inputPayload.status,
          ),
        },
      };

    case UPDATE_OFFER_STATUS_HELP.SUCCESS:
      return {
        ...state,
        help: {
          ...state.help,
          [action.payload.inputPayload.helpId]:
            action.payload.inputPayload.status === 'cancel' &&
            state.help?.[action.payload.inputPayload.helpId]
              ? {
                  ...state.help?.[action.payload.inputPayload.helpId],
                  data: {
                    ...state.help?.[action.payload.inputPayload.helpId]?.data,
                    offered: false,
                    offers_count:
                      state.help?.[action.payload.inputPayload.helpId]?.data
                        ?.offers_count > 0
                        ? state.help?.[action.payload.inputPayload.helpId]?.data
                            ?.offers_count - 1
                        : 0,
                  },
                }
              : state.help?.[action.payload.inputPayload.helpId],
        },
      };

    /**
     * CREATE OFFER
     */
    case CREATE_OFFER.SUCCESS:
      return {
        ...state,
        hangout: {
          ...state.hangout,
          [action.payload.inputPayload.hangoutId]: state.hangout?.[
            action.payload.inputPayload.hangoutId
          ] && {
            ...state.hangout?.[action.payload.inputPayload.hangoutId],
            data: {
              ...state.hangout?.[action.payload.inputPayload.hangoutId]?.data,
              offered: true,
              offers_count:
                state.hangout?.[action.payload.inputPayload.hangoutId]?.data
                  ?.offers_count + 1,
            },
          },
        },
      };

    case CREATE_OFFER_HELP.SUCCESS:
      return {
        ...state,
        help: {
          ...state.help,
          [action.payload.inputPayload.helpId]: state.help?.[
            action.payload.inputPayload.helpId
          ] && {
            ...state.help?.[action.payload.inputPayload.helpId],
            data: {
              ...state.help?.[action.payload.inputPayload.helpId]?.data,
              offered: true,
              offers_count:
                state.help?.[action.payload.inputPayload.helpId]?.data
                  ?.offers_count + 1,
            },
          },
        },
      };
    /**
     * LIKE HANGOUT
     */
    case TOGGLE_LIKE_HANGOUT.REQUEST:
      return {
        ...state,
        hangout: {
          ...state.hangout,
          [action.payload.inputPayload.hangoutId]: state.hangout?.[
            action.payload.inputPayload.hangoutId
          ] && {
            ...state.hangout?.[action.payload.inputPayload.hangoutId],
            data: {
              ...state.hangout?.[action.payload.inputPayload.hangoutId].data,
            },
          },
        },
      };
    case TOGGLE_LIKE_HANGOUT.SUCCESS:
      return {
        ...state,
        hangout: {
          ...state.hangout,
          [action.payload.inputPayload.hangoutId]: state.hangout?.[
            action.payload.inputPayload.hangoutId
          ] && {
            ...state.hangout?.[action.payload.inputPayload.hangoutId],
            data: {
              ...state.hangout?.[action.payload.inputPayload.hangoutId].data,
              liked: action.payload?.data?.message === 'liked' ? true : false,
              like_count: action.payload?.data.count,
            },
          },
        },
      };
    /**
     * LIKE HELP
     */
    case TOGGLE_LIKE_HELP.REQUEST:
      return {
        ...state,
        help: {
          ...state.help,
          [action.payload.inputPayload.helpId]: state.help?.[
            action.payload.inputPayload.helpId
          ] && {
            ...state.help?.[action.payload.inputPayload.helpId],
            data: {
              ...state.help?.[action.payload.inputPayload.helpId].data,
            },
          },
        },
      };
    case TOGGLE_LIKE_HELP.SUCCESS:
      return {
        ...state,
        help: {
          ...state.help,
          [action.payload.inputPayload.helpId]: state.help?.[
            action.payload.inputPayload.helpId
          ] && {
            ...state.help?.[action.payload.inputPayload.helpId],
            data: {
              ...state.help?.[action.payload.inputPayload.helpId].data,
              liked: action.payload?.data?.message === 'liked' ? true : false,
              like_count: action.payload?.data.count,
            },
          },
        },
      };
    case TOGGLE_LIKE_HELP.FAILURE:
      return {
        ...state,
        help: {
          ...state.help,
          [action.payload.inputPayload.helpId]: state.help?.[
            action.payload.inputPayload.helpId
          ] && {
            ...state.help?.[action.payload.inputPayload.helpId],
            data: {
              ...state.help?.[action.payload.inputPayload.helpId].data,
            },
          },
        },
      };
    /**
     * LIKE STATUS
     */
    case TOGGLE_LIKE_STATUS.REQUEST:
      return {
        ...state,
        status: {
          ...state.status,
          [action.payload.inputPayload.statusId]: state.status?.[
            action.payload.inputPayload.statusId
          ] && {
            ...state.status?.[action.payload.inputPayload.statusId],
            data: {
              ...state.status?.[action.payload.inputPayload.statusId].data,
            },
          },
        },
      };
    case TOGGLE_LIKE_STATUS.SUCCESS:
      return {
        ...state,
        status: {
          ...state.status,
          [action.payload.inputPayload.statusId]: state.status?.[
            action.payload.inputPayload.statusId
          ] && {
            ...state.status?.[action.payload.inputPayload.statusId],
            data: {
              ...state.status?.[action.payload.inputPayload.statusId].data,
              liked: action.payload?.data?.message === 'liked' ? true : false,
              like_count: action.payload?.data.count,
            },
          },
        },
      };
    case TOGGLE_LIKE_STATUS.FAILURE:
      return {
        ...state,
        status: {
          ...state.status,
          [action.payload.inputPayload.statusId]: state.status?.[
            action.payload.inputPayload.statusId
          ] && {
            ...state.status?.[action.payload.inputPayload.statusId],
            data: {
              ...state.status?.[action.payload.inputPayload.statusId].data,
            },
          },
        },
      };
    /**
     * GET DETAIL HANGOUT
     */
    case GET_DETAIL_HANGOUT.REQUEST:
      return {
        ...state,
        hangout: {
          ...state.hangout,
          [action.payload.inputPayload.hangoutId]: {
            loading: true,
            error: null,
            data: state.hangout?.[action.payload.inputPayload.hangoutId]?.data,
          },
        },
      };
    case GET_DETAIL_HANGOUT.SUCCESS:
      return {
        ...state,
        hangout: {
          ...state.hangout,
          [action.payload.inputPayload.hangoutId]: {
            loading: false,
            data: action.payload.data,
          },
        },
      };
    case GET_DETAIL_HANGOUT.FAILURE:
      return {
        ...state,
        hangout: {
          ...state.hangout,
          [action.payload.inputPayload.hangoutId]: {
            loading: false,
            error: action.payload.error,
            data: null,
          },
        },
      };
    /**
     * GET DETAIL HELP
     */
    case GET_DETAIL_HELP.REQUEST:
      return {
        ...state,
        help: {
          ...state.help,
          [action.payload.inputPayload.helpId]: {
            loading: true,
            error: null,
            data: state.help?.[action.payload.inputPayload.helpId]?.data,
          },
        },
      };
    case GET_DETAIL_HELP.SUCCESS:
      return {
        ...state,
        help: {
          ...state.help,
          [action.payload.inputPayload.helpId]: {
            loading: false,
            data: action.payload.data,
          },
        },
      };
    case GET_DETAIL_HELP.FAILURE:
      return {
        ...state,
        help: {
          ...state.help,
          [action.payload.inputPayload.helpId]: {
            loading: false,
            error: action.payload.error,
            data: null,
          },
        },
      };

    /**
     * GET DETAIL STATUS
     */
    case GET_DETAIL_STATUS.REQUEST:
      return {
        ...state,
        status: {
          ...state.status,
          [action.payload.inputPayload.statusId]: {
            loading: true,
            error: null,
            data: state.status?.[action.payload.inputPayload.statusId]?.data,
          },
        },
      };
    case GET_DETAIL_STATUS.SUCCESS:
      return {
        ...state,
        status: {
          ...state.status,
          [action.payload.inputPayload.statusId]: {
            loading: false,
            data: action.payload.data,
          },
        },
      };
    case GET_DETAIL_STATUS.FAILURE:
      return {
        ...state,
        status: {
          ...state.status,
          [action.payload.inputPayload.statusId]: {
            loading: false,
            error: action.payload.error,
            data: null,
          },
        },
      };
    case LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};
