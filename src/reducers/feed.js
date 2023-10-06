import uuid from 'uuid/v4';
import {
  UPLOAD_SINGLE_IMAGE,
  CREATE_HANGOUT,
  CREATE_STATUS,
  GET_RECOMMEND_HANGOUTS,
  GET_NEARBY_HANGOUTS,
  GET_MAP_HANGOUTS,
  CREATE_OFFER,
  UPDATE_OFFER_STATUS,
  TOGGLE_LIKE_HANGOUT,
  TOGGLE_LIKE_HELP,
  TOGGLE_LIKE_STATUS,
  LOGOUT,
  GET_SELF_FEED,
  GET_USER_FEED,
  GET_NEWS_FEED,
  UPDATE_HANGOUT,
  DELETE_HANGOUT,
  UPDATE_STATUS,
  DELETE_STATUS,
  NEW_FEED_FROM_SOCKET,
  CREATE_HELP,
  UPDATE_HELP,
  DELETE_HELP,
  CHANGE_HANGOUT_STATUS,
  CHANGE_HELP_STATUS,
  CREATE_OFFER_HELP,
  UPDATE_OFFER_STATUS_HELP,
  LIST_CHAT_ROOM_PUBLIC,
} from 'actions';
import {EnumHangoutStatus} from 'utils/constants';

const INITIAL_STATE = {
  beingUploadSingle: false,
  beingCreateHangout: false,
  beingCreateStatus: false,
  beingCreateHelp: false,
  selfFeed: [],
  selfFeedLoading: false,
  selfFeedLastPage: 1,
  selfFeedError: null,
  userFeed: {},
  newsFeed: [],
  newsFeedLoading: false,
  newsFeedLastPage: 1,
  newsFeedError: null,
  recommendList: [],
  recommendListLoading: false,
  recommendListLastPage: 1,
  nearbyList: [],
  nearbyListLoading: false,
  nearbyListLastPage: 1,
  mapList: [],
  mapListLoading: false,
  mapListLastPage: 1,
  beingCreateOffer: [],
  beingUpdateOffer: [],
  beingCreateOfferHelp: [],
  beingUpdateOfferHelp: [],
  beingToggleLike: [],
  beingDeleteHangout: [],
  beingUpdateHangout: [],
  beingDeleteHelp: [],
  beingUpdateHelp: [],
  beingDeleteStatus: [],
  beingUpdateStatus: [],
  hasNewFeed: false,

  chatRoomPublicList: [],
  chatRoomPublicListLoading: false,
  chatRoomPublicListLastPage: 1,
};

const transformFeedStatus = (feed, hangoutId, status) => {
  if (status === 'cancel') {
    return feed.map((item) =>
      item?.relation?.data?.id === hangoutId
        ? {
            ...item,
            relation: {
              data: {
                ...item.relation.data,
                offered: false,
                offers_count:
                  item.relation.data.offers_count > 0
                    ? item.relation.data.offers_count - 1
                    : 0,
              },
            },
          }
        : item,
    );
  }
  if (status === 'accept') {
    return feed.map((item) =>
      item?.relation?.data?.id === hangoutId
        ? {
            ...item,
            relation: {
              data: {
                ...item.relation.data,
                offers_accepted: (item.relation.data.offers_accepted || 0) + 1,
              },
            },
          }
        : item,
    );
  }
  return feed;
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NEW_FEED_FROM_SOCKET:
      return {
        ...state,
        hasNewFeed: true,
      };
    case UPDATE_HANGOUT.REQUEST:
      return {
        ...state,
        beingUpdateHangout: state.beingUpdateHangout
          ? [...state.beingUpdateHangout, action.payload.inputPayload.id]
          : [action.payload.inputPayload.id],
      };
    case UPDATE_HANGOUT.SUCCESS:
      return {
        ...state,
        beingUpdateHangout: state.beingUpdateHangout.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
        newsFeed: state.newsFeed.map((item) =>
          item?.relation?.data?.id !== action.payload.inputPayload.id
            ? item
            : {
                ...item,
                relation: {
                  data: action.payload.data,
                },
              },
        ),
        selfFeed: state.selfFeed.map((item) =>
          item?.relation?.data?.id !== action.payload.inputPayload.id
            ? item
            : {
                ...item,
                relation: {
                  data: action.payload.data,
                },
              },
        ),
      };
    case UPDATE_HANGOUT.FAILURE:
      return {
        ...state,
        beingUpdateHangout: state.beingUpdateHangout.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
      };
    case UPDATE_HELP.REQUEST:
      return {
        ...state,
        beingUpdateHelp: state.beingUpdateHelp
          ? [...state.beingUpdateHelp, action.payload.inputPayload.id]
          : [action.payload.inputPayload.id],
      };
    case UPDATE_HELP.SUCCESS:
      return {
        ...state,
        beingUpdateHelp: state.beingUpdateHelp.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
        newsFeed: state.newsFeed.map((item) =>
          item?.relation?.data?.id !== action.payload.inputPayload.id
            ? item
            : {
                ...item,
                relation: {
                  data: action.payload.data,
                },
              },
        ),
        selfFeed: state.selfFeed.map((item) =>
          item?.relation?.data?.id !== action.payload.inputPayload.id
            ? item
            : {
                ...item,
                relation: {
                  data: action.payload.data,
                },
              },
        ),
      };
    case UPDATE_HELP.FAILURE:
      return {
        ...state,
        beingUpdateHelp: state.beingUpdateHelp.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
      };
    case DELETE_HELP.REQUEST:
      return {
        ...state,
        beingDeleteHelp: state.beingDeleteHelp
          ? [...state.beingDeleteHelp, action.payload.inputPayload.id]
          : [action.payload.inputPayload.id],
      };
    case DELETE_HELP.SUCCESS:
      return {
        ...state,
        beingDeleteHelp: state.beingDeleteHelp.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
        newsFeed: state.newsFeed.filter(
          (item) => item?.relation?.data?.id !== action.payload.inputPayload.id,
        ),
        selfFeed: state.selfFeed.filter(
          (item) => item?.relation?.data?.id !== action.payload.inputPayload.id,
        ),
      };
    case DELETE_HELP.FAILURE:
      return {
        ...state,
        beingDeleteHelp: state.beingDeleteHelp.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
      };
    case DELETE_HANGOUT.REQUEST:
      return {
        ...state,
        beingDeleteHangout: state.beingDeleteHangout
          ? [...state.beingDeleteHangout, action.payload.inputPayload.id]
          : [action.payload.inputPayload.id],
      };
    case DELETE_HANGOUT.SUCCESS:
      return {
        ...state,
        beingDeleteHangout: state.beingDeleteHangout.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
        newsFeed: state.newsFeed.filter(
          (item) => item?.relation?.data?.id !== action.payload.inputPayload.id,
        ),
        selfFeed: state.selfFeed.filter(
          (item) => item?.relation?.data?.id !== action.payload.inputPayload.id,
        ),
      };
    case DELETE_HANGOUT.FAILURE:
      return {
        ...state,
        beingDeleteHangout: state.beingDeleteHangout.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
      };
    case UPDATE_STATUS.REQUEST:
      return {
        ...state,
        beingUpdateStatus: state.beingUpdateStatus
          ? [...state.beingUpdateStatus, action.payload.inputPayload.id]
          : [action.payload.inputPayload.id],
      };
    case UPDATE_STATUS.SUCCESS:
      return {
        ...state,
        beingUpdateStatus: state.beingUpdateStatus.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
        newsFeed: state.newsFeed.map((item) =>
          item?.relation?.data?.id !== action.payload.inputPayload.id
            ? item
            : {
                ...item,
                relation: {
                  data: action.payload.data,
                },
              },
        ),
        selfFeed: state.selfFeed.map((item) =>
          item?.relation?.data?.id !== action.payload.inputPayload.id
            ? item
            : {
                ...item,
                relation: {
                  data: action.payload.data,
                },
              },
        ),
      };
    case UPDATE_STATUS.FAILURE:
      return {
        ...state,
        beingUpdateStatus: state.beingUpdateStatus.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
      };
    case DELETE_STATUS.REQUEST:
      return {
        ...state,
        beingDeleteStatus: state.beingDeleteStatus
          ? [...state.beingDeleteStatus, action.payload.inputPayload.id]
          : [action.payload.inputPayload.id],
      };
    case DELETE_STATUS.SUCCESS:
      return {
        ...state,
        beingDeleteStatus: state.beingDeleteStatus.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
        newsFeed: state.newsFeed.filter(
          (item) => item?.relation?.data?.id !== action.payload.inputPayload.id,
        ),
        selfFeed: state.selfFeed.filter(
          (item) => item?.relation?.data?.id !== action.payload.inputPayload.id,
        ),
      };
    case DELETE_STATUS.FAILURE:
      return {
        ...state,
        beingDeleteStatus: state.beingDeleteStatus.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
      };
    case GET_USER_FEED.REQUEST:
      return {
        ...state,
        userFeed: {
          ...state.userFeed,
          [action.payload.inputPayload.userId]: {
            loading: true,
            error: null,
            list: state?.userFeed?.[action.payload.inputPayload.userId]?.list,
            lastPage:
              state?.userFeed?.[action.payload.inputPayload.userId]?.lastPage,
          },
        },
      };
    case GET_USER_FEED.SUCCESS:
      return {
        ...state,
        userFeed: {
          ...state.userFeed,
          [action.payload.inputPayload.userId]: {
            loading: false,
            list:
              action.payload?.meta?.pagination?.current_page === 1
                ? action.payload.data
                : [
                    ...state.userFeed?.[action.payload.inputPayload.userId]
                      ?.list,
                    ...action.payload.data,
                  ],
            lastPage: action.payload?.meta?.pagination?.total_pages,
          },
        },
      };
    case GET_USER_FEED.FAILURE:
      return {
        ...state,
        userFeed: {
          ...state.userFeed,
          [action.payload.inputPayload.userId]: {
            loading: false,
            error: action.payload.error,
            list: [],
            lastPage: 1,
          },
        },
      };
    case TOGGLE_LIKE_HANGOUT.REQUEST:
      return {
        ...state,
        beingToggleLike: state.beingToggleLike
          ? [...state.beingToggleLike]
          : [action.payload.inputPayload.hangoutId],
      };
    case TOGGLE_LIKE_HANGOUT.SUCCESS:
      return {
        ...state,
        beingToggleLike: state.beingToggleLike.filter(
          (i) => i !== action.payload.inputPayload.hangoutId,
        ),
        newsFeed: state.newsFeed.map((item) =>
          item?.relation?.data?.id === action.payload.inputPayload.hangoutId
            ? {
                ...item,
                relation: {
                  data: {
                    ...item.relation.data,
                    liked:
                      action.payload?.data?.message === 'liked' ? true : false,
                    like_count: action.payload?.data.count,
                  },
                },
              }
            : item,
        ),
        selfFeed: state.selfFeed.map((item) =>
          item?.relation?.data?.id === action.payload.inputPayload.hangoutId
            ? {
                ...item,
                relation: {
                  data: {
                    ...item.relation.data,
                    liked:
                      action.payload?.data?.message === 'liked' ? true : false,
                    like_count: action.payload?.data.count,
                  },
                },
              }
            : item,
        ),
        userFeed: {
          ...state.userFeed,
          [action.payload.inputPayload.userId]: state.userFeed?.[
            action.payload.inputPayload.userId
          ] && {
            list: state.userFeed?.[
              action.payload.inputPayload.userId
            ]?.list.map((item) =>
              item?.relation?.data?.id === action.payload.inputPayload.hangoutId
                ? {
                    ...item,
                    relation: {
                      data: {
                        ...item.relation.data,
                        liked:
                          action.payload?.data?.message === 'liked'
                            ? true
                            : false,
                        like_count: action.payload?.data.count,
                      },
                    },
                  }
                : item,
            ),
          },
        },
      };
    case TOGGLE_LIKE_HANGOUT.FAILURE:
      return {
        ...state,
        beingToggleLike: state.beingToggleLike.filter(
          (i) => i !== action.payload.inputPayload.hangoutId,
        ),
      };

    case TOGGLE_LIKE_HELP.REQUEST:
      return {
        ...state,
        beingToggleLike: state.beingToggleLike
          ? [...state.beingToggleLike]
          : [action.payload.inputPayload.helpId],
      };
    case TOGGLE_LIKE_HELP.SUCCESS:
      return {
        ...state,
        beingToggleLike: state.beingToggleLike.filter(
          (i) => i !== action.payload.inputPayload.helpId,
        ),
        newsFeed: state.newsFeed.map((item) =>
          item?.relation?.data?.id === action.payload.inputPayload.helpId
            ? {
                ...item,
                relation: {
                  data: {
                    ...item.relation.data,
                    liked:
                      action.payload?.data?.message === 'liked' ? true : false,
                    like_count: action.payload?.data.count,
                  },
                },
              }
            : item,
        ),
        selfFeed: state.selfFeed.map((item) =>
          item?.relation?.data?.id === action.payload.inputPayload.helpId
            ? {
                ...item,
                relation: {
                  data: {
                    ...item.relation.data,
                    liked:
                      action.payload?.data?.message === 'liked' ? true : false,
                    like_count: action.payload?.data.count,
                  },
                },
              }
            : item,
        ),
        userFeed: {
          ...state.userFeed,
          [action.payload.inputPayload.userId]: state.userFeed?.[
            action.payload.inputPayload.userId
          ] && {
            list: state.userFeed?.[
              action.payload.inputPayload.userId
            ]?.list.map((item) =>
              item?.relation?.data?.id === action.payload.inputPayload.helpId
                ? {
                    ...item,
                    relation: {
                      data: {
                        ...item.relation.data,
                        liked:
                          action.payload?.data?.message === 'liked'
                            ? true
                            : false,
                        like_count: action.payload?.data.count,
                      },
                    },
                  }
                : item,
            ),
          },
        },
      };
    case TOGGLE_LIKE_HELP.FAILURE:
      return {
        ...state,
        beingToggleLike: state.beingToggleLike.filter(
          (i) => i !== action.payload.inputPayload.helpId,
        ),
      };

    case TOGGLE_LIKE_STATUS.REQUEST:
      return {
        ...state,
        beingToggleLike: state.beingToggleLike
          ? [...state.beingToggleLike, action.payload.inputPayload.statusId]
          : [action.payload.inputPayload.statusId],
      };
    case TOGGLE_LIKE_STATUS.SUCCESS:
      return {
        ...state,
        beingToggleLike: state.beingToggleLike.filter(
          (i) => i !== action.payload.inputPayload.statusId,
        ),
        newsFeed: state.newsFeed.map((item) =>
          item?.relation?.data?.id === action.payload.inputPayload.statusId
            ? {
                ...item,
                relation: {
                  data: {
                    ...item.relation.data,
                    liked:
                      action.payload?.data?.message === 'liked' ? true : false,
                    like_count: action.payload?.data.count,
                  },
                },
              }
            : item,
        ),
        selfFeed: state.selfFeed.map((item) =>
          item?.relation?.data?.id === action.payload.inputPayload.statusId
            ? {
                ...item,
                relation: {
                  data: {
                    ...item.relation.data,
                    liked:
                      action.payload?.data?.message === 'liked' ? true : false,
                    like_count: action.payload?.data.count,
                  },
                },
              }
            : item,
        ),
        userFeed: {
          ...state.userFeed,
          [action.payload.inputPayload.userId]: state.userFeed?.[
            action.payload.inputPayload.userId
          ] && {
            list: state.userFeed?.[
              action.payload.inputPayload.userId
            ]?.list.map((item) =>
              item?.relation?.data?.id === action.payload.inputPayload.statusId
                ? {
                    ...item,
                    relation: {
                      data: {
                        ...item.relation.data,
                        liked:
                          action.payload?.data?.message === 'liked'
                            ? true
                            : false,
                        like_count: action.payload?.data.count,
                      },
                    },
                  }
                : item,
            ),
          },
        },
      };
    case TOGGLE_LIKE_STATUS.FAILURE:
      return {
        ...state,
        beingToggleLike: state.beingToggleLike.filter(
          (i) => i !== action.payload.inputPayload.statusId,
        ),
      };
    case UPDATE_OFFER_STATUS.REQUEST:
      return {
        ...state,
        beingUpdateOffer: state.beingUpdateOffer
          ? [...state.beingUpdateOffer, action.payload.inputPayload.id]
          : [action.payload.inputPayload.id],
      };
    case UPDATE_OFFER_STATUS.SUCCESS:
      return {
        ...state,
        beingUpdateOffer: state.beingUpdateOffer.filter(
          (i) => i !== action.payload.data.id,
        ),
        newsFeed: transformFeedStatus(
          state.newsFeed,
          action.payload.inputPayload.hangoutId,
          action.payload?.inputPayload?.status,
        ),
        selfFeed: transformFeedStatus(
          state.selfFeed,
          action.payload.inputPayload.hangoutId,
          action.payload?.inputPayload?.status,
        ),
        userFeed: {
          ...state.userFeed,
          [action.payload.inputPayload.userId]: state?.[
            action.payload.inputPayload.userId
          ] && {
            ...state?.[action.payload.inputPayload.userId],
            list: transformFeedStatus(
              state?.[action.payload.inputPayload.userId]?.list,
              action.payload.inputPayload.hangoutId,
              action.payload?.inputPayload?.status,
            ),
          },
        },
      };
    case UPDATE_OFFER_STATUS.FAILURE:
      return {
        ...state,
        beingUpdateOffer: state.beingUpdateOffer.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
      };
    case CREATE_OFFER.REQUEST:
      return {
        ...state,
        beingCreateOffer: state.beingCreateOffer
          ? [...state.beingCreateOffer, action.payload.inputPayload.hangoutId]
          : [action.payload.inputPayload.hangoutId],
      };
    case CREATE_OFFER.SUCCESS:
      return {
        ...state,
        beingCreateOffer: state.beingCreateOffer.filter(
          (i) => i !== action.payload.inputPayload.hangoutId,
        ),
        userFeed: {
          ...state.userFeed,
          [action.payload.inputPayload.userId]: state.userFeed?.[
            action.payload.inputPayload.userId
          ] && {
            ...state.userFeed?.[action.payload.inputPayload.userId],
            list: state.userFeed?.[
              action.payload.inputPayload.userId
            ]?.list.map((item) =>
              item?.relation?.data?.id === action.payload.inputPayload.hangoutId
                ? {
                    ...item,
                    relation: {
                      data: {
                        ...item.relation.data,
                        offered: true,
                        offers_count: item.relation.data.offers_count + 1,
                      },
                    },
                  }
                : item,
            ),
          },
        },
        newsFeed: state.newsFeed.map((item) =>
          item?.relation?.data?.id === action.payload.inputPayload.hangoutId
            ? {
                ...item,
                relation: {
                  data: {
                    ...item.relation.data,
                    offered: true,
                    offers_count: item.relation.data.offers_count + 1,
                  },
                },
              }
            : item,
        ),
      };
    case CREATE_OFFER.FAILURE:
      return {
        ...state,
        beingCreateOffer: state.beingCreateOffer.filter(
          (i) => i !== action.payload.inputPayload.hangoutId,
        ),
      };

    case CREATE_OFFER_HELP.REQUEST:
      return {
        ...state,
        beingCreateOfferHelp: state.beingCreateOfferHelp
          ? [...state.beingCreateOfferHelp, action.payload.inputPayload.helpId]
          : [action.payload.inputPayload.helpId],
      };
    case CREATE_OFFER_HELP.SUCCESS:
      return {
        ...state,
        beingCreateOfferHelp: state.beingCreateOfferHelp.filter(
          (i) => i !== action.payload.inputPayload.helpId,
        ),
        userFeed: {
          ...state.userFeed,
          [action.payload.inputPayload.userId]: state.userFeed?.[
            action.payload.inputPayload.userId
          ] && {
            ...state.userFeed?.[action.payload.inputPayload.userId],
            list: state.userFeed?.[
              action.payload.inputPayload.userId
            ]?.list.map((item) =>
              item?.relation?.data?.id === action.payload.inputPayload.helpId
                ? {
                    ...item,
                    relation: {
                      data: {
                        ...item.relation.data,
                        offered: true,
                        offers_count: item.relation.data.offers_count + 1,
                      },
                    },
                  }
                : item,
            ),
          },
        },
        newsFeed: state.newsFeed.map((item) =>
          item?.relation?.data?.id === action.payload.inputPayload.helpId
            ? {
                ...item,
                relation: {
                  data: {
                    ...item.relation.data,
                    offered: true,
                    offers_count: item.relation.data.offers_count + 1,
                  },
                },
              }
            : item,
        ),
      };
    case CREATE_OFFER_HELP.FAILURE:
      return {
        ...state,
        beingCreateOfferHelp: state.beingCreateOfferHelp.filter(
          (i) => i !== action.payload.inputPayload.helpId,
        ),
      };

    case UPDATE_OFFER_STATUS_HELP.REQUEST:
      return {
        ...state,
        beingUpdateOfferHelp: state.beingUpdateOfferHelp
          ? [...state.beingUpdateOfferHelp, action.payload.inputPayload.id]
          : [action.payload.inputPayload.id],
      };
    case UPDATE_OFFER_STATUS_HELP.SUCCESS:
      return {
        ...state,
        beingUpdateOfferHelp: state.beingUpdateOfferHelp.filter(
          (i) => i !== action.payload.data.id,
        ),
        newsFeed:
          action.payload?.inputPayload?.status === 'cancel'
            ? state.newsFeed.map((item) =>
                item?.relation?.data?.id === action.payload.inputPayload.helpId
                  ? {
                      ...item,
                      relation: {
                        data: {
                          ...item.relation.data,
                          offered: false,
                          offers_count:
                            item.relation.data.offers_count > 0
                              ? item.relation.data.offers_count - 1
                              : 0,
                        },
                      },
                    }
                  : item,
              )
            : state.newsFeed,
        userFeed: {
          ...state.userFeed,
          [action.payload.inputPayload.userId]: state?.[
            action.payload.inputPayload.userId
          ] && {
            ...state?.[action.payload.inputPayload.userId],
            list:
              action.payload?.inputPayload?.status === 'cancel'
                ? state?.[action.payload.inputPayload.userId]?.list.map(
                    (item) =>
                      item?.relation?.data?.id ===
                      action.payload.inputPayload.helpId
                        ? {
                            ...item,
                            relation: {
                              data: {
                                ...item.relation.data,
                                offered: false,
                                offers_count:
                                  item.relation.data.offers_count > 0
                                    ? item.relation.data.offers_count - 1
                                    : 0,
                              },
                            },
                          }
                        : item,
                  )
                : state?.[action.payload.inputPayload.userId]?.list,
          },
        },
      };
    case UPDATE_OFFER_STATUS_HELP.FAILURE:
      return {
        ...state,
        beingUpdateOfferHelp: state.beingUpdateOfferHelp.filter(
          (i) => i !== action.payload.inputPayload.id,
        ),
      };

    case GET_RECOMMEND_HANGOUTS.REQUEST:
      return {
        ...state,
        recommendListLoading: true,
        recommendList:
          action.payload?.params?.page === 1 ? [] : state.recommendList,
      };
    case GET_RECOMMEND_HANGOUTS.SUCCESS:
      let hangoutsRecommend = action?.payload?.data?.hangouts?.data || [];
      let helpsRecommend = action?.payload?.data?.helps?.data || [];
      let listRecommend = [...hangoutsRecommend, ...helpsRecommend];
      return {
        ...state,
        recommendListLoading: false,
        recommendList:
          action.payload?.meta?.pagination?.current_page === 1
            ? listRecommend
            : [...state.recommendList, ...listRecommend],
        recommendListLastPage:
          action.payload.meta?.pagination?.total_pages || 1,
      };
    case GET_RECOMMEND_HANGOUTS.FAILURE:
      return {
        ...state,
        recommendListLoading: false,
      };

    case LIST_CHAT_ROOM_PUBLIC.REQUEST:
      return {
        ...state,
        chatRoomPublicListLoading: true,
        chatRoomPublicList:
          action.payload?.params?.page === 1 ? [] : state.chatRoomPublicList,
      };
    case LIST_CHAT_ROOM_PUBLIC.SUCCESS:
      return {
        ...state,
        chatRoomPublicListLoading: false,
        chatRoomPublicList:
          action.payload?.meta?.pagination?.current_page === 1
            ? action.payload.data
            : [...state.chatRoomPublicList, ...action.payload.data],
        chatRoomPublicListLastPage:
          action.payload.meta?.pagination?.total_pages || 1,
      };
    case LIST_CHAT_ROOM_PUBLIC.FAILURE:
      return {
        ...state,
        chatRoomPublicListLoading: false,
      };

    case GET_NEARBY_HANGOUTS.REQUEST:
      return {
        ...state,
        nearbyListLoading: true,
        nearbyList: action.payload?.params?.page === 1 ? [] : state.nearbyList,
      };
    case GET_NEARBY_HANGOUTS.SUCCESS:
      let hangoutsNearBy = action?.payload?.data?.hangouts?.data || [];
      let helpsNearBy = action?.payload?.data?.helps?.data || [];
      let listNearby = [...hangoutsNearBy, ...helpsNearBy];
      return {
        ...state,
        nearbyListLoading: false,
        nearbyList:
          action.payload?.meta?.pagination?.current_page === 1
            ? listNearby
            : [...state.nearbyList, ...listNearby],
        nearbyListLastPage: action.payload.meta?.pagination?.total_pages || 1,
      };
    case GET_NEARBY_HANGOUTS.FAILURE:
      return {
        ...state,
        nearbyListLoading: false,
      };
    case GET_MAP_HANGOUTS.REQUEST:
      return {
        ...state,
        mapListLoading: true,
        mapList: action.payload?.params?.page === 1 ? [] : state.mapList,
      };
    case GET_MAP_HANGOUTS.SUCCESS:
      let hangoutsMapList = action?.payload?.data?.hangouts?.data || [];
      let helpsMapList = action?.payload?.data?.helps?.data || [];
      let listMapList = [...hangoutsMapList, ...helpsMapList];
      return {
        ...state,
        mapListLoading: false,
        mapList:
          action.payload?.meta?.pagination?.current_page === 1
            ? listMapList
            : [...state.mapList, ...listMapList],
        mapListLastPage: action.payload.meta?.pagination?.total_pages || 1,
      };
    case GET_MAP_HANGOUTS.FAILURE:
      return {
        ...state,
        mapListLoading: false,
      };
    case GET_NEWS_FEED.REQUEST:
      return {
        ...state,
        newsFeedLoading: true,
        newsFeed: action.payload?.params?.page === 1 ? [] : state.newsFeed,
        hasNewFeed: false,
      };
    case GET_NEWS_FEED.SUCCESS:
      return {
        ...state,
        newsFeedLoading: false,
        newsFeed:
          action.payload.meta?.pagination?.current_page === 1
            ? action.payload.data
            : [...state.newsFeed, ...action.payload.data],
        newsFeedLastPage: action.payload.meta?.pagination?.total_pages || 1,
      };
    case GET_NEWS_FEED.FAILURE:
      return {
        ...state,
        newsFeedLoading: false,
      };
    case GET_SELF_FEED.REQUEST:
      return {
        ...state,
        selfFeedLoading: true,
        selfFeed: action.payload?.params?.page === 1 ? [] : state.selfFeed,
      };
    case GET_SELF_FEED.SUCCESS:
      return {
        ...state,
        selfFeedLoading: false,
        selfFeed:
          action.payload.meta?.pagination?.current_page === 1
            ? action.payload.data
            : [...state.selfFeed, ...action.payload.data],
        selfFeedLastPage: action.payload.meta?.pagination?.total_pages || 1,
      };
    case GET_SELF_FEED.FAILURE:
      return {
        ...state,
        selfFeedLoading: false,
      };
    case GET_SELF_FEED.REQUEST:
      return {
        ...state,
      };
    case CHANGE_HANGOUT_STATUS.SUCCESS:
      return {
        ...state,
        selfFeed: state.selfFeed.map((i) => {
          if (i.relation?.data?.id === action.payload.inputPayload.hangoutId) {
            if (
              i.relation?.data?.available_status === EnumHangoutStatus.NO_TIME
            ) {
              i.relation.data.available_status = EnumHangoutStatus.ONLINE;
            } else {
              i.relation.data.available_status = EnumHangoutStatus.NO_TIME;
            }
          }
          return i;
        }),
      };
    case CHANGE_HANGOUT_STATUS.FAILURE:
      return {
        ...state,
      };
    case CHANGE_HELP_STATUS.SUCCESS:
      return {
        ...state,
        selfFeed: state.selfFeed.map((i) => {
          if (i.relation?.data?.id === action.payload.inputPayload.helpId) {
            if (
              i.relation?.data?.available_status === EnumHangoutStatus.NO_TIME
            ) {
              i.relation.data.available_status = EnumHangoutStatus.ONLINE;
            } else {
              i.relation.data.available_status = EnumHangoutStatus.NO_TIME;
            }
          }
          return i;
        }),
      };
    case CHANGE_HELP_STATUS.FAILURE:
      return {
        ...state,
      };
    case UPLOAD_SINGLE_IMAGE.REQUEST:
      return {
        ...state,
        beingUploadSingle: true,
      };
    case UPLOAD_SINGLE_IMAGE.SUCCESS:
      return {
        ...state,
        beingUploadSingle: false,
      };
    case UPLOAD_SINGLE_IMAGE.FAILURE:
      return {
        ...state,
        beingUploadSingle: false,
      };
    case CREATE_HANGOUT.REQUEST:
      return {
        ...state,
        beingCreateHangout: true,
      };
    case CREATE_HANGOUT.SUCCESS:
      return {
        ...state,
        beingCreateHangout: false,
        selfFeed: [
          {id: uuid(), relation: {data: action.payload.data}, type: 'hangout'},
          ...state.selfFeed,
        ],
      };
    case CREATE_HANGOUT.FAILURE:
      return {
        ...state,
        beingCreateHangout: false,
      };
    case CREATE_HELP.REQUEST:
      return {
        ...state,
        beingCreateHelp: true,
      };
    case CREATE_HELP.SUCCESS:
      return {
        ...state,
        beingCreateHelp: false,
        selfFeed: [
          {id: uuid(), relation: {data: action.payload.data}, type: 'help'},
          ...state.selfFeed,
        ],
      };
    case CREATE_HELP.FAILURE:
      return {
        ...state,
        beingCreateHelp: false,
      };
    case CREATE_STATUS.REQUEST:
      return {
        ...state,
        beingCreateStatus: true,
      };
    case CREATE_STATUS.SUCCESS:
      return {
        ...state,
        beingCreateStatus: false,
        selfFeed: [
          {id: uuid(), relation: {data: action.payload.data}, type: 'status'},
          ...state.selfFeed,
        ],
      };
    case CREATE_STATUS.FAILURE:
      return {
        ...state,
        beingCreateStatus: false,
      };
    case LOGOUT.SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
