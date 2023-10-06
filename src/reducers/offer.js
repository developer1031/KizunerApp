import {isArray} from 'lodash';
import {
  GET_GUEST_OFFER_LIST,
  GET_CAST_OFFER_LIST,
  CREATE_OFFER,
  UPDATE_OFFER_STATUS,
  POST_RATING,
  CREATE_OFFER_HELP,
  UPDATE_OFFER_STATUS_HELP,
  GET_CAST_OFFER_LIST_HELP,
  GET_GUEST_OFFER_LIST_HELP,
} from 'actions';

const INITIAL_STATE = {
  guestList: [],
  guestListLoading: false,
  guestListLastPage: 1,
  castList: [],
  castListLoading: false,
  castListLastPage: 1,
  castHelpList: [],
  castHelpListLoading: false,
  castHelpListLastPage: 1,

  guestHelpList: [],
  guestHelpListLoading: false,
  guestHelpListLastPage: 1,

  beingUpdateOfferStatus: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_RATING.SUCCESS:
      return {
        ...state,
        castList:
          isArray(state.castList) &&
          state.castList.map((item) =>
            item.id === action.payload.inputPayload.offer_id
              ? {
                  ...item,
                  review: action.payload.data,
                }
              : item,
          ),
        guestList: (() => {
          console.log(
            '🚀 ~ file: offer.js:51 ~ state.guestList:',
            state.guestList,
          );
          return (
            isArray(state.guestList) &&
            state.guestList.map((item) =>
              item.id === action.payload.inputPayload.offer_id
                ? {
                    ...item,
                    review: action.payload.data,
                  }
                : item,
            )
          );
        })(),

        castHelpList:
          isArray(state.castHelpList) &&
          state.castHelpList.map((item) =>
            item.id === action.payload.inputPayload.offer_id
              ? {
                  ...item,
                  review: action.payload.data,
                }
              : item,
          ),
      };
    case CREATE_OFFER.SUCCESS:
      return {
        ...state,
        castList: [action.payload.data, ...state.castList],
      };
    case CREATE_OFFER_HELP.SUCCESS:
      return {
        ...state,
        castHelpList: [action.payload.data, ...state.castHelpList],
      };

    // offer hangout
    case UPDATE_OFFER_STATUS.REQUEST:
      return {
        ...state,
        beingUpdateOfferStatus: true,
      };
    case UPDATE_OFFER_STATUS.SUCCESS:
      return {
        ...state,
        castList: (() => {
          console.log(
            '🚀 ~ file: offer.js:98 ~ state.castList:',
            state.castList,
          );
          return (
            isArray(state.castList) &&
            state.castList.map((item) =>
              item.id === action.payload.data.id ? action.payload.data : item,
            )
          );
        })(),
        guestList: (() => {
          console.log(
            '🚀 ~ file: offer.js:106 ~ state.guestList:',
            state.guestList,
          );
          return (
            isArray(state.guestList) &&
            state.guestList.map((item) =>
              item.id === action.payload.data.id ? action.payload.data : item,
            )
          );
        })(),
        castHelpList: (() => {
          console.log(
            '🚀 ~ file: offer.js:115 ~ state.castHelpList:',
            state.castHelpList,
          );
          return (
            isArray(state.castHelpList) &&
            state.castHelpList.map((item) =>
              item.id === action.payload.data.id ? action.payload.data : item,
            )
          );
        })(),
        guestHelpList: (() => {
          console.log(
            '🚀 ~ file: offrer.js:124 ~ state.guestHelpList:',
            state.guestHelpList,
          );
          return (
            isArray(state.guestHelpList) &&
            state.guestHelpList.map((item) =>
              item.id === action.payload.data.id ? action.payload.data : item,
            )
          );
        })(),
        beingUpdateOfferStatus: false,
      };
    case UPDATE_OFFER_STATUS.FAILURE:
      return {
        beingUpdateOfferStatus: false,
      };

    // offer help
    case UPDATE_OFFER_STATUS_HELP.REQUEST:
      return {
        ...state,
        beingUpdateOfferStatus: true,
      };
    case UPDATE_OFFER_STATUS_HELP.SUCCESS:
      return {
        ...state,
        castList: (() => {
          console.log(
            '🚀 ~ file: offer.js:131 ~ state.castList:',
            state.castList,
          );
          return (
            isArray(state.castList) &&
            state.castList.map((item) =>
              item.id === action.payload.data.id ? action.payload.data : item,
            )
          );
        })(),
        guestList: (() => {
          console.log(
            '🚀 ~ file: offer.js:137 ~ state.guestList:',
            state.guestList,
          );
          return (
            isArray(state.guestList) &&
            state.guestList.map((item) =>
              item.id === action.payload.data.id ? action.payload.data : item,
            )
          );
        })(),
        castHelpList: (() => {
          console.log(
            '🚀 ~ file: offer.js:156 ~ state.castHelpList:',
            state.castHelpList,
          );
          return (
            isArray(state.castHelpList) &&
            state.castHelpList.map((item) =>
              item.id === action.payload.data.id ? action.payload.data : item,
            )
          );
        })(),
        guestHelpList: (() => {
          console.log(
            '🚀 ~ file: offer.js:164 ~ state.guestHelpList:',
            state.guestHelpList,
          );
          return (
            isArray(state.guestHelpList) &&
            state.guestHelpList.map((item) =>
              item.id === action.payload.data.id ? action.payload.data : item,
            )
          );
        })(),
        beingUpdateOfferStatus: false,
      };
    case UPDATE_OFFER_STATUS_HELP.FAILURE:
      return {
        ...state,
        beingUpdateOfferStatus: false,
      };

    //==============
    case GET_GUEST_OFFER_LIST.REQUEST:
      return {
        ...state,
        guestListLoading: true,
      };
    case GET_GUEST_OFFER_LIST.SUCCESS:
      return {
        ...state,
        guestList:
          action.payload.meta.pagination.current_page === 1
            ? action.payload.data
            : [...state.guestList, ...action.payload.data],
        guestListLoading: false,
        guestListLastPage: action.payload.meta.pagination.total_pages,
      };
    case GET_GUEST_OFFER_LIST.FAILURE:
      return {
        ...state,
        guestListLoading: false,
      };
    case GET_CAST_OFFER_LIST.REQUEST:
      return {
        ...state,
        castListLoading: true,
      };
    case GET_CAST_OFFER_LIST.SUCCESS:
      return {
        ...state,
        castList:
          action.payload.meta.pagination.current_page === 1
            ? action.payload.data
            : [...state.castList, ...action.payload.data],
        castListLoading: false,
        castListLastPage: action.payload.meta.pagination.total_pages,
      };
    case GET_CAST_OFFER_LIST.FAILURE:
      return {
        ...state,
        castListLoading: false,
      };
    case GET_CAST_OFFER_LIST_HELP.REQUEST:
      return {
        ...state,
        castHelpListLoading: true,
      };
    case GET_CAST_OFFER_LIST_HELP.SUCCESS:
      return {
        ...state,
        castHelpList:
          action.payload.meta.pagination.current_page === 1
            ? action.payload.data
            : [...state.castHelpList, ...action.payload.data],
        castHelpListLoading: false,
        castHelpListLastPage: action.payload.meta.pagination.total_pages,
      };
    case GET_CAST_OFFER_LIST_HELP.FAILURE:
      return {
        ...state,
        castHelpListLoading: false,
      };

    case GET_GUEST_OFFER_LIST_HELP.REQUEST:
      return {
        ...state,
        guestHelpListLoading: true,
      };
    case GET_GUEST_OFFER_LIST_HELP.SUCCESS:
      return {
        ...state,
        guestHelpList:
          action.payload.meta.pagination.current_page === 1
            ? action.payload.data
            : [...state.guestHelpList, ...action.payload.data],
        guestHelpListLoading: false,
        guestHelpListLastPage: action.payload.meta.pagination.total_pages,
      };
    case GET_GUEST_OFFER_LIST_HELP.FAILURE:
      return {
        ...state,
        guestHelpListLoading: false,
      };

    default:
      return state;
  }
};
