import {
  GET_USER_RATINGS,
  POST_RATING,
  UPDATE_RATING,
  DELETE_RATING,
  LOGOUT,
} from 'actions';

const INITIAL_STATE = {
  loading: false,
  posting: false,
  updating: false,
  deleting: false,
  detail: null,
  list: [],
  lastPage: 1,
  data: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_USER_RATINGS.REQUEST:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.inputPayload.id]: {
            loading: true,
            error: null,
            detail: state.data?.[action.payload.inputPayload.id]?.detail,
            list: state.data?.[action.payload.inputPayload.id]?.list,
            lastPage: state.data?.[action.payload.inputPayload.id]?.lastPage,
          },
        },
      };
    case GET_USER_RATINGS.SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.inputPayload.id]: {
            loading: false,
            detail: {
              user: action.payload.user,
              count: action.payload.count,
              avg: action.payload.avg,
            },
            list:
              action.payload.rating.meta.pagination.total_pages === 1
                ? action.payload.rating.data
                : [
                    ...state.data?.[action.payload.inputPayload.id]?.list,
                    ...action.payload.rating.data,
                  ],
            lastPage: action.payload.rating.meta.pagination.total_pages,
          },
        },
      };
    case GET_USER_RATINGS.FAILURE:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.inputPayload.id]: {
            loading: false,
            lastPage: 1,
            list: [],
            detail: state.data?.[action.payload.inputPayload.id]?.detail,
            error: action.payload.error,
          },
        },
      };
    case POST_RATING.REQUEST:
      return {
        ...state,
        posting: true,
      };
    case POST_RATING.SUCCESS:
      return {
        ...state,
        posting: false,
      };
    case POST_RATING.FAILURE:
      return {
        ...state,
        posting: false,
      };
    case UPDATE_RATING.REQUEST:
      return {
        ...state,
        updating: true,
      };
    case UPDATE_RATING.SUCCESS:
      return {
        ...state,
        updating: false,
      };
    case UPDATE_RATING.FAILURE:
      return {
        ...state,
        updating: false,
      };
    case DELETE_RATING.REQUEST:
      return {
        ...state,
        deleting: true,
      };
    case DELETE_RATING.SUCCESS:
      return {
        ...state,
        deleting: false,
      };
    case DELETE_RATING.FAILURE:
      return {
        ...state,
        deleting: false,
      };
    case LOGOUT.SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }
}
